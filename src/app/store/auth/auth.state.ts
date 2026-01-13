export interface AuthState {
  currentUserEmail: string | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  currentUserEmail: null,
  isAuthenticated: false
};