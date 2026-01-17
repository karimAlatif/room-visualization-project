import { ToastOptions } from "react-hot-toast";

export const getToastOptions: Record<string, ToastOptions> = {
    success: {
        icon: "✅",
    },
    error: {
        icon: "❌",
    },
    info: {
        icon: "ℹ️",
    },
    warning: {
        icon: "⚠️",
    },
    default: {},
};
