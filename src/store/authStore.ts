import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '../services/firebase';

interface AuthStore {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setAdmin: (isAdmin: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,

      login: async (email: string, _password: string, name?: string) => {
        // Simular login - reemplazar con lógica real
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Extraer nombre del email si no se proporciona
        const userName = name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
        
        set({
          isAuthenticated: true,
          isAdmin: email.includes('admin'),
          user: { name: userName, email },
        });
      },

      loginWithGoogle: async () => {
        if (!firebaseAuth || !isFirebaseConfigured) {
          throw new Error('Firebase is not configured for Google sign-in.');
        }

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(firebaseAuth, provider);
        const email = result.user.email || '';
        const userName = result.user.displayName || (email ? email.split('@')[0] : 'User');

        set({
          isAuthenticated: true,
          isAdmin: email.includes('admin'),
          user: { name: userName, email },
        });
      },

      logout: async () => {
        if (firebaseAuth) {
          await signOut(firebaseAuth);
        }

        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
        });
      },

      setAdmin: (isAdmin: boolean) => {
        set({ isAdmin });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
