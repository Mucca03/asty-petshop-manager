import assert from "node:assert/strict";
import test from "node:test";
import {
    canTransitionServiceStatus,
    getServiceDebt,
    getServicePayment,
    getServiceStatusMeta,
    isServiceStatusCompleted,
    isServiceStatusOpen,
    normalizeServiceStatus,
    SERVICE_STATUS,
    SERVICE_STATUS_DEFINITIONS,
    SERVICE_STATUS_ORDER,
    SERVICE_STATUS_TRANSITIONS,
    serviceStatusLabel,
} from "../../shared/serviceLifecycle";

test("normalizes canonical keys, Spanish labels and legacy aliases", () => {
    assert.equal(normalizeServiceStatus("pending"), SERVICE_STATUS.pending);
    assert.equal(normalizeServiceStatus("Pendiente"), SERVICE_STATUS.pending);
    assert.equal(normalizeServiceStatus("PENDIENTE"), SERVICE_STATUS.pending);
    assert.equal(normalizeServiceStatus("En proceso"), SERVICE_STATUS.inProgress);
    assert.equal(normalizeServiceStatus("en_progreso"), SERVICE_STATUS.inProgress);
    assert.equal(normalizeServiceStatus("Pagado"), SERVICE_STATUS.completed);
    assert.equal(normalizeServiceStatus("finalizada"), SERVICE_STATUS.completed);
    assert.equal(normalizeServiceStatus("Agendado"), SERVICE_STATUS.pending);
    assert.equal(normalizeServiceStatus("Rechazada"), SERVICE_STATUS.cancelled);
    assert.equal(normalizeServiceStatus("  "), null);
    assert.equal(normalizeServiceStatus("no-existe"), null);
    assert.equal(normalizeServiceStatus(null), null);
});

test("every canonical status has a definition and a valid transition list", () => {
    for (const status of SERVICE_STATUS_ORDER) {
        const definition = SERVICE_STATUS_DEFINITIONS[status];
        assert.equal(definition.key, status);
        assert.ok(definition.label.length > 0);

        for (const target of SERVICE_STATUS_TRANSITIONS[status]) {
            assert.ok(SERVICE_STATUS_ORDER.includes(target));
        }
    }
});

test("enforces legal transitions and allows repairs of unknown legacy values", () => {
    assert.equal(canTransitionServiceStatus("Pendiente", SERVICE_STATUS.inProgress), true);
    assert.equal(canTransitionServiceStatus("Pendiente", SERVICE_STATUS.completed), true);
    assert.equal(canTransitionServiceStatus("En proceso", SERVICE_STATUS.completed), true);
    assert.equal(canTransitionServiceStatus("Cancelado", SERVICE_STATUS.pending), true);
    assert.equal(canTransitionServiceStatus("Completado", SERVICE_STATUS.pending), false);
    assert.equal(canTransitionServiceStatus("Completado", SERVICE_STATUS.completed), true);
    assert.equal(canTransitionServiceStatus("estado-viejo", SERVICE_STATUS.completed), true);
    assert.equal(canTransitionServiceStatus("Pendiente", "no-existe"), false);
});

test("exposes presentation metadata from the same source", () => {
    assert.equal(getServiceStatusMeta("Pagado").label, "Completado");
    assert.equal(getServiceStatusMeta("Pagado").tone, "success");
    assert.equal(getServiceStatusMeta("En proceso").tone, "info");
    assert.equal(getServiceStatusMeta("Pendiente").tone, "warning");
    assert.equal(getServiceStatusMeta("Cancelado").tone, "danger");
    assert.equal(getServiceStatusMeta("Completado").isTerminal, true);
    assert.equal(getServiceStatusMeta("raro").category, "unknown");
    assert.equal(getServiceStatusMeta("raro").label, "raro");
    assert.equal(serviceStatusLabel(SERVICE_STATUS.inProgress), "En proceso");
});

test("classifies open and completed services", () => {
    assert.equal(isServiceStatusOpen("Pendiente"), true);
    assert.equal(isServiceStatusOpen("En proceso"), true);
    assert.equal(isServiceStatusOpen("Completado"), false);
    assert.equal(isServiceStatusCompleted("listo"), true);
    assert.equal(isServiceStatusCompleted("Pendiente"), false);
});

test("derives payment state instead of persisting it", () => {
    assert.equal(getServicePayment(100, 0).state, "unpaid");
    assert.equal(getServicePayment(100, 40).state, "partial");
    assert.equal(getServicePayment(100, 100).state, "paid");
    assert.equal(getServicePayment(100, 120).state, "overpaid");
    assert.equal(getServicePayment(100, 40).debt, 60);
    assert.equal(getServicePayment(100, 120).debt, 0);
    assert.equal(getServiceDebt("450.00", "100.00"), 350);
    assert.equal(getServicePayment(0, 0).state, "paid");
});

test("keeps the documented transition table in sync", () => {
    assert.deepEqual(
        [...SERVICE_STATUS_TRANSITIONS[SERVICE_STATUS.pending]],
        [SERVICE_STATUS.inProgress, SERVICE_STATUS.completed, SERVICE_STATUS.cancelled],
    );
    assert.deepEqual([...SERVICE_STATUS_TRANSITIONS[SERVICE_STATUS.completed]], []);
});
