# 🎯 Sentry Integration Guide (FREE Tier - 5,000 errors/month)

## When to Add Sentry

**Add Sentry when you:**
- ✅ Have your first 10-20 customers
- ✅ Need to know about production errors immediately
- ✅ Want stack traces with source maps
- ✅ Need email alerts for critical errors

**Current system is enough if:**
- ⚪ Still in development/testing
- ⚪ Have < 10 users
- ⚪ Can manually test everything

---

## 🚀 Quick Setup (15 minutes)

### **Step 1: Create FREE Sentry Account**

1. Go to [sentry.io](https://sentry.io/signup/)
2. Sign up with email (FREE tier - no credit card needed)
3. Create new project → Select "React Native"
4. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

### **Step 2: Install Sentry**

```bash
# Install Sentry SDK
npx @sentry/wizard@latest -i reactNative

# Follow the wizard prompts:
# 1. Paste your DSN
# 2. Enable source maps: YES
# 3. Enable crash reporting: YES
# 4. Configure build: YES
```

The wizard will:
- Install `@sentry/react-native`
- Configure `app.json`
- Set up source maps
- Add initialization code

### **Step 3: Integrate with Logger**

Update `utils/logger.ts`:

```typescript
import * as Sentry from '@sentry/react-native';

class Logger {
  // ... existing code ...

  /**
   * Error level - logs in all environments + sends to Sentry
   */
  error(message: string, error?: any, data?: any): void {
    const errorData = {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...data,
    };

    console.error(`[ERROR] ${message}`, errorData);
    this.addToBuffer('error', message, errorData);

    // Send to Sentry in production
    if (!this.isDevelopment && error) {
      Sentry.captureException(error, {
        tags: {
          source: 'logger',
          level: 'error',
        },
        extra: {
          message,
          ...data,
        },
        contexts: {
          user: this.userContext,
          device: this.deviceContext,
        },
      });
    }
  }
}
```

### **Step 4: Initialize Sentry in App**

Update `app/_layout.tsx`:

```typescript
import * as Sentry from '@sentry/react-native';

// Initialize Sentry BEFORE app renders
Sentry.init({
  dsn: 'YOUR_DSN_HERE', // Replace with your actual DSN
  environment: __DEV__ ? 'development' : 'production',
  enabled: !__DEV__, // Only enable in production
  tracesSampleRate: 1.0, // 100% of transactions for performance monitoring
  beforeSend(event) {
    // Don't send events in development
    if (__DEV__) {
      return null;
    }
    return event;
  },
});

export default function RootLayout() {
  // ... rest of your code
}
```

### **Step 5: Test Sentry**

Add a test button temporarily:

```typescript
// In any screen
import * as Sentry from '@sentry/react-native';

<TouchableOpacity onPress={() => {
  throw new Error('Test Sentry Error');
}}>
  <Text>Test Sentry</Text>
</TouchableOpacity>
```

1. Build and run app
2. Tap test button
3. Check Sentry dashboard (sentry.io)
4. Should see error with full stack trace

---

## 🎯 What You Get (FREE Tier)

### **Included:**
- ✅ 5,000 errors/month
- ✅ Full stack traces
- ✅ Source maps (readable errors)
- ✅ Email alerts
- ✅ Error grouping
- ✅ Release tracking
- ✅ 30-day data retention
- ✅ 1 team member

### **Not Included (Paid Only):**
- ❌ Performance monitoring (transactions)
- ❌ Session replay
- ❌ Multiple team members
- ❌ 90-day retention
- ❌ Priority support

---

## 📊 Monitoring & Alerts

### **Set Up Email Alerts**

1. Go to Sentry dashboard
2. Project Settings → Alerts
3. Create alert rule:
   - **Trigger:** When error occurs
   - **Frequency:** Immediately
   - **Recipients:** Your email

### **Configure Error Grouping**

Sentry automatically groups similar errors. You can:
- Mark as resolved
- Assign to team member
- Add comments
- Track frequency

---

## 🔒 Privacy & GDPR

### **Scrub Sensitive Data**

```typescript
Sentry.init({
  dsn: 'YOUR_DSN',
  beforeSend(event) {
    // Remove sensitive data
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

### **User Consent**

Add to your privacy policy:
```
We use Sentry to monitor app errors and improve reliability.
Error reports may include device information but not personal data.
```

---

## 💰 Cost Breakdown

### **FREE Tier:**
- **Price:** $0/month
- **Errors:** 5,000/month
- **Users:** 1 team member
- **Retention:** 30 days
- **Perfect for:** 1-50 customers

### **When to Upgrade:**

**Team Plan ($26/month):**
- Upgrade when: 50+ customers
- Get: 50,000 errors/month
- Get: Unlimited team members
- Get: 90-day retention

**Business Plan ($80/month):**
- Upgrade when: 200+ customers
- Get: 500,000 errors/month
- Get: Performance monitoring
- Get: Priority support

---

## 🎯 Best Practices

### **1. Set User Context**

```typescript
// After login
Sentry.setUser({
  id: userId,
  username: restaurantName,
});

// After logout
Sentry.setUser(null);
```

### **2. Add Breadcrumbs**

```typescript
// Track user actions
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'User added wine',
  level: 'info',
});
```

### **3. Tag Errors**

```typescript
Sentry.setTag('feature', 'inventory');
Sentry.setTag('restaurant_id', restaurantId);
```

### **4. Monitor Performance**

```typescript
const transaction = Sentry.startTransaction({
  name: 'Sync Wines',
  op: 'sync',
});

try {
  await syncWines();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('error');
  throw error;
} finally {
  transaction.finish();
}
```

---

## 📈 What to Monitor

### **Critical Errors (Fix Immediately):**
- App crashes
- Data loss
- Sync failures
- Payment errors

### **Important Errors (Fix Soon):**
- UI rendering errors
- Network timeouts
- Validation failures

### **Low Priority (Fix Eventually):**
- Minor UI glitches
- Non-critical warnings
- Edge case errors

---

## 🚀 Quick Reference

### **Common Sentry Commands:**

```typescript
// Capture exception
Sentry.captureException(error);

// Capture message
Sentry.captureMessage('Something went wrong');

// Set user
Sentry.setUser({ id: '123' });

// Add breadcrumb
Sentry.addBreadcrumb({ message: 'User action' });

// Set tag
Sentry.setTag('feature', 'inventory');

// Set context
Sentry.setContext('restaurant', { id: '456' });
```

---

## ✅ Verification Checklist

After setup:

- [ ] Sentry account created
- [ ] SDK installed
- [ ] DSN configured
- [ ] Source maps enabled
- [ ] Test error sent
- [ ] Error appears in dashboard
- [ ] Email alert received
- [ ] User context working
- [ ] Privacy policy updated

---

## 🎯 Summary

**Sentry FREE tier gives you:**
- Professional error tracking
- Real-time alerts
- Full stack traces
- 5,000 errors/month
- Perfect for first 50 customers

**Cost:** $0/month until you need more

**Setup time:** 15 minutes

**Value:** Priceless (know about errors before customers complain!)

---

**Ready to add Sentry? Run:**

```bash
npx @sentry/wizard@latest -i reactNative
```

Then follow this guide to integrate with your logger! 🚀
