# Vantage App

<img width="500" height="500" alt="Image" src="https://github.com/user-attachments/assets/99600496-d2ff-41aa-86b8-f52d71161844" />

A finance app for balances and transactions managament!

- **Frontend:** https://ctd-vantage.netlify.app/
- **Backend:** https://ctd-vantage.onrender.com
- **Swagger API docs:** https://ctd-vantage.onrender.com/api-docs

## Stack

- **Frontend:** React, Vite, React Router, Axios, SCSS
- **Backend:** Node, Express 5, MongoDB (Mongoose), JWT, Helmet, Swagger

## Run locally

**Backend** (`backend/`)

- Copy `.env` with `MONGO_URI`, `JWT_SECRET`, `JWT_LIFETIME`
- `npm install` → `npm run dev`

**Frontend** (`frontend/`)

- Set `VITE_API_URL` to your backend URL (`http://localhost:4000`)
- `npm install` → `npm run dev`

## Backend tests

Uses Mocha + Chai + Supertest -> `npm test` (backend)

## Project structure

- `backend/` — Express API, Auth with JWT, Balances and Transactions CRUD, Swagger, Tests
- `frontend/` — React, Auth, Balances & Transaction pages
