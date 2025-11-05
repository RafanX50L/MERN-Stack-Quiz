import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { UserInterface } from "@/types/user";


export interface AuthState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  lastLocation: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  lastLocation: null,
};

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh-Token",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log("Sending refresh token request...");
      const response = await api.post(
        "/auth/refresh-Token",
        {},
        { withCredentials: true }
      );
      console.log("Refresh token response:", response.data);
      
      // Handle new backend response format: response.data.data
      const responseData = response.data.data;
      if (!responseData || !responseData.accessToken) {
        throw new Error("No access token in response");
      }
      
      dispatch(setCredentials({ 
        user: responseData.user, 
        accessToken: responseData.accessToken 
      }));
      
      return {
        user: responseData.user,
        accessToken: responseData.accessToken,
      };
    } catch (error) {
      console.error("Refresh token error:", error);
      dispatch(logout());
      return rejectWithValue("Session expired, please login again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInterface; accessToken: string;}>
    ) => {
      console.log("Setting credentials:", action.payload);
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("accessTokenData", JSON.stringify({accessToken:action.payload.accessToken,}));
      localStorage.setItem("sessionActive", "true");
    },
    logout: (state) => {
      console.log("Logging out...");
      state.isAuthenticated = false;
      state.user = null;
      state.lastLocation = null;
      localStorage.removeItem("sessionActive");
      localStorage.removeItem("accessTokenData");
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserInterface>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLastLocation: (state, action: PayloadAction<string>) => {
      state.lastLocation = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        console.log("Refresh token fulfilled:", action.payload);
        authSlice.caseReducers.setCredentials(state, {
          payload: {
            user: action.payload.user,
            accessToken: action.payload.accessToken,
          },
          type: action.type,
        });
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        console.log("Refresh token rejected");
        state.isAuthenticated = false;
        state.user = null;
        state.lastLocation = null;
        localStorage.removeItem("sessionActive");
      });
  },
});

export const { setCredentials, logout, updateUserProfile, setLastLocation } = authSlice.actions;
export default authSlice.reducer;