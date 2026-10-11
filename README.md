# SkyTech CMS (Content Management System)

A modern, high-performance Admin Command Center built with **React**, **Vite**, and **Vanilla CSS Design System**, designed to manage dynamic content across the **SkyTech** website ecosystem.

---

## 🏛️ System Architecture

The overall SkyTech platform is structured into three independent, coordinated projects:

```
                  ┌──────────────────────────────────────────────┐
                  │          SkyTech Spring Boot Backend         │
                  │   Port: 8081 | PostgreSQL | Spring Security   │
                  └───────────────▲───────────────▲──────────────┘
                                  │               │
                     REST APIs    │               │  REST APIs
                     (Public)     │               │  (Admin CRUD)
                                  │               │
       ┌──────────────────────────┴────┐     ┌────┴──────────────────────────┐
       │     SkyTech Public Website    │     │       SkyTech CMS Admin       │
       │    Port: 5173 | React + Vite  │     │    Port: 5174 | React + Vite  │
       │      (Customer Facing)        │     │     (Content Management)      │
       └───────────────────────────────┘     └───────────────────────────────┘
```

1. **`skytech-backend` (`D:\Project\skytech-backend`)**:
   - Handles REST APIs, PostgreSQL database transactions, authentication, and core business logic.
   - Default port: `http://localhost:8081`.

2. **`skytech-frontend` (`D:\Project\skytech-frontend`)**:
   - The public-facing e-commerce & rental storefront visited by users.
   - Dynamically consumes APIs (e.g. `/api/topmarquee/getTopMarquee`) to render content in real time.
   - Default port: `http://localhost:5173`.

3. **`skytech-cms` (`D:\Project\skytech-cms`)**:
   - Dedicated administrative control panel to create, edit, toggle, and publish content without modifying code or redeploying the website.
   - Default port: `http://localhost:5174`.

---

## ✨ Core Features & Modules

- 📣 **Top Marquee Bar Management:**
  - Full CRUD integration with Spring Boot backend (`/api/topmarquee`).
  - Add, edit, delete, and toggle visibility on the live marquee header.
  - Live rolling ticker preview right inside the dashboard.
- 🖼️ **Hero Banners & Carousel Slides:**
  - Create and configure marketing slides, images, taglines, and bullet highlights.
  - Live visual preview matching the public storefront layout.
- 💻 **Product Catalog & Inventory:**
  - Manage Refurbished Laptops, Gaming Desktops, and Accessories.
  - Control pricing, technical specifications, conditions, and in-stock flags.
- ⚙️ **Site Settings & Menus:**
  - Update store contact numbers, support email, WhatsApp quick-chat number, store address, and operating hours dynamically.
- 📬 **Inquiries & Leads Viewer:**
  - Track customer contact forms, rental requests, and hardware repair quotes.
- ⚡ **Offline Resilience & Health Ping:**
  - Shows real-time connection status with the Spring Boot backend.
  - Transparent local fallback cache prevents disruption during backend downtime or maintenance.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)

### 2. Installation
```bash
cd D:\Project\skytech-cms
npm install
```

### 3. Environment Configuration
The project includes a `.env` configuration:
```env
VITE_API_BASE_URL=http://localhost:8081
VITE_FRONTEND_URL=http://localhost:5173
```

### 4. Running the Development Server
```bash
npm run dev
```
The CMS will be available at: **`http://localhost:5174`**.

### 5. Production Build
```bash
npm run build
```
