import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

/**
 * Custom sign in for admin using email/password
 */
export const adminSignIn = async (email: string, pass: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data.user;
  } catch (error: any) {
    console.error('Admin Sign-In Error:', error);
    throw error;
  }
};

let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Sync active session on load
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user) {
      const token = session.provider_token || session.access_token || '';
      cachedAccessToken = token;
      cachedUser = session.user;
      if (onAuthSuccess) onAuthSuccess(session.user, token);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      const token = session.provider_token || session.access_token || '';
      cachedAccessToken = token;
      cachedUser = session.user;
      if (onAuthSuccess) onAuthSuccess(session.user, token);
    } else {
      cachedAccessToken = null;
      cachedUser = null;
      if (onAuthFailure) onAuthFailure();
    }
  });

  return () => {
    subscription.unsubscribe();
  };
};

// Sign in with popup logic for Google OAuth using Supabase client
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/meetings.space.created',
        redirectTo: `${window.location.origin}/oauth-callback.html`,
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error('No OAuth authorize URL returned');

    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        data.url,
        'google-oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject(new Error('Popup blocked by browser. Please allow popups for this site.'));
        return;
      }

      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === 'supabase-oauth-callback') {
          window.removeEventListener('message', messageHandler);

          const hash = event.data.hash;
          const params = new URLSearchParams(hash.substring(1));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const provider_token = params.get('provider_token');

          if (access_token && refresh_token) {
            try {
              const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

              if (sessionErr) throw sessionErr;

              const token = provider_token || sessionData.session?.provider_token || access_token;
              cachedAccessToken = token;

              if (sessionData.user) {
                cachedUser = sessionData.user;
                resolve({ user: sessionData.user, accessToken: token });
              } else {
                reject(new Error('No user data in session'));
              }
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error('Auth callback missing token credentials'));
          }
        }
      };

      window.addEventListener('message', messageHandler);

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          setTimeout(() => {
            reject(new Error('popup-closed-by-user'));
          }, 300);
        }
      }, 500);
    });
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await supabase.auth.signOut();
  cachedAccessToken = null;
  cachedUser = null;
};

// Google Meet space creation
export interface MeetSpace {
  meetingUri: string;
  name: string;
}

export const createGoogleMeetSpace = async (token: string): Promise<MeetSpace> => {
  try {
    const res = await fetch('https://meet.googleapis.com/v2/spaces', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const message = errBody?.error?.message || `HTTP ${res.status} error during Meet creation`;
      throw new Error(message);
    }

    const data = await res.json();
    const nameVal = data.name || '';
    const spaceId = nameVal.includes('/') ? nameVal.split('/').pop() : nameVal;
    const meetingUri = data.meetingUri || `https://meet.google.com/${spaceId}`;

    return {
      meetingUri,
      name: nameVal,
    };
  } catch (error: any) {
    console.error('createGoogleMeetSpace failed:', error);
    throw error;
  }
};
