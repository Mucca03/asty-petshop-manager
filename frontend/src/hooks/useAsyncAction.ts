import {useCallback, useEffect, useRef, useState} from "react";
import {getErrorMessage} from "../utils/errors.ts";

export type AsyncActionStatus = "idle" | "pending" | "success" | "error";

/**
 * Explicit write-side state machine:
 *
 *   idle -> pending -> success
 *                    -> error
 *   success/error -> pending (retry)
 *
 * `args` are kept in the state so views can tell *which* row is pending or
 * which row succeeded without juggling extra booleans. Concurrent runs are
 * rejected by the internal lock, which makes double-clicks harmless.
 */
export type AsyncActionState<TArgs extends unknown[], TResult> =
    | {status: "idle"; args: null; data: null; error: null}
    | {status: "pending"; args: TArgs; data: TResult | null; error: null}
    | {status: "success"; args: TArgs; data: TResult; error: null}
    | {status: "error"; args: TArgs; data: null; error: string};

interface UseAsyncActionOptions {
    errorMessage?: string;
}

export const useAsyncAction = <TArgs extends unknown[], TResult>(
    action: (...args: TArgs) => Promise<TResult>,
    options: UseAsyncActionOptions = {},
) => {
    const {errorMessage = "No se pudo completar la acción."} = options;
    // Keep the latest action without making `run` unstable across renders.
    const actionRef = useRef(action);
    const pendingRef = useRef(false);
    const mountedRef = useRef(true);
    const [state, setState] = useState<AsyncActionState<TArgs, TResult>>({
        status: "idle",
        args: null,
        data: null,
        error: null,
    });

    useEffect(() => {
        actionRef.current = action;
    }, [action]);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const run = useCallback(async (...args: TArgs): Promise<TResult | null> => {
        if (pendingRef.current) {
            return null;
        }

        pendingRef.current = true;
        setState({status: "pending", args, data: null, error: null});

        try {
            const data = await actionRef.current(...args);

            if (mountedRef.current) {
                setState({status: "success", args, data, error: null});
            }

            return data;
        } catch (error) {
            if (mountedRef.current) {
                setState({
                    status: "error",
                    args,
                    data: null,
                    error: getErrorMessage(error, errorMessage),
                });
            }

            return null;
        } finally {
            pendingRef.current = false;
        }
    }, [errorMessage]);

    const reset = useCallback(() => {
        if (pendingRef.current) {
            return;
        }

        setState({status: "idle", args: null, data: null, error: null});
    }, []);

    return {
        state,
        run,
        reset,
        isPending: state.status === "pending",
        error: state.status === "error" ? state.error : null,
        data: state.status === "success" ? state.data : null,
    };
};
