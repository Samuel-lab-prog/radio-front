import { create } from 'zustand';

export type AuthClient = {
  id: number;
  role: 'admin' | 'listener';
  status: 'active' | 'blocked' | 'pending' | 'suspended';
};

type AuthState = {
  client: AuthClient | null;
  status: 'unknown' | 'loading' | 'authenticated' | 'anonymous';
  setClient: (client: AuthClient | null) => void;
  setStatus: (status: AuthState['status']) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  client: null,
  status: 'unknown',
  setClient: (client) =>
    set({
      client,
      status: client ? 'authenticated' : 'anonymous',
    }),
  setStatus: (status) => set({ status }),
}));
