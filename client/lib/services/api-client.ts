import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Utils } from "./storage";
import { baseDevUrl } from "@/constants/constants";
import { showCustomAlertMessage, Toast } from "./toasts";

export type MethodType = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

export interface ApiInterface {
  endPoint: string;
  method: MethodType;
  data?: object;
  params?: object;
  isMultipart?: boolean;
  baseUrl?: string;
}

export const get = async (api: AxiosInstance, url: string, params?: object) => {
  try {
    const response = await api.get(url, { params });

    return response.data;
  } catch (error) {
    console.log(
      `get response error ${url} ${JSON.stringify(params)} >>> `,
      JSON.stringify(error)
    );
    throw error;
  }
};

export async function put(api: AxiosInstance, url: string, data: object) {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error: any) {
    console.log(
      `put response error ${url} ${JSON.stringify(data)} >>> `,
      JSON.stringify(error)
    );
    return {
      success: false,
      message:
        error?.response?.data?.errors?.error?.[0] ??
        error?.response?.data?.message,
    };
  }
}

export async function post(api: AxiosInstance, url: string, data: object) {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    console.log(
      `post response error ${url} ${JSON.stringify(data)} >>> `,
      JSON.stringify(error)
    );
    return {
      success: false,
      message:
        error?.response?.data?.errors?.error?.[0] ??
        error?.response?.data?.message,
    };
  }
}

export async function patch(api: AxiosInstance, url: string, data: object) {
  try {
    const response = await api.patch(url, data);

    return response.data;
  } catch (error: any) {
    console.log(
      `patch response error ${url} ${JSON.stringify(data)} >>> `,
      JSON.stringify(error)
    );
    return {
      success: false,
      message:
        error?.response?.data?.errors?.error?.[0] ??
        error?.response?.data?.message,
    };
  }
}

export async function del(
  api: AxiosInstance,
  url: string,
  params?: object,
  data?: object
) {
  try {
    // If data is provided, send it as body; otherwise use params in query string
    const config = data ? { data } : { params };
    const response = await api.delete(url, config);

    return response.data;
  } catch (error: any) {
    console.log(
      `del response error ${url} ${JSON.stringify(params || data)} >>> `,
      JSON.stringify(error)
    );
    return {
      success: false,
      message:
        error?.response?.data?.errors?.error?.[0] ??
        error?.response?.data?.message,
    };
  }
}

/**
 * Handle auto logout when token expires or unauthorized
 */
function handleAutoLogout() {
  if (typeof window !== "undefined") {
    Utils.removeItem("authToken");
    Utils.removeItem("userProfile");
    // Redirect to login page
    window.location.href = "/login";
  }
}

export async function apiCall(props: ApiInterface) {
  const {
    endPoint,
    method,
    data = {},
    params,
    isMultipart = false,
    baseUrl,
  } = props;

  // Create axios instance
  const api: AxiosInstance = axios.create({
    baseURL: baseUrl || baseDevUrl, // Use custom baseUrl if provided
    timeout: 30000,
    headers: {
      "Content-Type": !isMultipart ? "application/json" : "multipart/form-data",
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Check internet connection (browser)
      if (!Utils.isOnline()) {
        showCustomAlertMessage("Check!", "No Internet Connection", "info");
        console.log("No Internet Connection");
        return Promise.reject(new Error("No Internet Connection"));
      }

      // Add auth token if available
      const authToken = await Utils.getItem("authToken");

      if (Utils.isValidString(authToken)) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (error) => {
      console.log("request error >>> ", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      console.log("response error >>> ", error);

      if (error.response) {
        // Handle response errors
        const { status, data } = error.response;

        const errorMessage =
          Array.isArray(data?.errors) && data?.errors.length > 0
            ? (data?.errors[0] && Object.values(data?.errors[0])[0]) ||
              "Unknown error"
            : data?.message || "There was an issue with your request.";

        switch (status) {
          case 400:
            // Handle Bad Request
            console.error("Bad Request", data);
            showCustomAlertMessage("Check!", errorMessage, "danger");
            break;

          case 401:
            // Handle Unauthorized
            console.error("Unauthorized", data);
            showCustomAlertMessage(
              "Check!",
              "Please make sure you are logged in",
              "danger"
            );
            // Uncomment to enable auto logout
            // handleAutoLogout();
            break;

          case 404:
            // Handle Not Found
            console.error("Not Found", data);
            Toast.show({
              type: "error",
              text1: errorMessage,
            });
            break;

          case 403:
            // Handle Forbidden
            console.error("Forbidden", data);
            showCustomAlertMessage(
              "Error",
              "You do not have permission to access this resource",
              "danger"
            );
            break;

          case 500:
            // Handle Internal Server Error
            console.error("Internal Server Error", data);
            showCustomAlertMessage(
              "Error",
              "Internal server error. Please try again later.",
              "danger"
            );
            break;

          default:
            // Handle other status codes
            console.error(`Error ${status}`, data);
            showCustomAlertMessage("Error", errorMessage, "danger");
            break;
        }
      } else if (error.request) {
        // No response received
        console.error("No response received", error.request);
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "No response received from the server.",
        });
      } else {
        // Request setup error
        console.error("Error", error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An error occurred while setting up the request.",
        });
      }

      return Promise.reject(error);
    }
  );

  // Execute API call based on method
  switch (method) {
    case "GET":
      return await get(api, endPoint, params || data);
    case "PUT":
      return await put(api, endPoint, data);
    case "POST":
      return await post(api, endPoint, data);
    case "PATCH":
      return await patch(api, endPoint, data);
    case "DELETE":
      // For DELETE, if data is provided, use it as body; otherwise use params
      return await del(api, endPoint, params, data);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}

// Export as default object for compatibility
export default { apiCall, get, put, post, patch, del };
