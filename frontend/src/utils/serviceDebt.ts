/**
 * Backwards-compatible import location. The implementation lives in the
 * shared service lifecycle module so the backend and frontend always agree.
 */
export {getServiceDebt} from "../domain/serviceLifecycle.ts";
