# WineOS - Wine Inventory Management System

A comprehensive wine inventory management application built with React Native and Expo.

Copyright © 2024 Nicola Debbia. All rights reserved.

## Features

- **Inventory Management**: Track wine stock levels, prices, and suppliers
- **Sales Tracking**: Record daily sales and view analytics
- **Cloud Sync**: Real-time synchronization with Supabase
- **Advanced Search**: Filter by country, region, and status
- **Cross-Platform**: Works on iOS, Android, and Web
- **Offline Support**: Works without internet connection
- **Analytics**: Track sales trends and inventory value

## Tech Stack

- **Framework**: Expo SDK 53 + React Native 0.79
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand with AsyncStorage persistence
- **Backend**: Supabase (PostgreSQL)
- **Routing**: Expo Router v5
- **Styling**: NativeWind (TailwindCSS)
- **Testing**: Jest + React Native Testing Library

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode 14+
- For Android: Android Studio
- Supabase account (for cloud sync)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WineOS-App-SebNik-main
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**

Run the following SQL in your Supabase SQL editor:

```sql
-- Create wines table
CREATE TABLE wines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Italy', 'France')),
  region TEXT NOT NULL,
  supplier TEXT NOT NULL,
  purchase_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  quantity_target INTEGER NOT NULL,
  average_weekly_sales DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sales table
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  wine_id TEXT REFERENCES wines(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_wines_country ON wines(country);
CREATE INDEX idx_wines_region ON wines(region);
CREATE INDEX idx_wines_quantity ON wines(quantity);
CREATE INDEX idx_sales_wine_id ON sales(wine_id);
CREATE INDEX idx_sales_date ON sales(date);

-- Enable Row Level Security (RLS)
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON wines FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON wines FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON wines FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON wines FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON sales FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON sales FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON sales FOR DELETE USING (true);
```

---

## 📱 Testing with Expo Go

The fastest way to test WineOS on your phone!

### Quick Start:

1. **Install Expo Go** on your phone (iOS/Android)
2. **Start the server**: `npm start`
3. **Scan the QR code** with Expo Go
4. **Your app loads instantly!**

### Available Commands:

```bash
npm start              # Start development server
npm run start:tunnel   # Use tunnel (different networks)
npm run start:clear    # Clear cache and restart
npm run android        # Open on Android device
npm run ios            # Open on iOS device
npm test               # Run all tests
```

### 📖 Detailed Guide:

See **[EXPO_GO_GUIDE.md](./EXPO_GO_GUIDE.md)** for:
- Complete setup instructions
- Troubleshooting tips
- Testing checklist
- Performance optimization
- Best practices

### ⚡ Quick Test:

See **[START_TESTING.md](./START_TESTING.md)** for a 3-step quick start guide.

---

## Running the App (Alternative Methods)

### Development

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
