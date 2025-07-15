import axios from "axios";
import { toast } from "react-toastify";
// import { setLoading } from "../redux/action/loading/loadingActions";

const apiBaseUrl = import.meta.env.VITE_FREESOUND_BASE_URL;
const apiKey = import.meta.env.VITE_FREESOUND_API_KEY;
// import store from "../redux/store";
// import store from "../redux/";


const axiosInstance = axios.create({
  baseURL: apiBaseUrl,

  headers: {
    "x-api-key": apiKey,
    'Authorization': 'Basic UG9kY2FzdDpQb2RjYXN0I2RAMTAwMzIwMjQ='
  },
});

axiosInstance.interceptors.request.use(
  function configuration(config) {
    const token =
      localStorage.getItem("ACCESS_TOKEN") ||
      localStorage.getItem("RESET_TOKEN");
    if (token) config.headers.authorization = `Bearer ${token}`;
    // config.headers["Accept-Language"] = i18next.language;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (result) {
    // store.dispatch(setLoading(false));
    return result;
  },
  function (error) {
    // store.dispatch(setLoading(false));
    if (error.response && error.response.data.code === 401) {
      localStorage.clear();
      toast.error("Your session has expired. Please log in again.");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    }
    return Promise.reject(error);
  }
);

export const GET = async (url, params) => {
  try {
    let result = await axiosInstance.get(url, { params: params });
    return result;
  } catch (error) {
    return error?.response;
  }
};

export const DELETE = async (url, params, data) => {
  try {
    let result = await axiosInstance.delete(url, { params, data });
    return result;
  } catch (error) {
    return error?.response;
  }
};

export const POST = async (url, body, options) => {
  try {
    let result = await axiosInstance.post(url, body, options);
    return result;
  } catch (error) {
    return error?.response;
  }
};

export const PUT = async (url, body, options) => {
  try {
    let result = await axiosInstance.put(url, body, options);
    return result;
  } catch (error) {
    return error?.response;
  }
};

export const PATCH = async (url, body, options) => {
  try {
    let result = await axiosInstance.patch(url, body, options);
    return result;
  } catch (error) {
    return error?.response;
  }
};

export { axiosInstance };
