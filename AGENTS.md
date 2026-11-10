# Guía para agentes

## Mapa rápido

| Área | Ruta |
| --- | --- |
| Dominio compartido (FSM de servicios) | `shared/serviceLifecycle.ts` |
| Inventario de máquinas de estado | `docs/state-machines.md` |
| API Express | `backend/src/index.ts`, `backend/src/controllers` |
| Esquema Prisma | `backend/prisma/schema.prisma` |
| UI React | `frontend/src/components` |
| Hooks de estado remoto | `frontend/src/hooks` |
| Clientes HTTP | `frontend/src/services` |

## Reglas del proyecto

1. **No compares `service.status` con strings.** Importa desde `frontend/src/domain/serviceLifecycle.ts` (frontend) o `shared/serviceLifecycle.ts` (backend) y usa `normalizeServiceStatus`, `getServiceStatusMeta`, `canTransitionServiceStatus`, `isServiceStatusOpen` o `isServiceStatusCompleted`.
2. **Toda transición de servicio se valida en el backend.** No agregues una acción de UI que el backend no permita.
3. **No uses booleanos sueltos para estados remotos.** Usa `useAsyncResource` para lecturas y `useAsyncAction` para escrituras.
4. **No repitas lógica de paginación.** Usa `usePagination`.
5. **Los errores de API son JSON** `{error: string, code?: string}`. La UI los muestra con `getErrorMessage`.
6. **Compatibilidad:** los alias de estado viejos (`Pagado`, `Listo`, etc.) deben seguir funcionando. Agrega alias nuevos en `SERVICE_STATUS_ALIASES` en lugar de condicionales.

## Comandos

```bash
# Backend
cd backend && npm run dev
cd backend && npm test
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint
```

## Verificación mínima antes de terminar

```bash
cd backend && npm test && npm run build
cd frontend && npm run build && npm run lint
```

Si tocaste `shared/serviceLifecycle.ts`, revisa también su tabla de transiciones en `docs/state-machines.md`.
