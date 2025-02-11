import { AxiosError } from "axios";

export function errorMessage(error: unknown) {
    let errorMessage = "An unexpected error has occurred";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    if (error instanceof AxiosError) {
        if (error.response && error.response.data) {
            const apiMessage = error.response.data.message || error.response.data.error;
            errorMessage = apiMessage || "Unknown API error";
        }
    }
    if(typeof error === "string"){
        errorMessage = error;
    }
    return errorMessage;
}