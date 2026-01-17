import { JSX } from "react";
import toast, { ToastOptions, ToastPosition } from "react-hot-toast";
import { getToastOptions } from "./ToastOprions";
type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface ShowToastParams extends ToastOptions {
    message: string;
    type?: ToastType;
    position?: ToastPosition;
    duration?: number;
    icon?: string | JSX.Element;
}

export const showToast = ({
    message,
    type = "info",
    ...options
}: ShowToastParams): string => {

    switch (type) {
        case "success":
            return toast.success(message, options);
        case "error":
            return toast.error(message, options);
        case "loading":
            return toast.loading(message, options);
        case "info":
        case "warning":
        default:
            return toast(message, { icon: getToastOptions[type].icon, ...options });
    }
};

export const showPromiseToast = <T>(
    promise: Promise<T>,
    {
        loading,
        success,
        error,
    }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
    },
    options?: ToastOptions
) => {
    return toast.promise(promise, { loading, success, error }, options);
};

export const dismissToast = (id?: string) => toast.dismiss(id);
