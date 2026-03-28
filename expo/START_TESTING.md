# 🚀 Quick Start - Test WineOS with Expo Go

## ⚡ 3-Step Quick Start

### Step 1: Install Expo Go on Your Phone
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

### Step 2: Start the Server
```bash
npm start
```

### Step 3: Scan the QR Code
- Open Expo Go on your phone
- Scan the QR code shown in your terminal
- Your app will load automatically!

---

## 📱 What You'll See

Your WineOS app will open with 4 main tabs:

1. **📦 Inventario** - View and manage your wine inventory
2. **💰 Vendite** - Record daily sales
3. **➕ Aggiungi** - Add new wines
4. **⚙️ Impostazioni** - Settings and statistics

---

## 🎯 Try These Features

### Quick Test Checklist:

1. **Add a Wine**
   - Go to "Aggiungi" tab
   - Fill in wine details
   - Tap "Aggiungi Vino"

2. **Record a Sale**
   - Go to "Vendite" tab
   - Select a wine
   - Enter quantity sold
   - Tap "Registra Vendita"

3. **Search & Filter**
   - Go to "Inventario" tab
   - Use search bar
   - Try country/region filters

4. **Check Reorder Status**
   - Look for color indicators:
     - 🟢 Green = Stock OK
     - 🟡 Yellow = Low stock
     - 🔴 Red = Urgent reorder

---

## 🔧 Troubleshooting

**Can't scan QR code?**
```bash
npm run start:tunnel
```

**App won't load?**
- Check both devices are on same Wi-Fi
- Restart the server: Press `Ctrl+C`, then `npm start`

**Need to clear cache?**
```bash
npm run start:clear
```

---

## 📊 Test Results

After testing, verify:
- ✅ All tabs load correctly
- ✅ Can add/edit/delete wines
- ✅ Sales recording works
- ✅ Search and filters work
- ✅ Data persists after reload
- ✅ UI looks good on your device

---

## 🆘 Need Help?

See the full guide: **EXPO_GO_GUIDE.md**

**Quick Commands:**
- `npm start` - Start server
- `npm test` - Run tests
- `npm run start:clear` - Clear cache

---

**Ready? Let's test! 🍷**

Run `npm start` and scan the QR code!
