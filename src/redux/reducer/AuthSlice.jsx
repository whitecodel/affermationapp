import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  {GET, POST, PUT}  from '../../services/api';
import axios from "axios";

// Define the async thunk for the GET request
export const AuthAction = createAsyncThunk('data/auth', async (data, { rejectWithValue }) => {

  try {
    const response = await POST(`auth/login/`, data);
    if (response?.status === 200) {
      return response.data.result; // Assuming the response is in data property
    } else {
      return rejectWithValue(response?.data || "Something went wrong");
    }
  } catch (error) {
    return rejectWithValue(error?.response?.data || "Failed to fetch data");
  }
}
);




export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await POST('auth/register/', data);
      if (response?.status === 201 || response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.data || "Registration failed");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Network error during registration");
    }
  }
);



export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otp, sessionId }, { rejectWithValue }) => {
    try {
      // const headers = {
      //   Authorization: `Bearer ${sessionId}`, // Passing sessionId as a token in headers
      //   "Content-Type": "application/json",
      // };

      const response = await axios.post(
        "/admin/auth/otp/verify",
        { otp },  // Request body
        { sessionId } // Headers
      );

      if (response?.status === 200) {
        return response.data.result; // Assuming success response contains result
      } else {
        return rejectWithValue(response?.data || "Invalid OTP");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "OTP verification failed");
    }
  }
);






export const forgotPasswordAction = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await POST(`auth/password/forgot/`, data);
      if (response?.status === 200) {
        return response.data; // Return success response data
      } else {
        return rejectWithValue(response?.data || "Something went wrong");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to send password reset request");
    }
  }
);

export const updateProfileAction = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const url = 'auth/profile/'; // Relative path since baseURL is set in axiosInstance
      const response = await PUT(url, data); // 'data' will contain the body (e.g., { fullname: "test3" })

      if (response?.status === 200) {
        return response.data; // Return success response data
      } else {
        // Use rejectWithValue to pass the error data to the rejected state
        return rejectWithValue(response?.data || "Something went wrong during profile update");
      }
    } catch (error) {
      // Catch network errors or other unexpected errors
      return rejectWithValue(error?.response?.data || "Failed to send profile update request");
    }
  }
);

// View Home Category
export const viewAdminProfile = createAsyncThunk(
  "admin/viewProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(`auth/profile/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred while fetching profile");
    }
  }
);




const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: [],
    AuthLoading: false,
    AuthError: null,
    RegisterData: [],
    RegisterLoading: false,
    RegisterError: null,
    viewProfile: "",
    viewProfileLoading: false,
    viewProfileError: null,
    forgetData: [],
    forgetLoading: false,
    forgetError: null,
    verifyData: [],
    verifyOtpActionLoading: false,
    verifyError: null,
    UpdateProfileData: [],
    UpdateProfileLoading: false,
    UpdateProfileError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AuthAction.pending, (state) => {
        state.AuthLoading = true;
        state.AuthError = null;
      })
      .addCase(AuthAction.fulfilled, (state, action) => {
        state.AuthLoading = false;
        state.authData = action.result;
      })
      .addCase(AuthAction.rejected, (state, action) => {
        state.AuthLoading = false;
        state.AuthError = action.error.message;
      });

      builder
      .addCase(registerUser.pending, (state) => {
        state.RegisterLoading = true;
        state.RegisterError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.RegisterLoading = false;
        state.RegisterData = action.result;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.RegisterLoading = false;
        state.RegisterError = action.error.message;
      });


      builder
      .addCase(forgotPasswordAction.pending, (state) => {
        state.forgetLoading = true;
        state.forgetError = null;
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.forgetLoading = false;
        state.forgetData = action?.payload.result?.token;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.forgetLoading = false;
        state.forgetError = action.error.message;
      });

      builder
      .addCase(updateProfileAction.pending, (state) => {
        state.UpdateProfileLoading = true;
        state.UpdateProfileError = null;
      })
      .addCase(updateProfileAction.fulfilled, (state, action) => {
        state.UpdateProfileLoading = false;
        state.UpdateProfileData = action;
      })
      .addCase(updateProfileAction.rejected, (state, action) => {
        state.UpdateProfileLoading = false;
        state.UpdateProfileError = action.error.message;
      });

      builder
      .addCase(viewAdminProfile.pending, (state) => {
        state.viewProfileLoading = true;
        state.viewProfileError = null;
      })
      .addCase(viewAdminProfile.fulfilled, (state, action) => {
        state.viewProfileLoading = false;
        state.viewProfile = action?.payload.result;
      })
      .addCase(viewAdminProfile.rejected, (state, action) => {
        state.viewProfileLoading = false;
        state.viewProfileError = action.error.message;
      });



      builder
      .addCase(verifyOtpAction.pending, (state) => {
        state.verifyOtpActionLoading = true;
        state.verifyError = null;
      })
      .addCase(verifyOtpAction.fulfilled, (state, action) => {
        state.verifyOtpActionLoading = false;
        state.verifyData = action.result;
      })
      .addCase(verifyOtpAction.rejected, (state, action) => {
        state.verifyOtpActionLoading = false;
        state.verifyError = action.error.message;
      });
  },
});

export default AuthSlice.reducer;
