import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/api";
import axios from "axios";

export const generateAffirmationAudio = createAsyncThunk(
  "affirmation/generateAudio",
  async (data, { rejectWithValue }) => {
    try {
      const response = await POST("audiomix/audio-generate/", data);
      if (response?.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.data || "Failed to generate audio");
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while generating audio"
      );
    }
  }
);

export const audioList = createAsyncThunk(
  "audio/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GET(`audiomix/audio-list/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while fetching profile"
      );
    }
  }
);

export const sampleVoiceListFun = createAsyncThunk(
  "smaple/audio/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(`audiomix/voice/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while fetching profile"
      );
    }
  }
);

export const generateAffirmationAudioRecord = createAsyncThunk(
  "affirmation/generateAudioRecord",
  async ({ formData, token, apiKey }, { rejectWithValue }) => {
    try {
      const response = await POST("audiomix/audio-generate-record/", formData, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(apiKey && { "X-API-KEY": apiKey }),
        },
      });
      if (response?.status === 200 || response?.status === 201) {
        return response.data;
      } else {
        return rejectWithValue(response?.data || "Failed to generate audio");
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while generating audio"
      );
    }
  }
);

const AffermationSlice = createSlice({
  name: "affer",
  initialState: {
    AudioListData: [],
    AudioListLoading: false,
    AudioListError: null,
    SampleListData: [],
    SampleListLoading: false,
    SampleListError: null,
    generateAudio: [],
    generateAudioLoading: false,
    generateAudioError: null,
    generateAudioRecord: [],
    generateAudioRecordLoading: false,
    generateAudioRecordError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(audioList.pending, (state) => {
        state.AudioListLoading = true;
        state.AudioListError = null;
      })
      .addCase(audioList.fulfilled, (state, action) => {
        state.AudioListLoading = false;
        state.AudioListData = action?.payload?.result;
      })
      .addCase(audioList.rejected, (state, action) => {
        state.AudioListLoading = false;
        state.AudioListError = action.error.message;
      });

    builder
      .addCase(sampleVoiceListFun.pending, (state) => {
        state.SampleListLoading = true;
        state.SampleListError = null;
      })
      .addCase(sampleVoiceListFun.fulfilled, (state, action) => {
        state.SampleListLoading = false;
        state.SampleListData = action?.payload?.result;
      })
      .addCase(sampleVoiceListFun.rejected, (state, action) => {
        state.SampleListLoading = false;
        state.SampleListError = action.error.message;
      });

    builder
      .addCase(generateAffirmationAudio.pending, (state) => {
        state.generateAudioLoading = true;
        state.generateAudioError = null;
      })
      .addCase(generateAffirmationAudio.fulfilled, (state, action) => {
        state.generateAudioLoading = false;
        state.generateAudio = action?.payload?.result;
      })
      .addCase(generateAffirmationAudio.rejected, (state, action) => {
        state.generateAudioLoading = false;
        state.generateAudioError = action.error.message;
      });

    builder
      .addCase(generateAffirmationAudioRecord.pending, (state) => {
        state.generateAudioRecordLoading = true;
        state.generateAudioRecordError = null;
      })
      .addCase(generateAffirmationAudioRecord.fulfilled, (state, action) => {
        state.generateAudioRecordLoading = false;
        state.generateAudioRecord = action?.payload?.result;
      })
      .addCase(generateAffirmationAudioRecord.rejected, (state, action) => {
        state.generateAudioRecordLoading = false;
        state.generateAudioRecordError = action.error.message;
      });
  },
});

export default AffermationSlice.reducer;
