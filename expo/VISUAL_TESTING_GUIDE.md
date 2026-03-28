# 📱 WineOS - Visual Testing Guide

## 🎯 Step-by-Step Visual Walkthrough

---

## Step 1: Install Expo Go

### On Your Phone:

**iOS (iPhone/iPad):**
```
App Store → Search "Expo Go" → Install → Open
```

**Android:**
```
Play Store → Search "Expo Go" → Install → Open
```

---

## Step 2: Start Development Server

### On Your Computer:

**Open Terminal in Project Folder:**
```bash
cd /Users/nicoladebbia/Code_Ideas/Apps/WineOS-App-SebNik-main
```

**Start the Server:**
```bash
npm start
```

### What You'll See:

```
Starting Metro Bundler
█████████████████████████████████████████████████████████████

› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

**QR Code will appear here** ⬜⬜⬜⬜⬜

---

## Step 3: Connect Your Device

### Scan the QR Code:

**iOS:**
- Open Camera app
- Point at QR code
- Tap notification to open in Expo Go

**Android:**
- Open Expo Go app
- Tap "Scan QR Code"
- Point at QR code on screen

### Loading Screen:

```
┌─────────────────────────┐
│                         │
│    🍷 WineOS            │
│                         │
│    Loading...           │
│    ████████░░░░ 80%     │
│                         │
└─────────────────────────┘
```

---

## Step 4: App Interface Overview

### Main Screen - 4 Tabs:

```
┌─────────────────────────────────────┐
│  WineOS                    🔔 ⚙️    │
├─────────────────────────────────────┤
│                                     │
│  🔍 Search wines...                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🍷 Chianti Classico 2020    │   │
│  │ Region: Tuscany             │   │
│  │ Stock: 45 bottles  🟢       │   │
│  │ €15.00 → €28.00             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🍷 Barolo 2018              │   │
│  │ Region: Piedmont            │   │
│  │ Stock: 8 bottles   🔴       │   │
│  │ €25.00 → €45.00             │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ 📦 Inventario │ 💰 Vendite │ ➕ Aggiungi │ ⚙️ Impostazioni │
└─────────────────────────────────────┘
```

---

## Visual Testing Checklist

### 🟢 What Should Look Good:

#### Colors:
- **Primary**: Burgundy/Wine Red (#722F37)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: White/Light Gray

#### Typography:
- **Headings**: Bold, clear
- **Body text**: Readable size
- **Numbers**: Easy to read

#### Spacing:
- **Cards**: Proper padding
- **Lists**: Good spacing between items
- **Buttons**: Easy to tap (min 44x44 points)

#### Icons:
- **Lucide Icons**: Should render clearly
- **Tab Icons**: Visible and recognizable
- **Status Icons**: Color-coded correctly

---

## Feature Visual Guide

### Tab 1: 📦 Inventario (Inventory)

```
Visual Elements to Check:
✓ Search bar at top
✓ Filter buttons (Country, Region, Status)
✓ Wine cards with:
  - Wine name (bold)
  - Year and region
  - Stock quantity
  - Price information
  - Color indicator (🟢🟡🔴)
✓ Scroll smoothly
✓ Pull to refresh (optional)
```

**Color Indicators:**
- 🟢 **Green** = Stock OK (above target)
- 🟡 **Yellow** = Low stock (below target)
- 🔴 **Red** = Urgent (below minimum)

---

### Tab 2: 💰 Vendite (Sales)

```
Visual Elements to Check:
✓ Statistics cards at top:
  - Today's sales
  - Weekly sales
  - Monthly sales
✓ "Registra Vendita" button (prominent)
✓ Sales list with:
  - Wine name
  - Quantity sold
  - Date
  - Amount
✓ Date filter
✓ Empty state if no sales
```

---

### Tab 3: ➕ Aggiungi (Add Wine)

```
Visual Elements to Check:
✓ Form with labeled fields:
  - Nome (Text input)
  - Anno (Number input)
  - Paese (Picker: Italy/France)
  - Regione (Text input)
  - Fornitore (Text input)
  - Prezzo Acquisto (€)
  - Prezzo Vendita (€)
  - Quantità Attuale
  - Quantità Minima
  - Quantità Target
  - Vendite Settimanali Medie
  - Note (Multiline)
✓ "Aggiungi Vino" button at bottom
✓ Form validation messages
✓ Similar wine warning (if applicable)
```

---

### Tab 4: ⚙️ Impostazioni (Settings)

```
Visual Elements to Check:
✓ Statistics section:
  - Total wines
  - Total value
  - Wines needing reorder
  - Today's sales
✓ Export buttons (CSV, JSON)
✓ Import button
✓ Backup/Restore buttons
✓ Supabase sync toggle
✓ App version info
✓ Copyright notice
```

---

## Common Visual Issues & Fixes

### Issue: Text Too Small
**Check:** Font sizes appropriate for mobile
**Fix:** Adjust font sizes in styles

### Issue: Buttons Hard to Tap
**Check:** Touch targets at least 44x44 points
**Fix:** Increase button padding

### Issue: Colors Don't Match
**Check:** Using Colors constant from `constants/colors.ts`
**Fix:** Update color references

### Issue: Icons Not Showing
**Check:** Lucide icons imported correctly
**Fix:** Verify icon names and imports

### Issue: Layout Broken
**Check:** Flex layouts and responsive design
**Fix:** Test on different screen sizes

---

## Device-Specific Checks

### iPhone (iOS):
```
✓ Status bar visible (time, battery)
✓ Safe area respected (notch/island)
✓ Tab bar at bottom
✓ Gestures work (swipe back)
✓ Keyboard dismisses properly
```

### Android:
```
✓ Status bar visible
✓ Navigation bar at bottom
✓ Back button works
✓ Material Design elements
✓ Keyboard behavior correct
```

---

## Screenshot Checklist

Take screenshots of:
- [ ] Main inventory screen (with wines)
- [ ] Wine detail view
- [ ] Add wine form
- [ ] Sales screen
- [ ] Settings screen
- [ ] Empty states
- [ ] Error states
- [ ] Loading states

---

## Performance Visual Indicators

### Good Performance:
- ✅ Smooth scrolling (60 FPS)
- ✅ Instant tab switches
- ✅ Fast search results
- ✅ No lag when typing
- ✅ Animations smooth

### Poor Performance:
- ❌ Choppy scrolling
- ❌ Delayed tab switches
- ❌ Slow search
- ❌ Typing lag
- ❌ Janky animations

---

## Accessibility Check

### Visual Accessibility:
- [ ] Text contrast sufficient
- [ ] Touch targets large enough
- [ ] Color not sole indicator
- [ ] Icons have labels
- [ ] Error messages clear

---

## Final Visual Verification

### Before Approving:
- [ ] All screens look professional
- [ ] Consistent design throughout
- [ ] No visual glitches
- [ ] Responsive on your device
- [ ] Colors match brand
- [ ] Typography readable
- [ ] Icons clear and meaningful
- [ ] Spacing consistent
- [ ] Animations smooth
- [ ] Loading states handled

---

## Quick Visual Test

**30-Second Test:**
1. Open app → Check main screen loads
2. Tap each tab → All load correctly
3. Scroll list → Smooth scrolling
4. Tap wine card → Detail view opens
5. Go back → Navigation works

**If all ✅ → Visual design approved!**

---

## Visual Design Principles Applied

### Hierarchy:
- Important info prominent
- Clear visual hierarchy
- Logical flow

### Consistency:
- Same patterns throughout
- Consistent spacing
- Unified color scheme

### Feedback:
- Button press states
- Loading indicators
- Success/error messages

### Simplicity:
- Clean interface
- No clutter
- Easy to understand

---

**Visual Testing Complete! 🎨✅**

Your WineOS app should look professional, modern, and be easy to use on mobile devices.
