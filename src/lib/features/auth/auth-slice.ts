import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Role = {
  id: number;
  name: string;
  guard_name: string;
};

type Permission = {
  id: number;
  name: string;
  guard_name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  is_active?: boolean;
  roles: Role[];
  permissions: Permission[];
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // -------------------
    // Set Credentials
    // -------------------  
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    // -------------------
    // Set User
    // -------------------  
    setUser: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // -------------------
    // Logout
    // -------------------  
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export default authSlice.reducer;