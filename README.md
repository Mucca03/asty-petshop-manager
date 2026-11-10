# Asty · Petshop Manager

Aplicación full-stack para gestionar clientes, mascotas y servicios de un petshop. Incluye un panel general con métricas, gráfica de ingresos, distribución de servicios por estado, movimientos recientes y mejores clientes.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0B0B0B)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

## Características

- **Panel de control** con indicadores de clientes, mascotas, servicios e ingresos.
- **Ingresos** facturados en los últimos seis meses, cobrado, pendiente y ticket promedio.
- **Servicios por estado** en gráfica de dona.
- **Servicios recientes** y **top clientes** por facturación.
- **Registro de clientes** junto con su mascota y primer servicio, en una sola transacción.
- **Listado de clientes** con teléfonos, mascotas y servicios.
- **Ciclo de vida de servicios explícito** (`Pendiente`, `En proceso`, `Completado`, `Cancelado`) validado por el backend.
- Estados de carga, error, reintento y listas vacías consistentes en todas las vistas.
- Diseño responsive para escritorio, tablet y móvil.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 7, React Router 7, Axios, CSS |
| Backend | Node.js, Express 5, TypeScript, Prisma 6 |
| Base de datos | PostgreSQL |

## Estructura del proyecto

```text
asty-petshop-manager/
├── shared/
│   └── serviceLifecycle.ts    # FSM de servicios, alias y estado de pago
├── docs/
│   └── state-machines.md      # Inventario y diagramas de las FSM
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/       # Lógica de clientes, mascotas y servicios
│   │   ├── middleware/        # Contrato JSON de errores
│   │   ├── routes/            # Endpoints de Express
│   │   ├── services/          # Cliente de Prisma
│   │   ├── utils/             # Errores HTTP tipados
│   │   └── index.ts           # Punto de entrada del servidor
│   ├── tests/                 # Pruebas de la FSM compartida
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Dashboard, navbar y páginas
│   │   ├── domain/            # Re-export del dominio compartido
│   │   ├── hooks/             # FSM de lectura, mutación y paginación
│   │   ├── services/          # Llamadas a la API con Axios
│   │   ├── types/             # Tipos de TypeScript
│   │   ├── utils/             # Mensajes de error para la UI
│   │   ├── App.tsx
│   │   └── index.css
│   ├── vite.config.ts         # Proxy de /api hacia el backend
│   └── package.json
└── README.md
```

## Requisitos

- **Node.js** 20.19+ o 22.12+ (requerido por Vite 7).
- **npm** 10+.
- **PostgreSQL** 14+ en ejecución.
- Una base de datos creada para el proyecto, por ejemplo `asty_petshop`.

Puedes crear la base de datos con:

```bash
createdb asty_petshop
```

O desde `psql`:

```sql
CREATE DATABASE asty_petshop;
```

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd asty-petshop-manager
```

### 2. Configurar y ejecutar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `backend/.env` con tus credenciales de PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/asty_petshop?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/asty_petshop?schema=public"
PORT=3000
```

> `DATABASE_URL` y `DIRECT_URL` pueden tener el mismo valor en desarrollo local. Si usas Prisma Accelerate, `DIRECT_URL` debe apuntar a la conexión directa de la base de datos.

Genera el cliente de Prisma y sincroniza el esquema con la base de datos:

```bash
npx prisma generate
npx prisma db push
```

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El backend quedará disponible en **http://localhost:3000**.

### 3. Configurar y ejecutar el frontend

En otra terminal, desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173** en el navegador.

El frontend llama a `/api/*` y Vite redirige esas peticiones a `http://localhost:3000`, por lo que **el backend debe estar corriendo** para ver los datos del panel.

### 4. Verificar que todo funciona

```bash
curl http://localhost:3000/
# Welcome to Express & TypeScript Server

curl http://localhost:3000/clients
# Lista de clientes en JSON
```

## Variables de entorno

El archivo `backend/.env` es obligatorio para que Prisma pueda conectarse a PostgreSQL.

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexión usada por Prisma Client | `postgresql://postgres:postgres@localhost:5432/asty_petshop?schema=public` |
| `DIRECT_URL` | Conexión directa usada por Prisma para migraciones | Igual que `DATABASE_URL` en local |
| `PORT` | Puerto del servidor Express | `3000` |

Puedes tomar como base el archivo [`backend/.env.example`](backend/.env.example). El archivo `.env` está ignorado por Git.

## Rutas del frontend

| Ruta | Descripción |
| --- | --- |
| `/` | Panel de control con métricas y resumen general |
| `/crearCliente` | Formulario para registrar cliente, mascota y servicio |
| `/verCliente` | Tabla con clientes, mascotas y servicios registrados |

## API

El servidor Express expone los endpoints directamente en la raíz. En desarrollo, el frontend los consume a través del prefijo `/api` gracias al proxy de Vite.

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/` | Mensaje de bienvenida del servidor |
| `GET` | `/clients` | Lista de clientes con teléfonos, mascotas y servicios |
| `GET` | `/clients/:id` | Detalle de un cliente |
| `POST` | `/clients` | Crea un cliente y sus teléfonos |
| `POST` | `/pets` | Crea una mascota asociada a un cliente |
| `POST` | `/services` | Crea un servicio asociado a una mascota |
| `PATCH` | `/services/:id/status` | Transiciona el estado de un servicio |
| `DELETE` | `/services/:id` | Elimina un servicio |
| `POST` | `/registrations` | Crea cliente + mascota + primer servicio de forma atómica |

### Ejemplos de peticiones

**Crear cliente**

```http
POST /clients
Content-Type: application/json

{
  "name": "María González",
  "phones": ["555 120 3344"]
}
```

**Crear mascota**

```http
POST /pets
Content-Type: application/json

{
  "name": "Luna",
  "raza": "Golden Retriever",
  "client_id": 1
}
```

**Crear servicio**

```http
POST /services
Content-Type: application/json

{
  "service_type": "Baño y corte",
  "details": "Corte completo con baño medicado",
  "price": 450,
  "paid_amount": 450,
  "status": "completed",
  "pet_id": 1
}
```

**Registrar cliente + mascota + primer servicio (atómico)**

```http
POST /registrations
Content-Type: application/json

{
  "client": {
    "name": "María González",
    "phone": "555 120 3344"
  },
  "pet": {
    "name": "Luna",
    "raza": "Golden Retriever",
    "edad": "Adulto"
  },
  "service": {
    "service_type": "Baño y corte",
    "details": "Corte completo con baño medicado",
    "price": 450,
    "paid_amount": 0
  }
}
```

> `status` ya no es texto libre. Acepta las claves canónicas (`pending`, `in_progress`, `completed`, `cancelled`), sus etiquetas en español (`Pendiente`, `En proceso`, `Completado`, `Cancelado`) y alias heredados (`Pagado`, `Listo`, `Agendado`, etc.). Si se omite, el servicio nace como `Pendiente`. Las filas antiguas con alias se siguen mostrando correctamente.

## Máquinas de estado

El proyecto modela explícitamente sus estados en lugar de repartir condicionales y regex por los componentes. El inventario completo, diagramas y reglas de cambio están en [`docs/state-machines.md`](docs/state-machines.md).

| Máquina | Dónde vive | Qué resuelve |
| --- | --- | --- |
| Ciclo de vida del servicio | `shared/serviceLifecycle.ts` | Estados, transiciones legales, alias y tonos de UI |
| Estado de pago (derivado) | `shared/serviceLifecycle.ts` | `unpaid`, `partial`, `paid`, `overpaid` a partir de precio/pagado |
| Lectura remota | `frontend/src/hooks/useAsyncResource.ts` | `loading → success \| error`, reintentos y carreras |
| Mutación remota | `frontend/src/hooks/useAsyncAction.ts` | `idle → pending → success \| error`, bloqueo anti doble clic |
| Registro | `backend/src/controllers/registration.controller.ts` | Cliente + mascota + servicio en una sola escritura |
| Paginación | `frontend/src/hooks/usePagination.ts` | Página siempre dentro de `[1, totalPages]` |

Regla de oro: **no compares `service.status` con strings**. Usa `normalizeServiceStatus`, `getServiceStatusMeta`, `isServiceStatusOpen` o `canTransitionServiceStatus`.

## Modelo de datos

```mermaid
erDiagram
    clients ||--o{ client_phones : registra
    clients ||--o{ pets : posee
    pets ||--o{ services : recibe

    clients {
        int id PK
        string name
        datetime created_at
    }

    client_phones {
        int id PK
        string phone
        int client_id FK
    }

    pets {
        int id PK
        string name
        string raza
        int client_id FK
        datetime created_at
    }

    services {
        int id PK
        string service_type
        string details
        decimal price
        decimal paid_amount
        string status
        datetime date
        int pet_id FK
    }
```

## Scripts disponibles

### Backend (`cd backend`)

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor con nodemon y ts-node |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada |
| `npm test` | Valida la FSM compartida de servicios |
| `npx prisma generate` | Genera el cliente de Prisma |
| `npx prisma db push` | Sincroniza el esquema con la base de datos |
| `npx prisma studio` | Abre Prisma Studio para explorar los datos |

### Frontend (`cd frontend`)

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Verifica tipos y genera la build de producción |
| `npm run preview` | Sirve la build de producción |
| `npm run lint` | Ejecuta ESLint |

## Producción

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Los archivos estáticos se generan en `frontend/dist/`. Para producción, sirve esa carpeta desde tu servidor o CDN y configura el enrutamiento de la API según tu infraestructura.

> El proxy `/api` de Vite solo aplica al servidor de desarrollo. En producción, el frontend y la API deben compartir dominio o configurarse con la URL correspondiente.

## Solución de problemas

| Problema | Posible solución |
| --- | --- |
| `Can't reach database server` o error `P1001` | Verifica que PostgreSQL esté en ejecución y que las credenciales de `backend/.env` sean correctas. |
| `Environment variable not found: DATABASE_URL` | Crea `backend/.env` a partir de `.env.example` y reinicia el backend. |
| Prisma Client no está generado | Ejecuta `npx prisma generate` dentro de `backend/`. |
| El panel muestra "No pudimos cargar el panel" | Confirma que el backend esté corriendo en el puerto `3000`. |
| Error de CORS o 404 al llamar a `/api` | Revisa que el backend esté activo y que el proxy de `frontend/vite.config.ts` apunte al puerto correcto. |
| El puerto `3000` o `5173` está ocupado | Cambia `PORT` en `backend/.env` y actualiza el `target` del proxy en `frontend/vite.config.ts`; para Vite usa `npm run dev -- --port <nuevo-puerto>`. |
| La tabla no existe en la base de datos | Ejecuta `npx prisma db push` en `backend/`. |

## Notas

- El dashboard calcula sus métricas en el frontend a partir de `GET /clients`; no existe un endpoint separado de estadísticas.
- No hay autenticación ni roles implementados actualmente.
- No hay migraciones versionadas todavía: el esquema se sincroniza con `prisma db push`. Para un flujo de producción, considera crear migraciones con `npx prisma migrate dev`.
