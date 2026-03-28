# 🔧 iOS Simulator Timeout Fix

## Error Explanation

```
Error: xcrun simctl openurl ... exited with non-zero code: 60
Simulator device failed to open exp://192.168.4.77:8081
Operation timed out
```

This happens when:
- Expo Go isn't installed in the simulator
- Simulator is slow to respond
- Network connection issues
- Simulator needs to be reset

---

## ✅ Quick Fixes (Try in Order)

### Fix 1: Use Your Physical Device Instead (Recommended)

**This is the easiest and most reliable solution!**

1. **Don't press `i` for iOS simulator**
2. **Just scan the QR code** with your iPhone's camera
3. Your physical device will work perfectly!

```bash
npm start
# Then scan QR code with your iPhone camera
# Tap the notification to open in Expo Go
```

---

### Fix 2: Install Expo Go in Simulator First

If you really need to use the simulator:

**Step 1: Start the simulator manually**
```bash
# Open Simulator app
open -a Simulator
```

**Step 2: Wait for it to fully boot**
- Wait until you see the home screen
- Make sure it's responsive

**Step 3: Install Expo Go in the simulator**
```bash
# In a new terminal, run:
npx expo start --ios
```

This will automatically install Expo Go in the simulator.

---

### Fix 3: Reset the Simulator

If Expo Go won't install:

**Step 1: Close Simulator**
```bash
killall Simulator
```

**Step 2: Erase the simulator**
```bash
xcrun simctl erase all
```

**Step 3: Start fresh**
```bash
npm start
# Then press 'i' to open iOS simulator
```

---

### Fix 4: Use a Different Simulator

**List available simulators:**
```bash
xcrun simctl list devices
```

**Boot a specific simulator:**
```bash
# Example: Boot iPhone 15 Pro
xcrun simctl boot "iPhone 15 Pro"
```

Then try `npm start` and press `i`

---

## 🎯 Recommended Workflow

### For Testing: Use Your Physical iPhone

**Advantages:**
- ✅ Faster and more reliable
- ✅ Real device performance
- ✅ Actual touch interactions
- ✅ Real network conditions
- ✅ No simulator issues

**How to use:**
```bash
npm start
# Scan QR code with iPhone camera
# Tap notification to open in Expo Go
```

### For Development: Use Web Browser

**Advantages:**
- ✅ Instant reload
- ✅ Chrome DevTools
- ✅ No device needed
- ✅ Fast iteration

**How to use:**
```bash
npm start
# Press 'w' to open in web browser
```

---

## 🔍 Detailed Troubleshooting

### Check Simulator Status

```bash
# List all simulators
xcrun simctl list devices

# Check if any are booted
xcrun simctl list devices | grep Booted
```

### Kill All Simulators

```bash
killall Simulator
killall "Simulator (Watch)"
```

### Clear Expo Cache

```bash
npm run start:clear
```

### Reinstall Expo Go in Simulator

```bash
# Remove Expo Go from simulator
xcrun simctl uninstall booted host.exp.Exponent

# Start fresh
npm start
# Press 'i' to reinstall
```

---

## 🚀 Best Solution: Use Your iPhone

Since you have an iPhone with Expo Go installed:

**Step 1: Start the server**
```bash
npm start
```

**Step 2: Scan the QR code**
- Open Camera app on your iPhone
- Point at the QR code in terminal
- Tap the notification

**Step 3: App opens in Expo Go**
- No simulator needed!
- Real device testing
- Much more reliable

---

## ⚡ Quick Commands

### Start without auto-opening simulator
```bash
npm start
# Don't press 'i', just scan QR code
```

### Start and open web only
```bash
npm run web
```

### Start with tunnel (if network issues)
```bash
npm run start:tunnel
# Then scan QR code
```

### Clear everything and start fresh
```bash
npm run start:clear
```

---

## 🎯 What You Should Do Now

### Option A: Use Your iPhone (Recommended)
1. Run `npm start`
2. Scan QR code with iPhone camera
3. Test on real device ✅

### Option B: Use Web Browser
1. Run `npm start`
2. Press `w` to open in browser
3. Test in Chrome ✅

### Option C: Fix Simulator (If Really Needed)
1. Close all simulators
2. Run `xcrun simctl erase all`
3. Run `npm start`
4. Press `i` to install Expo Go
5. Wait patiently ⏳

---

## 📝 Notes

- **Physical device testing is recommended** for React Native apps
- Simulators are slower and less reliable
- Your iPhone with Expo Go is the best testing method
- Web browser is great for UI development
- Only use simulator if you don't have a physical device

---

## ✅ Recommended: Skip the Simulator

**Just use your iPhone!**

```bash
npm start
# Scan QR code
# Done! 🎉
```

Much easier and more reliable than dealing with simulator issues.
