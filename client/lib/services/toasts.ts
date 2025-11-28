import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

interface ShowToastOptions {
  type?: ToastType;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  text1?: string;
  text2?: string;
  description?: string;
  duration?: number;
}

/**
 * Show toast notification
 */
export function showToast(options: ShowToastOptions) {
  const { type = "info", text1, text2, description, duration = 4000 } = options;

  const message = text1 || text2 || description || "";
  const desc = text2 && text1 ? text2 : description;

  switch (type) {
    case "success":
      toast.success(message, {
        description: desc,
        duration,
      });
      break;
    case "error":
      toast.error(message, {
        description: desc,
        duration,
      });
      break;
    case "warning":
      toast.warning(message, {
        description: desc,
        duration,
      });
      break;
    case "info":
    default:
      toast.info(message, {
        description: desc,
        duration,
      });
      break;
  }
}

/**
 * Custom alert message (compatible with mobile app API)
 */
export function showCustomAlertMessage(
  title: string,
  message: string,
  type: "success" | "danger" | "info" | "warning" = "info",
  position?: "top" | "bottom"
) {
  const toastType: ToastType =
    type === "danger"
      ? "error"
      : type === "success"
      ? "success"
      : type === "warning"
      ? "warning"
      : "info";

  showToast({
    type: toastType,
    text1: title,
    text2: message,
  });
}

/**
 * Direct toast methods (similar to react-native-toast-message API)
 */
export const Toast = {
  show: (options: ShowToastOptions) => {
    showToast(options);
  },
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
};

export default Toast;
