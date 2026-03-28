# 📱 ANALYTICS TAB - VISUAL GUIDE

## 🎨 Screen Layout Preview

```
┌─────────────────────────────────────────┐
│ 📊 Analytics                            │ ← Header
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Today] [Week] [Month] [All]       │ │ ← Period Selector
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📈 ANALYTICS SUMMARY               │ │
│ │ ┌─────────┬─────────┐              │ │
│ │ │ 🛒 87   │ 💰 €2.4K│              │ │
│ │ │ Bottles │ Revenue │              │ │
│ │ │ ↑ 12%   │         │              │ │
│ │ └─────────┴─────────┘              │ │
│ │ ┌─────────┬─────────┐              │ │
│ │ │ 📊 €850 │ 📦 €28  │              │ │
│ │ │ Profit  │ Avg Sale│              │ │
│ │ │ 35% mrg │         │              │ │
│ │ └─────────┴─────────┘              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 SALES TREND (Last 7 days)       │ │
│ │                                     │ │
│ │  15 ┤                               │ │
│ │  10 ┤     ▓                         │ │
│ │   5 ┤ ▓   ▓   ▓       ▓         ▓  │ │
│ │   0 ┼─────────────────────────────  │ │
│ │     Mon Tue Wed Thu Fri Sat Sun    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏆 TOP SELLERS (Last 7 days)       │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 🥇 Barolo 2018          45 ▓▓▓▓│ │ │
│ │ │    Piedmont, Italy              │ │ │
│ │ │    45 bottles • €1,350          │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 🥈 Chianti Classico     38 ▓▓▓ │ │ │
│ │ │    Tuscany, Italy               │ │ │
│ │ │    38 bottles • €1,140          │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 🥉 Brunello 2017        32 ▓▓▓ │ │ │
│ │ │    Tuscany, Italy               │ │ │
│ │ │    32 bottles • €960            │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💰 REVENUE INSIGHTS                │ │
│ │ Total Revenue:      €2,450         │ │
│ │ Total Cost:         €1,600         │ │
│ │ ─────────────────────────────────  │ │
│ │ Gross Profit:       €850           │ │
│ │ Profit Margin:      34.7%          │ │
│ │ ─────────────────────────────────  │ │
│ │ Avg Profit/Sale:    €9.77          │ │
│ │ Avg Sale Value:     €28.16         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⚠️ VELOCITY ALERTS              [3]│ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ ⚠️ Brunello 2017                │ │ │
│ │ │    Tuscany, Italy               │ │ │
│ │ │    Current Stock: 3 bottles     │ │ │
│ │ │    Sales Rate: 8/week           │ │ │
│ │ │    Days Until Stockout: ~2 days │ │ │
│ │ │    📦 Suggested reorder: 12     │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🕐 RECENT ACTIVITY          (20)   │ │
│ │                                     │ │
│ │ TODAY                               │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 🛒 Barolo 2018                  │ │ │
│ │ │    2 bottles • Piedmont   2h ago│ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 🛒 Chianti Classico             │ │ │
│ │ │    6 bottles • Tuscany    5h ago│ │ │
│ │ └─────────────────────────────────┘ │ │
│ │                                     │ │
│ │ YESTERDAY                           │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 🛒 Brunello 2017                │ │ │
│ │ │    1 bottle • Tuscany  Yesterday│ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### **Primary Colors**
- **Primary (Wine Red)**: `#7D1D3F` - Main brand color, buttons, active states
- **Secondary (Cream)**: `#F5F5DC` - Button text, light backgrounds
- **Success (Green)**: `#43A047` - Positive trends, profit, healthy stock
- **Warning (Orange)**: `#FFA000` - Warnings, medium urgency
- **Danger (Red)**: `#E53935` - Critical alerts, negative trends

### **Neutral Colors**
- **Text**: `#1A1A1A` - Primary text
- **Light Text**: `#757575` - Secondary text, labels
- **Background**: `#F5F5F5` - Screen background
- **Card**: `#FFFFFF` - Card backgrounds
- **Divider**: `#E0E0E0` - Borders, dividers

---

## 📊 Component Breakdown

### **1. Period Selector**
```
┌─────────────────────────────────────┐
│ [Today] [Week] [Month] [All]       │
└─────────────────────────────────────┘
```
- **Active State**: Wine red background, cream text
- **Inactive State**: Transparent background, gray text
- **Interaction**: Tap to switch, haptic feedback

---

### **2. Analytics Summary**
```
┌─────────────────────────────────────┐
│ ┌─────────┬─────────┐              │
│ │ 🛒 87   │ 💰 €2.4K│              │
│ │ Bottles │ Revenue │              │
│ │ ↑ 12%   │         │              │
│ └─────────┴─────────┘              │
│ ┌─────────┬─────────┐              │
│ │ 📊 €850 │ 📦 €28  │              │
│ │ Profit  │ Avg Sale│              │
│ │ 35% mrg │         │              │
│ └─────────┴─────────┘              │
└─────────────────────────────────────┘
```
- **Layout**: 2×2 grid with dividers
- **Icons**: Lucide icons in primary color
- **Trend**: Arrow (↑↓→) with percentage, color-coded

---

### **3. Sales Trend Chart**
```
┌─────────────────────────────────────┐
│ 📊 SALES TREND (Last 7 days)       │
│                                     │
│  15 ┤                               │
│  10 ┤     ▓                         │
│   5 ┤ ▓   ▓   ▓       ▓         ▓  │
│   0 ┼─────────────────────────────  │
│     Mon Tue Wed Thu Fri Sat Sun    │
└─────────────────────────────────────┘
```
- **Type**: Vertical bar chart
- **Bars**: Wine red color, rounded tops
- **Grid**: Light gray horizontal lines
- **Labels**: Day abbreviations (Mon, Tue, etc.)
- **Values**: Shown above bars when > 0

---

### **4. Top Selling Wines**
```
┌─────────────────────────────────────┐
│ 🏆 TOP SELLERS (Last 7 days)       │
│ ┌─────────────────────────────────┐ │
│ │ 🥇 Barolo 2018          45 ▓▓▓▓│ │
│ │    Piedmont, Italy              │ │
│ │    45 bottles • €1,350          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- **Ranking**: Medal emojis (🥇🥈🥉) for top 3, numbers for rest
- **Progress Bar**: Relative to #1 seller (100% width)
- **Info**: Wine name, year, region, country
- **Stats**: Quantity + revenue in green
- **Interaction**: Tap to view wine details

---

### **5. Revenue Insights**
```
┌─────────────────────────────────────┐
│ 💰 REVENUE INSIGHTS                │
│ Total Revenue:      €2,450         │
│ Total Cost:         €1,600         │
│ ─────────────────────────────────  │
│ Gross Profit:       €850           │
│ Profit Margin:      34.7%          │
│ ─────────────────────────────────  │
│ Avg Profit/Sale:    €9.77          │
│ Avg Sale Value:     €28.16         │
└─────────────────────────────────────┘
```
- **Layout**: List of key-value pairs
- **Dividers**: Between sections
- **Profit Margin Color**:
  - Green: ≥30%
  - Yellow: 15-29%
  - Red: <15%

---

### **6. Velocity Alerts**
```
┌─────────────────────────────────────┐
│ ⚠️ VELOCITY ALERTS              [3]│
│ ┌─────────────────────────────────┐ │
│ │ ⚠️ Brunello 2017                │ │
│ │    Tuscany, Italy               │ │
│ │    Current Stock: 3 bottles     │ │
│ │    Sales Rate: 8/week           │ │
│ │    Days Until Stockout: ~2 days │ │
│ │    📦 Suggested reorder: 12     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- **Urgency Colors**:
  - **Critical** (< 7 days): Red border + red text
  - **Warning** (< 14 days): Orange border + orange text
- **Badge**: Shows count of alerts
- **Interaction**: Tap to view wine details
- **Empty State**: "All stock levels are healthy! 🎉"

---

### **7. Recent Activity**
```
┌─────────────────────────────────────┐
│ 🕐 RECENT ACTIVITY          (20)   │
│                                     │
│ TODAY                               │
│ ┌─────────────────────────────────┐ │
│ │ 🛒 Barolo 2018                  │ │
│ │    2 bottles • Piedmont   2h ago│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
- **Grouping**: Today, Yesterday, This Week, Older
- **Icon**: Shopping cart in circle
- **Time**: Relative (2h ago, Yesterday, etc.)
- **Interaction**: Tap to view wine details

---

## 🎯 Empty States

### **No Sales Data**
```
┌─────────────────────────────────────┐
│ 📊 SALES TREND                     │
│                                     │
│          🍷                         │
│    No sales data available          │
│                                     │
└─────────────────────────────────────┘
```

### **No Top Sellers**
```
┌─────────────────────────────────────┐
│ 🏆 TOP SELLERS                     │
│                                     │
│          🍷                         │
│    No sales in this period          │
│                                     │
└─────────────────────────────────────┘
```

### **All Stock Healthy**
```
┌─────────────────────────────────────┐
│ ⚠️ VELOCITY ALERTS                 │
│                                     │
│          📦                         │
│  All stock levels are healthy! 🎉  │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### **Phone (Portrait)**
- Single column layout
- Full-width cards
- Stacked metrics (2×2 grid)
- Chart adapts to screen width

### **Tablet (Landscape)**
- Could be enhanced to show 2-column layout
- Side-by-side cards
- Wider charts

---

## 🎬 Animations & Interactions

### **Period Selector**
- **Tap**: Haptic feedback (light)
- **Transition**: Background color fade (150ms)

### **Top Sellers**
- **Progress Bars**: Could animate on load (future enhancement)
- **Tap**: Haptic feedback + navigate to wine detail

### **Velocity Alerts**
- **Tap**: Haptic feedback (medium) + navigate
- **Color**: Urgency-based border color

### **Recent Activity**
- **Tap**: Haptic feedback (light) + navigate
- **Scroll**: Smooth scrolling

### **Pull to Refresh**
- **Pull**: Standard iOS/Android refresh indicator
- **Refresh**: 500ms delay (simulated)

---

## 🎨 Typography

### **Font Sizes**
- **Title**: 18px, weight 600
- **Subtitle**: 12px, weight 400
- **Metric Value**: 24px, weight 700
- **Metric Label**: 12px, weight 400
- **Body Text**: 15px, weight 400
- **Small Text**: 11-12px, weight 400

### **Font Weights**
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## 🚀 Performance Optimizations

### **Implemented**
- ✅ `useMemo` for expensive calculations
- ✅ `useCallback` for event handlers
- ✅ `React.memo` for components
- ✅ Efficient date filtering
- ✅ Lazy calculation (only when needed)

### **Future Enhancements**
- 🔄 Virtualized lists for long lists
- 🔄 Debounced period switching
- 🔄 Background calculation workers
- 🔄 Cached analytics results

---

## 🎉 Visual Polish

### **Shadows & Elevation**
- **Cards**: Subtle shadow (0, 2, 0.1, 4)
- **Modals**: Stronger shadow (0, 2, 0.3, 4)

### **Border Radius**
- **Cards**: 12px
- **Buttons**: 8-10px
- **Badges**: 12px (circular)

### **Spacing**
- **Card Padding**: 16px
- **Card Margin**: 16px bottom
- **Section Gap**: 12-16px
- **Screen Padding**: 16px horizontal

---

This visual guide should help you understand the layout and design of the Analytics tab! 🎨
