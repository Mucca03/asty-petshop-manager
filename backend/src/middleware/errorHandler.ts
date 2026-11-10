import type {NextFunction, Request, Response} from "express";
import {HttpError} from "../utils/httpError";

interface PrismaLikeError {
    code?: string;
}

const isPrismaError = (error: unknown): error is PrismaLikeError => (
    typeof error === "object" && error !== null && "code" in error
);

/**
 * One JSON error contract for the whole API:
 *   { error: string, code?: string }
 *
 * Express 5 forwards rejected async handlers here automatically.
 */
export const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof HttpError) {
        res.status(error.status).json({
            error: error.message,
            ...(error.code ? {code: error.code} : {}),
        });
        return;
    }

    if (error instanceof SyntaxError && "status" in error && error.status === 400) {
        res.status(400).json({
            error: "El cuerpo de la petición no es JSON válido.",
            code: "INVALID_JSON",
        });
        return;
    }

    if (isPrismaError(error)) {
        if (error.code === "P2002") {
            res.status(409).json({
                error: "Ya existe un registro con esos datos.",
                code: "DUPLICATE_RECORD",
            });
            return;
        }

        if (error.code === "P2025") {
            res.status(404).json({
                error: "El registro no existe.",
                code: "NOT_FOUND",
            });
            return;
        }
    }

    console.error(error);
    res.status(500).json({
        error: "Error interno del servidor.",
        code: "INTERNAL_ERROR",
    });
};
