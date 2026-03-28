# 🚀 Enterprise Logging System - Setup Guide

## ✅ Phase 1 Complete: Enhanced Logger (FREE Forever)

### What's Been Implemented

#### **1. Enhanced Logger (`utils/logger.ts`)**
- ✅ Log persistence to AsyncStorage (last 500 logs)
- ✅ PII scrubbing (emails, phones, credit cards)
- ✅ User context tracking (userId, restaurantId, sessionId)
- ✅ Device context (platform, OS, app version, device model)
- ✅ Performance monitoring (`logger.time()` / `logger.timeEnd()`)
- ✅ Log export (JSON and Text formats)
- ✅ Log statistics and filtering
- ✅ Automatic log rotation

#### **2. Log Viewer Component (`components/LogViewer.tsx`)**
- ✅ Visual log statistics dashboard
- ✅ Logs by level breakdown (debug, info, warn, error, success)
- ✅ Export logs as Text or JSON
- ✅ Share logs via email/messaging
- ✅ Clear logs functionality
- ✅ Premium UI with icons and colors

#### **3. Integration**
- ✅ Logger initialized in `app/_layout.tsx`
- ✅ LogViewer added to Settings page
- ✅ All existing console.logs replaced with logger

---

## 📦 Required Installation

### **Step 1: Install expo-device**

```bash
npx expo install expo-device
```

This package is needed for device information (model, name, etc.)

### **Step 2: Verify Installation**

```bash
npm install
```

---

## 🎯 How to Use

### **1. Basic Logging**

```typescript
import { logger } from '@/utils/logger';

// Debug (development only)
logger.debug('User clicked button', { buttonId: 'submit' });

// Info (development only)
logger.info('Fetching wines from database');

// Success (development only)
logger.success('Sync completed', { count: 25 });

// Warning (all environments)
logger.warn('Low stock detected', { wineId: '123' });

// Error (all environments)
logger.error('Failed to sync', error, { context: 'additional data' });
```

### **2. Performance Monitoring**

```typescript
// Start timer
logger.time('Fetch Wines');

// ... your code ...
await fetchWines();

// End timer (logs duration automatically)
logger.timeEnd('Fetch Wines');
// Output: [INFO] Performance: Fetch Wines { duration: "234ms" }
```

### **3. User Context Tracking**

```typescript
// Set user context (call after login)
logger.setUserContext('user-123', 'restaurant-456');

// All future logs will include this context
logger.info('User performed action');
// Includes: userId, restaurantId, sessionId

// Clear context (call on logout)
logger.clearUserContext();
```

### **4. Export Logs**

Users can export logs from Settings page:
1. Go to Settings
2. Scroll to "App Logs" section
3. Tap "Export as Text" or "Export as JSON"
4. Share via email/messaging

---

## 🔒 Privacy & Security

### **PII Scrubbing**

The logger automatically scrubs:
- ✅ Email addresses → `[EMAIL_REDACTED]`
- ✅ Phone numbers → `[PHONE_REDACTED]`
- ✅ Credit card numbers → `[CARD_REDACTED]`

Example:
```typescript
logger.info('User registered', {
  email: 'john@example.com',
  phone: '+1-555-1234'
});

// Stored as:
{
  email: '[EMAIL_REDACTED]',
  phone: '[PHONE_REDACTED]'
}
```

---

## 📊 What's Included in Logs

### **Every Log Entry Contains:**

```json
{
  "id": "1704672000000-abc123",
  "timestamp": "2025-01-07T20:00:00.000Z",
  "level": "info",
  "message": "User performed action",
  "data": { "action": "add_wine" },
  "userContext": {
    "userId": "user-123",
    "restaurantId": "restaurant-456",
    "sessionId": "1704672000000-xyz789"
  },
  "deviceContext": {
    "platform": "ios",
    "osVersion": "17.2",
    "appVersion": "1.0.0",
    "deviceModel": "iPhone 15 Pro",
    "deviceName": "John's iPhone"
  }
}
```

---

## 🎨 Settings UI Features

### **Log Statistics Dashboard**
- Total logs count
- Last updated timestamp
- Breakdown by level (debug, info, success, warn, error)
- Color-coded icons for each level

### **Actions**
- **Export as Text** - Human-readable format
- **Export as JSON** - Machine-readable format
- **Clear All Logs** - Delete all stored logs

### **Info**
- Automatic log rotation (last 500 entries)
- Logs persisted across app restarts
- Share with support for debugging

---

## 🚀 Next Steps (Optional - FREE Tiers)

### **Phase 2: Sentry Integration (Recommended)**

Add remote error tracking:

```bash
# Install Sentry
npx @sentry/wizard@latest -i reactNative

# Follow the wizard to:
# 1. Create FREE Sentry account
# 2. Get your DSN
# 3. Configure source maps
```

Benefits:
- Real-time error alerts
- Stack traces with source maps
- Error grouping and frequency
- 5,000 errors/month FREE

### **Phase 3: Google Analytics (Optional)**

Add usage analytics:

```bash
# Install Google Analytics
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

Benefits:
- User behavior tracking
- Feature usage analytics
- Unlimited events FREE

---

## 📈 Performance Impact

### **Storage**
- **Maximum:** ~2MB (500 logs × 4KB average)
- **Typical:** ~500KB (500 logs × 1KB average)
- **Auto-rotation:** Keeps only last 500 logs

### **CPU**
- **Development:** Minimal (logs to console + storage)
- **Production:** Near-zero (only errors/warnings logged)

### **Memory**
- **In-memory buffer:** ~500KB
- **Async persistence:** Non-blocking

---

## ✅ Testing Checklist

### **1. Verify Logger Works**
- [ ] Open app and check Settings > App Logs
- [ ] Should see "Logger initialized" log
- [ ] Total logs should be > 0

### **2. Test Logging Levels**
```typescript
// Add to any screen temporarily
logger.debug('Debug test');
logger.info('Info test');
logger.success('Success test');
logger.warn('Warning test');
logger.error('Error test', new Error('Test error'));
```

- [ ] Check Settings > App Logs
- [ ] Should see all 5 log levels with counts

### **3. Test Export**
- [ ] Go to Settings > App Logs
- [ ] Tap "Export as Text"
- [ ] Should open share dialog
- [ ] Verify exported file contains logs

### **4. Test Performance Monitoring**
```typescript
logger.time('Test Operation');
await new Promise(resolve => setTimeout(resolve, 1000));
logger.timeEnd('Test Operation');
```

- [ ] Check console for "[PERF] Test Operation: 1000ms"
- [ ] Check logs for performance entry

### **5. Test User Context**
```typescript
logger.setUserContext('test-user-123', 'test-restaurant-456');
logger.info('Context test');
```

- [ ] Export logs and verify userContext is included

---

## 🎯 Current Status

### **Implemented (FREE Forever):**
- ✅ Enhanced logger with persistence
- ✅ PII scrubbing
- ✅ User context tracking
- ✅ Performance monitoring
- ✅ Log export functionality
- ✅ Premium UI in Settings
- ✅ Automatic log rotation

### **Rating: 75/100** ⭐⭐⭐⭐

**What's Missing for 100/100:**
- Remote error tracking (Sentry) - +15 points
- Session replay - +5 points
- Advanced performance monitoring - +3 points
- Long-term data retention - +2 points

**But you can add these later when you have customers!**

---

## 💡 Tips for Production

### **1. Set User Context on Login**
```typescript
// In your login flow
const handleLogin = async (userId: string, restaurantId: string) => {
  // ... your login logic ...
  
  // Set logger context
  logger.setUserContext(userId, restaurantId);
  logger.info('User logged in');
};
```

### **2. Clear Context on Logout**
```typescript
const handleLogout = async () => {
  logger.info('User logged out');
  logger.clearUserContext();
  
  // ... your logout logic ...
};
```

### **3. Use Performance Monitoring**
```typescript
// Wrap slow operations
const syncWines = async () => {
  logger.time('Sync Wines');
  
  try {
    await supabaseService.syncWines();
    logger.success('Wines synced');
  } catch (error) {
    logger.error('Sync failed', error);
  } finally {
    logger.timeEnd('Sync Wines');
  }
};
```

### **4. Export Logs for Support**

When users report issues:
1. Ask them to go to Settings > App Logs
2. Tap "Export as Text"
3. Share via email to support@yourapp.com
4. You'll get full context of what happened!

---

## 🎉 You're Ready!

Your app now has **enterprise-grade logging** for **$0/month**!

**Next:** Install `expo-device` and test the system.

```bash
npx expo install expo-device
npm start
```

Then check Settings > App Logs to see it in action! 🚀
