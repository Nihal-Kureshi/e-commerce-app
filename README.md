# E-Commerce App

A full-stack e-commerce mobile application built with React Native and Node.js.

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart functionality
- 👤 User authentication
- 📱 Responsive design (phone/tablet/large screens)
- 🌙 Dark/Light theme
- 📦 Order management
- 🔍 Product search

## Tech Stack

**Frontend:** React Native, TypeScript, React Navigation
**Backend:** Node.js, Express, Prisma, SQLite
**Database:** SQLite with Prisma ORM

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd e-commerce-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
DATABASE_URL="file:./prisma/dev.db"
```

Initialize database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

Start backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend/ECommerce
npm install
```

#### For iOS:
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

#### For Android:
```bash
npx react-native run-android
```

## API Configuration

Update API base URL in `frontend/ECommerce/src/services/api.ts`:

```typescript
// For Android emulator
const BASE_URL = 'http://10.0.2.2:3000/api';

// For iOS simulator
const BASE_URL = 'http://localhost:3000/api';

// For physical device (replace with your IP)
const BASE_URL = 'http://192.168.1.100:3000/api';
```

## Project Structure

```
e-commerce-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
└── frontend/ECommerce/
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── context/
    │   ├── services/
    │   └── utils/
    └── package.json
```

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npx prisma studio` - Open database GUI

### Frontend
- `npx react-native run-ios` - Run iOS app
- `npx react-native run-android` - Run Android app
- `npx react-native start` - Start Metro bundler

## Troubleshooting

### Common Issues

**Metro bundler cache:**
```bash
npx react-native start --reset-cache
```

**Android build issues:**
```bash
cd android
./gradlew clean
cd ..
```

**iOS build issues:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Database reset:**
```bash
cd backend
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

### Network Issues

1. Ensure backend is running on correct port
2. Check firewall settings
3. For physical devices, use your computer's IP address
4. Disable any VPN that might block local connections

## Default Credentials

- Email: `user@example.com`
- Password: `password123`

## Development Notes

- Backend uses SQLite for simplicity
- Frontend implements responsive design system
- New Architecture (Fabric/TurboModules) enabled
- Hermes JS engine enabled for better performance