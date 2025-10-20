# Copilot Instructions for NGO Codebase

## Project Overview
- **Monorepo** with two main parts:
  - `client/` — React + Vite frontend (TypeScript, Bootstrap, react-router-dom)
  - Backend (Node.js/Express, MongoDB, Cloudinary for images)
- Public: Instagram-style photo gallery, static info pages, donation info
- Admin: Photo upload/management, registration, payments (now static info)

## Key Patterns & Conventions
- **Frontend**
  - All API calls use `axios` and are centralized in each page/component
  - Types live in `client/src/types/`
  - Gallery and admin photo management use mock data or `/api/photos` endpoints
  - Donation page now shows static bank details and a Google Form (iframe) for recording donations
  - Responsive design: Bootstrap grid, custom CSS in `index.css`/`App.css`
  - No Redux or global state; context only for auth
- **Backend**
  - REST API in `routes/` (photos, auth, etc.)
  - File uploads: Multer + Cloudinary, see `config/cloudinary.js`
  - Auth: JWT, admin role check middleware
  - MongoDB models in `models/`

## Developer Workflows
- **Frontend**
  - Dev: `cd client && npm run dev` (Vite, hot reload)
  - Build: `cd client && npm run build` (output in `client/dist/`)
  - Static deploys (e.g. Vercel): Only `client/` is needed
- **Backend**
  - Dev: `npm start` (runs `server.js`)
  - MongoDB must be running locally or via Atlas

## Integration Points
- **API URLs**: Set via `.env` in `client/` (VITE_API_URL)
- **Image uploads**: Use Cloudinary, credentials in `.env`
- **Donation records**: Google Forms embed, not backend

## Examples
- See `client/src/pages/Gallery.tsx` for photo display pattern
- See `client/src/pages/Admin/Photos.tsx` for admin upload logic
- See `client/src/pages/Donation.tsx` for static donation info + Google Form

## Customization
- To add new static pages: copy a file in `client/src/pages/`, add route in `App.tsx`
- To change donation info: edit `Donation.tsx` and update Google Form link

---
Keep instructions concise and focused on this codebase's actual structure and workflows. If unsure, check the referenced files for real examples.
