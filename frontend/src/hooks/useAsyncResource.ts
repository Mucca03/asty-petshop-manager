import {useCallback, useEffect, useRef, useState} from "react";
import {getErrorMessage} from "../utils/errors.ts";

export type AsyncResourceStatus = "loading" | "success" | "error";

/**
 * Explicit read-side state machine:
 *
 *   loading -> success
 *   loading -> error
 *   success/error -> loading (retry)
 *
 * `data` can survive a retry, but the status always tells the whole truth,
 * so `isLoading` and `isError` can never both be true.
 */
export type AsyncResourceState<T> =
    | {status: "loading"; data: T | null; error: null}
    | {status: "success"; data: T; error: null}
    | {status: "error"; data: T | null; error: string};

interface UseAsyncResourceOptions {
    errorMessage?: string;
}

export const useAsyncResource = <T>(
    load: () => Promise<T>,
    options: UseAsyncResourceOptions = {},
) => {
    const {errorMessage = "No se pudieron cargar los datos."} = options;
    // Read `load` through a ref so callers can pass an inline function without
    // causing an infinite fetch loop. Call `reload()` when its inputs change.
    const loadRef = useRef(load);
    const requestIdRef = useRef(0);
    const mountedRef = useRef(true);
    const [state, setState] = useState<AsyncResourceState<T>>({
        status: "loading",
        data: null,
        error: null,
    });

    useEffect(() => {
        loadRef.current = load;
    }, [load]);

    const reload = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        setState(current => ({
            status: "loading",
            data: current.data,
            error: null,
        }));

        try {
            const data = await loadRef.current();

            if (mountedRef.current && requestId === requestIdRef.current) {
                setState({status: "success", data, error: null});
            }
        } catch (error) {
            if (mountedRef.current && requestId === requestIdRef.current) {
                setState(current => ({
                    status: "error",
                    data: current.data,
                    error: getErrorMessage(error, errorMessage),
                }));
            }
        }
    }, [errorMessage]);

    useEffect(() => {
        mountedRef.current = true;
        void reload();

        return () => {
            mountedRef.current = false;
            requestIdRef.current += 1;
        };
    }, [reload]);

    /**
     * Applies a successful optimistic mutation using the current loaded data.
     * No-op when the resource has not loaded successfully yet.
     */
    const setData = useCallback((updater: (current: T) => T) => {
        setState(current => {
            if (current.data === null) {
                return current;
            }

            return {
                status: "success",
                data: updater(current.data),
                error: null,
            };
        });
    }, []);

    return {
        state,
        data: state.data,
        status: state.status,
        error: state.status === "error" ? state.error : null,
        isLoading: state.status === "loading",
        isError: state.status === "error",
        reload,
        setData,
    };
};
