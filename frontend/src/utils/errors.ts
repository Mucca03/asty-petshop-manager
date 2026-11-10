interface ApiErrorBody {
    error?: unknown;
    message?: unknown;
}

const getApiBodyMessage = (error: unknown): string | null => {
    if (typeof error !== "object" || error === null || !("response" in error)) {
        return null;
    }

    const response = (error as {response?: {data?: unknown}}).response;
    const data = response?.data;

    if (typeof data !== "object" || data === null) {
        return null;
    }

    const {error: apiError, message} = data as ApiErrorBody;

    if (typeof apiError === "string" && apiError.trim().length > 0) {
        return apiError.trim();
    }

    if (typeof message === "string" && message.trim().length > 0) {
        return message.trim();
    }

    return null;
};

/**
 * Turns unknown errors (Axios, network, validation) into a message that can be
 * shown to a real user. Always returns a non-empty string.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
    const apiMessage = getApiBodyMessage(error);

    if (apiMessage) {
        return apiMessage;
    }

    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message.trim();
    }

    return fallback;
};
