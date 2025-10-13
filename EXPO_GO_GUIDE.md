# 📱 WineOS - Expo Go Testing Guide

## What is Expo Go?

**Expo Go** is a mobile app (available on iOS and Android) that allows you to instantly test your React Native application on a physical device without building and installing a native app. It's like a sandbox environment that runs your JavaScript code directly on your phone.

### Key Benefits:
- ✅ **Instant Testing** - See changes in real-time on your device
- ✅ **No Build Required** - Skip the lengthy native build process
- ✅ **Hot Reloading** - Changes appear instantly as you code
- ✅ **Easy Sharing** - Share your app via QR code with team members
- ✅ **Cross-Platform** - Test on both iOS and Android devices

---

## 🚀 Quick Start Guide

### Step 1: Install Expo Go on Your Mobile Device

**iOS (iPhone/iPad):**
1. Open the **App Store**
2. Search for "**Expo Go**"
3. Download and install the app
4. Open Expo Go and create an account (optional but recommended)

**Android:**
1. Open the **Google Play Store**
2. Search for "**Expo Go**"
3. Download and install the app
4. Open Expo Go and create an account (optional but recommended)

### Step 2: Start the Development Server

Open your terminal in the project directory and run:

```bash
npm start
```

This will:
- Start the Expo development server
- Open Expo Dev Tools in your browser
- Display a QR code in both terminal and browser

### Step 3: Connect Your Device

**Option A: Same Network (Recommended)**
1. Ensure your computer and phone are on the **same Wi-Fi network**
2. Open **Expo Go** on your device
3. Scan the QR code displayed in your terminal or browser:
   - **iOS**: Use the built-in camera app or Expo Go's scanner
   - **Android**: Use Expo Go's built-in QR scanner

**Option B: Tunnel Mode (If different networks)**
```bash
npm run start:tunnel
```
This uses ngrok to create a tunnel, allowing testing even on different networks.

---

## 📋 Available Commands

### Development Server Commands

```bash
# Start development server (default)
npm start

# Start with tunnel (for different networks)
npm run start:tunnel

# Start with LAN connection
npm run start:lan

# Start with localhost only
npm run start:localhost

# Clear cache and start fresh
npm run start:clear

# Open on Android emulator/device
npm run android

# Open on iOS simulator/device
npm run ios

# Open in web browser
npm run web
```

### Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 🔧 Troubleshooting

### Issue 1: QR Code Won't Scan

**Solutions:**
- Ensure your phone and computer are on the same Wi-Fi network
- Try tunnel mode: `npm run start:tunnel`
- Manually enter the connection URL shown in the terminal
- Restart both the development server and Expo Go app

### Issue 2: "Unable to Connect to Development Server"

**Solutions:**
- Check that your firewall isn't blocking the connection
- Verify both devices are on the same network
- Try restarting the Metro bundler: Press `r` in the terminal
- Use tunnel mode if on different networks

### Issue 3: App Crashes or Shows Errors

**Solutions:**
- Clear the cache: `npm run start:clear`
- Check the terminal for error messages
- Ensure all dependencies are installed: `npm install`
- Verify your Supabase credentials in `.env` file

### Issue 4: Changes Not Appearing

**Solutions:**
- Enable Fast Refresh in Expo Go settings
- Shake your device and tap "Reload"
- Press `r` in the terminal to reload
- Clear cache and restart: `npm run start:clear`

### Issue 5: "Expo SDK Version Mismatch"

**Solutions:**
- Update Expo Go app from the App Store/Play Store
- Check that your project uses a compatible Expo SDK version
- Current project uses: **Expo SDK 53**

---

## 🎯 Testing Your WineOS App

### Features to Test:

#### 1. **Inventory Management**
- ✅ Add new wines
- ✅ Edit wine details
- ✅ Delete wines
- ✅ Search wines by name
- ✅ Filter by country (Italy/France)
- ✅ Filter by region
- ✅ Filter by reorder status

#### 2. **Sales Tracking**
- ✅ Record daily sales
- ✅ View sales history
- ✅ Check sales statistics
- ✅ Verify quantity updates after sales

#### 3. **Reorder System**
- ✅ Check color indicators (Green/Yellow/Red)
- ✅ View suggested reorder quantities
- ✅ Test restock functionality
- ✅ Verify low stock alerts

#### 4. **Data Management**
- ✅ Export data (CSV/JSON)
- ✅ Import data (JSON)
- ✅ Backup and restore
- ✅ Clear all data

#### 5. **Supabase Sync** (if configured)
- ✅ Enable sync in Settings
- ✅ Add/edit wines and verify sync
- ✅ Check sync status indicator
- ✅ Test offline mode

#### 6. **UI/UX Testing**
- ✅ Test on different screen sizes
- ✅ Check portrait/landscape orientation
- ✅ Verify touch targets are accessible
- ✅ Test scrolling and gestures
- ✅ Check dark mode (if supported)

---

## 📊 Performance Tips

### Optimize Testing Experience:

1. **Use Fast Refresh**
   - Enabled by default in Expo Go
   - Changes appear instantly without full reload
   - Preserves component state

2. **Debug Menu**
   - Shake your device to open the debug menu
   - Options: Reload, Debug, Performance Monitor, Element Inspector

3. **Console Logs**
   - View logs in the terminal where you ran `npm start`
   - Use `console.log()` for debugging
   - Check for errors in red text

4. **Network Inspection**
   - Monitor Supabase API calls
   - Check sync status in Settings
   - Verify data persistence

---

## 🔐 Important Notes

### Supabase Configuration

Your app uses Supabase for cloud sync. To test this feature:

1. Ensure `.env` file has valid credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

2. Enable sync in **Settings** tab
3. Add/edit wines to test synchronization
4. Check sync status indicator

### Data Persistence

- Data is stored locally using AsyncStorage
- Data persists between app reloads
- Use "Clear All Data" in Settings to reset

### Offline Mode

- App works fully offline
- Changes are queued for sync when online
- Sync happens automatically when connection restored

---

## 🚨 Limitations of Expo Go

### What Works:
✅ All Expo SDK modules (camera, location, etc.)
✅ JavaScript/TypeScript code
✅ React Native components
✅ Zustand state management
✅ AsyncStorage
✅ Supabase integration
✅ Navigation with Expo Router

### What Doesn't Work:
❌ Custom native modules not in Expo SDK
❌ Some third-party libraries with native code
❌ Advanced native features requiring custom builds

### When to Use Development Builds Instead:

If you need:
- Custom native modules
- Libraries with native dependencies not in Expo SDK
- Full control over native configuration
- Production-like performance testing

Then create a **Development Build** using:
```bash
npx expo run:android
npx expo run:ios
```

---

## 📱 Testing Workflow

### Recommended Testing Process:

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Connect Device**
   - Scan QR code with Expo Go
   - Wait for app to load

3. **Test Features**
   - Go through each tab
   - Test all CRUD operations
   - Verify data persistence
   - Check error handling

4. **Make Changes**
   - Edit code in your IDE
   - Save the file
   - Changes appear automatically on device

5. **Debug Issues**
   - Check terminal for errors
   - Use console.log() for debugging
   - Shake device for debug menu

6. **Test on Multiple Devices**
   - Test on different screen sizes
   - Test on both iOS and Android
   - Verify consistent behavior

---

## 🎓 Best Practices

### Development Tips:

1. **Keep Expo Go Updated**
   - Update from App Store/Play Store regularly
   - Ensures compatibility with latest Expo SDK

2. **Use Same Network**
   - Fastest and most reliable connection
   - Fallback to tunnel mode if needed

3. **Test Early and Often**
   - Test on real devices frequently
   - Don't wait until the end to test

4. **Monitor Performance**
   - Check app responsiveness
   - Monitor memory usage
   - Test with realistic data volumes

5. **Handle Errors Gracefully**
   - Test error scenarios
   - Verify error boundaries work
   - Check error messages are user-friendly

---

## 📞 Getting Help

### Resources:

- **Expo Documentation**: https://docs.expo.dev/
- **Expo Go Guide**: https://docs.expo.dev/get-started/expo-go/
- **Troubleshooting**: https://docs.expo.dev/troubleshooting/
- **Community Forums**: https://forums.expo.dev/

### Common Commands Reference:

```bash
# In terminal while server is running:
r - Reload app
m - Toggle menu
d - Open developer menu
i - Open on iOS simulator
a - Open on Android emulator
w - Open in web browser
c - Clear cache
q - Quit
```

---

## ✅ Quick Checklist

Before testing with Expo Go:

- [ ] Expo Go app installed on device
- [ ] Computer and device on same Wi-Fi
- [ ] `.env` file configured (if using Supabase)
- [ ] Dependencies installed (`npm install`)
- [ ] Development server started (`npm start`)
- [ ] QR code scanned and app loaded
- [ ] All features tested systematically
- [ ] Errors checked and resolved

---

**Happy Testing! 🚀**

Your WineOS app is now ready to test with Expo Go. Scan the QR code and start exploring your wine inventory management system on your mobile device!
