# ✅ Expo Go Testing Checklist

## Pre-Testing Setup

### 1. Mobile Device Setup
- [ ] Expo Go app installed from App Store/Play Store
- [ ] Expo Go app opened at least once
- [ ] Device connected to Wi-Fi
- [ ] Device on same network as development computer

### 2. Development Environment
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install` completed)
- [ ] `.env` file configured with Supabase credentials (optional)
- [ ] No TypeScript errors (`npx tsc --noEmit` passes)
- [ ] All tests passing (`npm test` passes)

### 3. Network Configuration
- [ ] Computer and phone on same Wi-Fi network
- [ ] Firewall not blocking Expo (ports 19000-19001)
- [ ] VPN disabled (if causing issues)

---

## Starting the App

### Development Server
- [ ] Run `npm start` in terminal
- [ ] Expo Dev Tools opened in browser
- [ ] QR code displayed in terminal and browser
- [ ] No error messages in terminal
- [ ] Metro bundler running successfully

### Connection Methods
Choose one:

**Option A: Same Network (Recommended)**
- [ ] Scan QR code with Expo Go
- [ ] App starts loading
- [ ] JavaScript bundle downloads
- [ ] App opens successfully

**Option B: Tunnel Mode**
- [ ] Run `npm run start:tunnel`
- [ ] Wait for ngrok tunnel to establish
- [ ] Scan QR code
- [ ] App loads (may be slower)

---

## Feature Testing

### Tab 1: Inventario (Inventory)
- [ ] Tab loads without errors
- [ ] Wine list displays correctly
- [ ] Search bar works
- [ ] Country filter works (Italy/France)
- [ ] Region filter works
- [ ] Status filter works (All/Warning/Urgent)
- [ ] Wine cards show correct information
- [ ] Color indicators visible (Green/Yellow/Red)
- [ ] Tap wine card to view details
- [ ] Edit wine functionality works
- [ ] Delete wine functionality works
- [ ] Sell wine button works
- [ ] Restock wine button works

### Tab 2: Vendite (Sales)
- [ ] Tab loads without errors
- [ ] Sales statistics display correctly
- [ ] Today's sales list shows
- [ ] "Registra Vendita" button works
- [ ] Wine selection modal opens
- [ ] Can select wine from list
- [ ] Quantity input works
- [ ] Date picker works
- [ ] Sale records successfully
- [ ] Quantity updates in inventory
- [ ] Sales appear in history

### Tab 3: Aggiungi (Add Wine)
- [ ] Tab loads without errors
- [ ] Form displays all fields
- [ ] All input fields work:
  - [ ] Wine name
  - [ ] Year (numeric keyboard)
  - [ ] Country picker (Italy/France)
  - [ ] Region input
  - [ ] Supplier input
  - [ ] Purchase price (numeric)
  - [ ] Selling price (numeric)
  - [ ] Current quantity (numeric)
  - [ ] Minimum quantity (numeric)
  - [ ] Target quantity (numeric)
  - [ ] Average weekly sales (numeric)
  - [ ] Notes (multiline)
- [ ] Form validation works
- [ ] Similar wine detection works
- [ ] "Aggiungi Vino" button works
- [ ] Wine added to inventory
- [ ] Form resets after adding

### Tab 4: Impostazioni (Settings)
- [ ] Tab loads without errors
- [ ] Statistics section displays:
  - [ ] Total wines count
  - [ ] Total inventory value
  - [ ] Wines needing reorder
  - [ ] Total sales (today)
- [ ] Export section works:
  - [ ] Export CSV button works
  - [ ] Export JSON button works
  - [ ] Files download/share correctly
- [ ] Import section works:
  - [ ] Import JSON button works
  - [ ] File picker opens
  - [ ] Valid JSON imports successfully
  - [ ] Invalid JSON shows error
- [ ] Backup section works:
  - [ ] Backup button works
  - [ ] Restore button works
  - [ ] Clear all data works (with confirmation)
- [ ] Supabase sync section (if configured):
  - [ ] Sync toggle works
  - [ ] Manual sync button works
  - [ ] Sync status displays correctly
  - [ ] Last sync time shows
- [ ] App information displays:
  - [ ] Version number correct
  - [ ] Copyright notice visible

---

## UI/UX Testing

### Visual Elements
- [ ] All icons display correctly
- [ ] Colors match design (burgundy theme)
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] Touch targets are adequate size
- [ ] Spacing looks correct
- [ ] No overlapping elements
- [ ] Status bar visible

### Interactions
- [ ] Tap gestures work
- [ ] Scroll works smoothly
- [ ] Pull to refresh works (if implemented)
- [ ] Modals open/close correctly
- [ ] Keyboard appears for text inputs
- [ ] Keyboard dismisses properly
- [ ] Haptic feedback works (if enabled)

### Navigation
- [ ] Tab navigation works
- [ ] Back navigation works
- [ ] Deep links work (if implemented)
- [ ] Navigation animations smooth

### Responsiveness
- [ ] App works in portrait mode
- [ ] App works in landscape mode (if supported)
- [ ] Layout adapts to screen size
- [ ] No content cut off
- [ ] Scrollable areas work

---

## Data Persistence

### Local Storage
- [ ] Add wine, close app, reopen - wine still there
- [ ] Record sale, close app, reopen - sale recorded
- [ ] Settings persist after app restart
- [ ] Search filters reset correctly

### Supabase Sync (if configured)
- [ ] Enable sync in settings
- [ ] Add wine - syncs to cloud
- [ ] Edit wine - syncs changes
- [ ] Delete wine - syncs deletion
- [ ] Sync status indicator updates
- [ ] Offline changes queue for sync
- [ ] Reconnection triggers sync

---

## Error Handling

### Network Errors
- [ ] Airplane mode - app still works offline
- [ ] Poor connection - shows appropriate message
- [ ] No Supabase credentials - sync disabled gracefully

### User Errors
- [ ] Empty form submission - validation error shown
- [ ] Invalid data - error message displayed
- [ ] Duplicate wine - warning shown
- [ ] Overselling - quantity set to 0, not negative

### App Errors
- [ ] Error boundary catches crashes
- [ ] Error message user-friendly
- [ ] "Try Again" button works
- [ ] App recovers from errors

---

## Performance

### Loading
- [ ] Initial load time acceptable (< 5 seconds)
- [ ] Tab switches instant
- [ ] List scrolling smooth
- [ ] Search results fast
- [ ] No lag when typing

### Memory
- [ ] App doesn't crash with many wines (test with 50+)
- [ ] No memory warnings
- [ ] Images load efficiently
- [ ] No performance degradation over time

---

## Cross-Device Testing

### iOS Testing
- [ ] Tested on iPhone (if available)
- [ ] Tested on iPad (if available)
- [ ] iOS-specific gestures work
- [ ] Status bar correct
- [ ] Safe areas respected

### Android Testing
- [ ] Tested on Android phone
- [ ] Tested on Android tablet (if available)
- [ ] Back button works correctly
- [ ] Status bar correct
- [ ] Navigation bar correct

---

## Final Verification

### Code Quality
- [ ] No console errors in terminal
- [ ] No console warnings (or acceptable)
- [ ] TypeScript compilation clean
- [ ] All tests passing

### Documentation
- [ ] README.md updated
- [ ] EXPO_GO_GUIDE.md reviewed
- [ ] START_TESTING.md reviewed
- [ ] All guides accurate

### Deployment Ready
- [ ] App works on multiple devices
- [ ] All features tested
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Ready for production build

---

## Issues Found

Document any issues discovered during testing:

| Issue | Severity | Steps to Reproduce | Status |
|-------|----------|-------------------|--------|
| Example: Search lag with 100+ wines | Medium | Add 100 wines, search | Open |
|  |  |  |  |
|  |  |  |  |

---

## Sign-Off

- [ ] All critical features tested
- [ ] All major bugs resolved
- [ ] App ready for next phase
- [ ] Documentation complete

**Tested By:** _________________  
**Date:** _________________  
**Device(s):** _________________  
**Expo Go Version:** _________________  
**Notes:** _________________

---

## Quick Commands Reference

```bash
# Start testing
npm start

# Clear cache if issues
npm run start:clear

# Use tunnel if network issues
npm run start:tunnel

# Run tests
npm test

# Check TypeScript
npx tsc --noEmit
```

---

**Happy Testing! 🍷📱**
