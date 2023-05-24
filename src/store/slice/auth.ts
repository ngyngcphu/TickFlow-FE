import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { authService } from '@services';
import { LOGIN_SUCCESS, LOGIN_FAILURE } from '@constants';

const userStr = localStorage.getItem('user');
let user = null;
if (userStr) {
  user = JSON.parse(userStr);
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: Auth, thunkAPI) => {
    try {
      const data = await authService.login(username, password);
      toast.success(LOGIN_SUCCESS);
      return { user: data };
    } catch (err) {
      const errPayload = (err as AxiosError).response?.data as ResponseError;
      toast.error(LOGIN_FAILURE);
      throw thunkAPI.rejectWithValue(errPayload);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const initialState = user
  ? { isAuthenticated: true, user }
  : { isAuthenticated: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export default authSlice.reducer;