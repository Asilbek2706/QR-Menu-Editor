# 🍽️ QR Menu Creator Pro

<div align="center">

**Professional Digital Menu Builder for Restaurants & Cafes**

[![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Overview

QR Menu Creator Pro is a modern, feature-rich digital menu management system designed for restaurants, cafes, and food establishments. Create beautiful menus with multi-language support, generate QR codes for tables, manage orders in real-time, and provide customers with an exceptional digital ordering experience.

### ✨ Key Features

- 🌐 **Multi-Language Support** - Full support for Uzbek, Russian, and English
- 📱 **QR Code Generation** - Instant QR code creation for each table
- 🎨 **Customizable Design** - Personalize colors, fonts, and layouts
- 📝 **Menu Editor** - Easy-to-use interface for managing items and categories
- 🛒 **Order Management** - Real-time order tracking and status updates
- ⏱️ **Preparation Time** - Estimated preparation times for each dish
- 💰 **Price Management** - Easy pricing in local currency
- 📊 **Order Dashboard** - Track all orders with status updates
- 🖼️ **Image Support** - Add beautiful images to menu items
- 💾 **Auto-Save** - Automatic local storage of menu data
- 📱 **Responsive Design** - Works perfectly on all devices

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Asilbek2706/QR-Menu-Editor.git
   cd QR-Menu-Editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: The Gemini API key is optional for AI-powered features.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to `http://localhost:5173`

---

## 🎯 Usage

### For Restaurant Owners/Managers:

1. **Create Your Menu:**
   - Access the Menu Editor
   - Add categories (Breakfast, Lunch, Dinner, etc.)
   - Add menu items with names, descriptions, prices, and images
   - Set preparation times for each dish

2. **Generate QR Codes:**
   - Go to "QR Kodlar" (QR Codes) section
   - Select or add table numbers
   - Download QR codes as PNG images
   - Print and place on tables

3. **Manage Orders:**
   - Monitor incoming orders in the Dashboard
   - Update order status (Pending → Preparing → Served)
   - Track preparation times

### For Customers:

1. **Scan QR Code:**
   - Use your phone camera to scan the table's QR code
   - Menu opens automatically in your browser

2. **Browse & Order:**
   - Browse menu items
   - Add items to cart
   - Place order
   - Track order status in real-time

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.4** - UI framework
- **TypeScript 5.8.2** - Type-safe JavaScript
- **Vite 6.2.0** - Build tool and dev server
- **Tailwind CSS** - Styling (via inline classes)

### Libraries
- **lucide-react** - Beautiful icons
- **qrcode.react** - QR code generation
- **@google/genai** - AI-powered features

### Development
- **@vitejs/plugin-react** - React support for Vite
- **@types/node** - Node.js type definitions

---

## 📁 Project Structure

```
QR-Menu-Editor/
├── components/
│   ├── ActiveOrder.tsx      # Customer order tracking component
│   ├── Editor.tsx           # Menu editor interface
│   ├── MenuPreview.tsx      # Customer-facing menu view
│   └── OrderDashboard.tsx   # Order management dashboard
├── services/               # Service layer (API calls, utilities)
├── App.tsx                # Main application component
├── types.ts               # TypeScript type definitions
├── index.tsx              # Application entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

---

## 🎨 Customization

### Theme Configuration

Edit the theme in your menu data:

```typescript
theme: {
  primaryColor: "#4f46e5",    // Primary brand color
  accentColor: "#f59e0b",     // Accent color
  fontFamily: "sans",         // 'sans' or 'serif'
  layout: "list"              // 'list' or 'grid'
}
```

### Adding Menu Items

```typescript
{
  id: "unique-id",
  name: { uz: "Uzbek name", ru: "Russian name", en: "English name" },
  description: { uz: "...", ru: "...", en: "..." },
  price: 45000,
  category: "breakfast",
  isAvailable: true,
  prepTimeMinutes: 15,
  image: "https://image-url.com/photo.jpg"
}
```

---

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Asilbek**
- GitHub: [@Asilbek2706](https://github.com/Asilbek2706)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [QRCode.react](https://github.com/zpao/qrcode.react)
- [Google Gemini AI](https://ai.google.dev/)

---

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

<div align="center">

**Made with ❤️ for the restaurant industry**

⭐ Star this repository if you find it helpful!

</div>
