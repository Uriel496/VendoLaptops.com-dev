VendoLaptops Backend (Jorge Emir - Backend)

1) Objetivo
Este backend implementa:
- API REST para admin (productos, cupones, marcas)
- Autenticacion con JWT (registro/login/me)
- Mensajeria cliente-vendedor (inbox/sent/create/read)
- Pagos Mercado Pago + webhook
- Seguridad base: CORS, validaciones, manejo de errores, variables de entorno
- Persistencia real en MariaDB (auto-crea DB/tablas al iniciar)

2) Requisitos
- Node.js 20+
- MariaDB 10.6+
- Variables en .env (copiar desde .env.example)

3) Configuracion de entorno
Crea .env con:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- JWT_SECRET
- JWT_EXPIRES_IN
- MP_ACCESS_TOKEN (si usaras pagos)
- CORS_ORIGIN

4) Levantar backend
Desde VendoLaptops.com:
- npm install
- npm run dev:api

Servidor:
- http://localhost:8787

5) Pruebas rapidas (PowerShell)
- Salud:
  Invoke-RestMethod -Uri "http://localhost:8787/api/health" -Method GET
- Bootstrap admin:
  Invoke-RestMethod -Uri "http://localhost:8787/api/admin/bootstrap" -Method GET
- Registrar usuario:
  Invoke-RestMethod -Uri "http://localhost:8787/api/auth/register" -Method POST -ContentType "application/json" -Body '{"fullName":"Test User","email":"test@example.com","password":"Test1234","role":"customer"}'
- Login:
  Invoke-RestMethod -Uri "http://localhost:8787/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"Test1234"}'

6) Despliegue recomendado
- Frontend en Vercel
- Backend en servicio Node con MariaDB (Railway/Render/DigitalOcean/VPS)
- Si quieres todo en Vercel, usar DB remota accesible por IP/SSL y exponer API serverless con las mismas rutas.

7) Estado del frontend
No se modifico UI/frontend. Solo backend y variables de entorno.
