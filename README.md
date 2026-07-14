# 🌱 PlanNet – A Plant Nursery Management System

## 🎯 Project Purpose

PlanNet is a comprehensive full-stack web application designed to bridge the gap between plant sellers and nature enthusiasts.  
It provides a platform where sellers can manage their nursery inventory seamlessly, and customers can explore, purchase, and bring home lush greenery with ease.  
The platform emphasizes a clean user experience, secure transactions, and efficient management tools.

---

###

🔗 [🌐 Live Link](https://fardins.shop)

---

## 🗝 Key Features

### 🔐 Authentication & Security
- Secure **Email/Password** Login, Signup, and **Google Sign-in** powered by **Firebase**.
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for **Admins**, **Sellers**, and **Customers**.
- **JWT Token Authentication** on all protected API routes.
- Secured Private Routes on the frontend to protect sensitive pages.
- Axios interceptors with dynamic token injection — no race conditions.

### 🏠 Home & Shop
- Stunning hero banner with a responsive plant showcase.
- **Live Search & Filtering:** Filter plants by category with instant results.
- **Advanced Sorting:** Sort by Price (Low→High / High→Low), Newest First, and Alphabetically.
- Plant Cards with images, prices, categories, and quantity indicators.
- **Plant Care Guide** section explaining water, light, and soil recommendations per plant.

### ⭐ Ratings & Reviews
- Customers can submit star ratings and written reviews on any plant detail page.
- Reviews are displayed with reviewer name, date, and star rating.

### ❤️ Wishlist System
- Floating heart button on plant detail pages to save/unsave plants to wishlist.
- Dedicated **Customer Wishlist Dashboard** page to browse saved plants and add directly to cart.
- Wishlist data stored per user in MongoDB.

### 🎟️ Coupon & Discount System
- **Admin Coupon Manager** to create, view, and delete promo codes.
- Coupons support both **percentage** and **fixed amount** discounts.
- Apply coupon codes in the Cart page or directly in the Purchase Modal.
- Discount is proportionally applied to Stripe line items.

### 💳 Secure Payments (Stripe)
- Integrated **Stripe** payment gateway for safe and reliable transactions.
- Direct "Purchase Now" flow via a modal without needing to add to cart first.
- Order status updates upon successful payment confirmation.

### 📦 Order Tracking
- Visual **step-by-step progress bar**: Ordered → In Progress → Delivered.
- Status-matching indicators shown in Customer Order History (desktop table and mobile cards).
- Sellers can update order statuses from their dashboard.

### 🖼️ Custom User Profiles
- **Custom Cover Photo:** Users can upload a banner cover image on their profile.
- **Vertical Repositioning Slider:** Drag a slider to set the ideal crop/position of the cover image (avoids heads being cut off).
- Profile displays: avatar, cover image, role badge, registration date, and account statistics.
- Auto-prefills shipping details (name, address, phone) from saved profile data.

### 👥 Advanced Admin User Management
- **Statistics Dashboard:** Summary cards showing total users, admins, sellers, and pending seller requests.
- **Live Search:** Filter users by name or email in real time.
- **Filter by Role & Status:** Dropdowns to filter the user list.
- **Color-Coded Badges:** Distinct styled badges per role (Admin, Seller, Customer) and status (Verified, Requested, Unavailable).
- **Approve Button:** Instantly approve pending seller requests or verify unverified admins/sellers.
- **Custom Delete Modal:** Confirmation modal showing the target account email before deletion.
- **Update Role Modal:** Change any user's role via a sleek modal.

### 📊 Admin Statistics (Charts)
- Animated **Recharts AreaChart** with responsive grid overlays, axis labels, and tooltips.

### 📱 Fully Responsive
- Optimized layouts for mobile, tablet, and desktop screens.
- Mobile sidebar with fixed z-index stacking to prevent overlap issues.
- Cards view on mobile, table view on desktop for all dashboard lists.

---

## 👤 User Roles

### 👑 Admin
- Manage all users: view, update roles, verify accounts, and delete.
- Manage coupon codes (create & delete).
- View platform-wide statistics and order data.
- Access all admin-only protected routes.

### 🏪 Seller
- Add new plants with image uploads, update details, and delete inventory.
- Monitor plant sales and order statuses.
- Update order statuses (Pending → In Progress → Delivered).
- Apply for seller verification (status: Requested).

### 🛒 Customer
- Browse and search plants by category, keyword, price, or sorting.
- Add plants to wishlist (save for later).
- Add to cart and apply coupon codes at checkout.
- Purchase directly via "Purchase Now" button.
- View order history with real-time progress tracking.
- Rate and review purchased plants.

---

## 📦 NPM Packages Used (Frontend)

| Package | Purpose |
|---------|---------|
| `react` | Core React library |
| `react-router-dom` | Routing & Navigation |
| `firebase` | Authentication |
| `@tanstack/react-query` | Data Fetching & Caching |
| `axios` | Secure HTTP Client with interceptors |
| `react-hook-form` | Form handling & Validation |
| `@stripe/stripe-js` + `@stripe/react-stripe-js` | Payment Processing |
| `tailwindcss` | Utility-first CSS framework |
| `daisyui` | UI Component library |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Modern icon library |
| `recharts` | Animated charts & statistics |
| `@headlessui/react` | Accessible modal & dialog components |

---

## 🧩 Tools & Technologies

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | TailwindCSS + DaisyUI |
| **Authentication** | Firebase Auth (Email + Google) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Atlas) |
| **Payment** | Stripe API |
| **Image Upload** | ImgBB API |
| **State Management** | TanStack Query + React Context |
| **Deployment** | Vercel (Frontend & Backend) |

---

## ⚙️ Run Frontend Locally

```bash
# 1. Clone the frontend repository
git clone https://github.com/fardin-sojon/plant-net-client.git
cd plant-net-client

# 2. Install dependencies
npm install

# 3. Create a .env file with:
# VITE_APIKEY=your_firebase_api_key
# VITE_AUTHDOMAIN=your_firebase_auth_domain
# VITE_PROJECTID=your_firebase_project_id
# VITE_STORAGEBUCKET=your_firebase_storage_bucket
# VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
# VITE_APPID=your_firebase_app_id
# VITE_API_URL=http://localhost:5000
# VITE_IMGBB_API=your_imgbb_api_key
# VITE_STRIPE_PK=your_stripe_public_key

# 4. Start the development server
npm run dev
```

---

## 🔗 Repository Links

- 📦 **Frontend (Client):** [https://github.com/fardin-sojon/plant-net-client](https://github.com/fardin-sojon/plant-net-client)
- 🛠️ **Backend (Server):** [https://github.com/fardin-sojon/plant-net-server](https://github.com/fardin-sojon/plant-net-server)

---

## 👨‍💻 Developer

**Fardin Rahman Sojon**  
🐙 [Github](https://github.com/fardin-sojon)