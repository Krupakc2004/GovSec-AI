<div align="center">
  <img src="https://img.shields.io/badge/GovSec--AI-Enterprise-0f172a?style=for-the-badge&logo=shield" alt="GovSec-AI Logo" />
  <h1>🛡️ GovSec-AI</h1>
  <p><strong>Next-Generation Civic Intelligence & Government Administration Platform</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

GovSec-AI is a state-of-the-art administrative dashboard built to bridge the gap between citizens and government bodies. Equipped with **AI-driven insights, live intelligence mapping, and fraud detection**, it provides a secure, transparent, and highly responsive ecosystem for public grievance redressal and scheme distribution.

---

## ✨ Core Features

### 👤 Citizen Node (Public Dashboard)
* **Secure Intelligence Ledger:** File structural, health, or financial reports directly to the authorities with image evidence.
* **AI Policy Advisor:** An integrated AI assistant capable of answering questions regarding policy eligibility (e.g., Ayushman Bharat, PM Kisan).
* **Real-time Tracking:** Monitor the progress and status of your filed reports with live updates.
* **Government Schemes:** Discover and apply for central/state schemes recommended directly on your dashboard.

### 🏛️ Government Node (Admin Dashboard)
* **Strategic Command Center:** Centralized overview of all incoming reports across various modules (Roads, Healthcare, Financial Fraud).
* **AI Fraud Detection:** Automatically flags repetitive, suspicious, or bot-generated complaints to optimize administrative time.
* **Geospatial Analytics:** Interactive data visualization filtering intelligence by Region, City, and specific Local Areas.
* **Enterprise Reporting:** Visual charts (Bar, Doughnut, Radar) providing deep demographic and sector-wise engagement metrics.

---

## 💻 Tech Stack

### Frontend
* **Core:** React.js + Vite (for lightning-fast HMR and building)
* **Styling:** Tailwind CSS + Custom Enterprise CSS Tokens (`slate-900`, `indigo-500`)
* **Routing:** React Router v6
* **Icons & Charts:** Lucide-React, Chart.js, Recharts

### Backend
* **Server:** Node.js with Express.js API framework
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens)
* **Storage:** Multer (Local file buffering & uploads)

---

## 🚀 Quick Start Guide

Follow these steps to deploy GovSec-AI locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/Krupakc2004/GovSec-AI.git
cd GovSec-AI
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
*Create a `.env` file in the `Backend` directory:*
```env
PORT=8001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
*Start the Server:*
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend/GovSec_AI
npm install
```
*Start the Development Server:*
```bash
npm run dev
```

The application will now be running. The Frontend will be available at `http://localhost:5173` and the Backend API at `http://localhost:8001`.

---

## 🎨 UI / UX Architecture

GovSec-AI recently underwent a massive UX overhaul moving from a standard layout to a **Premium Enterprise Dark Mode**:
- **Typography:** High-contrast, clean sans-serif (Inter/Roboto styled).
- **Color Palette:** Professional `Slate-900` backgrounds with `Indigo/Blue` interactive elements, moving away from harsh neon colors.
- **Responsiveness:** 100% Mobile-first design. Slide-out hamburger menus and fluid grid layouts ensure the platform works flawlessly on desktop monitors, tablets, and smartphones.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/Krupakc2004/GovSec-AI/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
<div align="center">
  <i>Built with ❤️ for better Governance and Transparency.</i>
</div>
