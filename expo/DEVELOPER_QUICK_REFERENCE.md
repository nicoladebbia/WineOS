# 🔧 Database Page - Developer Quick Reference

## 📦 NEW FILES CREATED

### Hooks (`/hooks/`)
| File | Purpose | Key Export |
|------|---------|------------|
| `useSmartPricing.ts` | Price intelligence | `useSmartPricing(wine)` |
| `useSupplierMemory.ts` | Supplier tracking | `useSupplierMemory(country, region)` |
| `useSmartQuantityDefaults.ts` | Quantity logic | `useSmartQuantityDefaults(wine)` |
| `useDuplicateDetection.ts` | Duplicate finder | `useDuplicateDetection(name, year, producer)` |
| `useRecentlyAddedWines.ts` | Recent wines | `useRecentlyAddedWines(limit)` |
| `useDatabaseFilters.ts` | Filter state | `useDatabaseFilters(wines)` |
| `useInventoryContext.ts` | Inventory check | `useInventoryContext(wine)` |

### Components (`/components/`)
| File | Purpose | Props |
|------|---------|-------|
| `PriceCalculatorModal.tsx` | Margin calculator | `visible, onClose, initialPurchasePrice, onApply` |
| `BatchAddModal.tsx` | Multi-vintage add | `visible, wine, producer, supplier, prices, onClose, onBatchAdd` |
| `WineDatabaseFilters.tsx` | Filter controls | `typeFilter, countryFilter, classificationFilter, sortBy, onTypeChange, etc.` |
| `SuccessActionsModal.tsx` | Post-add actions | `visible, wineName, onViewInventory, onAddAnother, onSearchAgain` |
| `RecentlyAddedStrip.tsx` | Recent wines strip | `onWineSelect` |
| `DuplicateWineDialog.tsx` | Duplicate warning | `visible, duplicateWine, matchType, confidence, onUpdateQuantity, onAddAnyway, onCancel` |

### Services (`/services/`)
| File | Purpose | Key Functions |
|------|---------|---------------|
| `csvImportService.ts` | CSV parsing/mapping | `parseCSV`, `mapCSVToWines`, `autoDetectMapping` |

---

## 🎯 COMPONENT INTEGRATION MAP

```
DatabaseSearchMode.tsx (Main)
├── useSmartPricing() → Auto-fill prices
├── useSupplierMemory() → Suggest suppliers
├── useSmartQuantityDefaults() → Auto-fill quantities
├── useDuplicateDetection() → Check duplicates
├── useInventoryContext() → Show existing wines
├── useDatabaseFilters() → Filter results
│
├── <RecentlyAddedStrip /> → Top of search view
├── <WineDatabaseFilters /> → Below search bar
│
└── When wine selected:
    ├── Progress bar → calculateFormProgress()
    ├── Wine details preview → wine.classification, avgPrice
    ├── Inventory context → <inventoryContextCard />
    ├── Producer search → producerSearchQuery
    ├── Quick year buttons → quickYears array
    ├── Supplier chips → supplierMemory.suggestions
    ├── Price explanation → priceExplanation
    ├── Margin display → inline calculation
    ├── Quantity presets → [6, 12, 24, 36]
    │
    └── Modals:
        ├── <PriceCalculatorModal />
        ├── <BatchAddModal />
        ├── <DuplicateWineDialog />
        └── <SuccessActionsModal />
```

---

## 🔑 KEY STATE VARIABLES

### Main Component State
```typescript
// Wine Selection
const [selectedWine, setSelectedWine] = useState<WineTemplate | null>(null);
const [selectedProducer, setSelectedProducer] = useState('');
const [selectedYear, setSelectedYear] = useState('');

// Form Data
const [supplier, setSupplier] = useState('');
const [purchasePrice, setPurchasePrice] = useState('');
const [sellingPrice, setSellingPrice] = useState('');
const [quantity, setQuantity] = useState('');
const [minQuantity, setMinQuantity] = useState('6');
const [quantityTarget, setQuantityTarget] = useState('24');

// UI State
const [showPriceCalculator, setShowPriceCalculator] = useState(false);
const [showBatchAdd, setShowBatchAdd] = useState(false);
const [showSuccessActions, setShowSuccessActions] = useState(false);
const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

// Validation
const [formErrors, setFormErrors] = useState<Record<string, string>>({});
const [priceExplanation, setPriceExplanation] = useState('');
```

---

## 🧩 HOOK USAGE PATTERNS

### 1. Smart Pricing
```typescript
const priceSuggestion = useSmartPricing(selectedWine);

useEffect(() => {
  if (priceSuggestion) {
    setPurchasePrice(priceSuggestion.purchasePrice.toFixed(2));
    setSellingPrice(priceSuggestion.sellingPrice.toFixed(2));
    setPriceExplanation(priceSuggestion.explanation);
  }
}, [priceSuggestion]);
```

### 2. Supplier Memory
```typescript
const supplierMemory = useSupplierMemory(
  selectedWine?.country, 
  selectedWine?.region
);

// Render suggestions
{supplierMemory.hasSuppliers && (
  supplierMemory.suggestions.map((sugg) => (
    <Chip onPress={() => setSupplier(sugg.name)}>
      {sugg.name} ({sugg.frequency})
    </Chip>
  ))
)}
```

### 3. Duplicate Detection
```typescript
const duplicateMatch = useDuplicateDetection(
  selectedWine?.name || '',
  selectedYear,
  selectedProducer
);

// Check before adding
if (duplicateMatch && !showDuplicateDialog) {
  setShowDuplicateDialog(true);
  return;
}
```

---

## 🎨 STYLING PATTERNS

### Color Usage
```typescript
// Primary actions
backgroundColor: Colors.primary
color: Colors.secondary

// Secondary actions
backgroundColor: Colors.card
color: Colors.primary
borderColor: Colors.primary

// Warnings/Context
backgroundColor: 'rgba(255, 193, 7, 0.1)'
borderColor: Colors.warning

// Explanations/Info
backgroundColor: 'rgba(125, 29, 63, 0.05)'
borderColor: 'rgba(125, 29, 63, 0.2)'

// Selected states
backgroundColor: Colors.primary
color: Colors.secondary

// Errors
borderColor: Colors.danger
color: Colors.danger
```

### Spacing Grid (4px base)
```typescript
gap: 4,      // Tight
gap: 8,      // Small
gap: 12,     // Medium
marginBottom: 16,  // Standard section spacing
marginBottom: 20,  // Large section spacing
padding: 16, // Card padding
```

### Border Radius
```typescript
borderRadius: 6,   // Small buttons
borderRadius: 8,   // Standard inputs/chips
borderRadius: 12,  // Cards/large buttons
borderRadius: 20,  // Modals
```

---

## 🔄 DATA FLOW

### Add Wine Flow
```
1. User searches → searchWines(query)
2. User selects wine → handleSelectWine(wine)
3. Hooks auto-populate:
   ├── useSmartPricing → prices
   ├── useSupplierMemory → supplier suggestions
   ├── useSmartQuantityDefaults → quantities
   └── useInventoryContext → existing wines
4. User fills/adjusts fields
5. Real-time validation → formErrors
6. User clicks Add → handleAddWine()
7. Duplicate check → useDuplicateDetection
8. If duplicate → show dialog
9. Else → addWine(wineData)
10. Show success modal → SuccessActionsModal
```

### Batch Add Flow
```
1. Complete steps 1-5 from Add Wine Flow
2. User clicks "Batch Add Vintages"
3. BatchAddModal opens with shared data
4. User adds multiple year+quantity pairs
5. User clicks "Add X Vintages"
6. handleBatchAdd() loops and creates wines
7. Toast confirmation + auto-back
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: Prices don't auto-fill
**Check:**
- Wine has `avgPrice` field in database
- User has similar wines in inventory
- `priceSuggestion` is not null in useEffect

### Issue: Suppliers don't show
**Check:**
- User has wines in inventory with suppliers
- Suppliers are not empty strings
- `supplierMemory.hasSuppliers` is true

### Issue: Duplicate detection too sensitive
**Adjust:**
- Threshold in `calculateStringSimilarity()` (currently 0.8)
- Lower = more matches, Higher = fewer matches

### Issue: Form validation not working
**Check:**
- `formErrors` object is populated in useEffect
- Effect dependencies include all form fields
- `Object.keys(formErrors).length` check

---

## 🧪 TESTING CHECKLIST

### Manual Testing
- [ ] Search finds wines correctly
- [ ] Filters apply and combine properly
- [ ] Price suggestions appear and are reasonable
- [ ] Supplier suggestions show for frequent suppliers
- [ ] Quantity defaults make sense for wine type
- [ ] Quick year buttons work and pre-select
- [ ] Progress bar updates as fields are filled
- [ ] Validation errors show in real-time
- [ ] Duplicate detection catches same wine
- [ ] Batch add creates multiple wines
- [ ] Price calculator computes correctly
- [ ] Success actions navigate properly
- [ ] Inventory context shows existing wines
- [ ] Recently added strip displays recent wines
- [ ] Producer search filters long lists

### Edge Cases
- [ ] Empty inventory (no suggestions)
- [ ] Wine with 0 producers
- [ ] Wine with 100+ producers
- [ ] Invalid year (before minVintage)
- [ ] Negative prices
- [ ] Zero quantity
- [ ] Duplicate with 100% match
- [ ] Duplicate with 85% match
- [ ] CSV with missing columns
- [ ] CSV with invalid data

---

## 📊 PERFORMANCE CONSIDERATIONS

### Memoization
```typescript
// useMemo for expensive calculations
const suggestions = useMemo(() => {
  // Complex filtering/sorting
  return computedValue;
}, [dependencies]);
```

### Debouncing
```typescript
// Debounce search input
const timer = setTimeout(() => {
  performSearch(query);
}, 300);
return () => clearTimeout(timer);
```

### Conditional Rendering
```typescript
// Only render when needed
{searchResults.length > 0 && <Filters />}
{selectedWine && <InventoryContext />}
```

---

## 🔐 TYPE SAFETY

All components are fully typed:
```typescript
// Interfaces defined
interface PriceSuggestion {
  purchasePrice: number;
  sellingPrice: number;
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
}

// Hook signatures
export const useSmartPricing = (
  wine: WineTemplate | null
): PriceSuggestion | null => { ... }

// Component props
interface BatchAddModalProps {
  visible: boolean;
  wine: WineTemplate | null;
  producer: string;
  supplier: string;
  purchasePrice: string;
  sellingPrice: string;
  minQuantity: string;
  quantityTarget: string;
  onClose: () => void;
  onBatchAdd: (vintages: VintageEntry[]) => void;
}
```

---

## 🚀 FUTURE ENHANCEMENTS

### Potential Additions
1. **Favorites/Pinned Wines** - Star frequently ordered wines
2. **Barcode Scanner** - Scan wine labels for quick add
3. **Photo Recognition** - OCR wine labels
4. **Voice Input** - "Add 12 bottles of Barolo 2019"
5. **Smart Reordering** - Auto-suggest wines to reorder based on velocity
6. **Price History** - Track price changes over time
7. **Supplier Comparison** - Compare prices across suppliers
8. **Bulk Edit** - Edit multiple wines at once
9. **Templates** - Save common configurations
10. **Analytics Integration** - Show sales data when viewing wine

### Architecture Improvements
1. Move CSV import to dedicated modal component
2. Create unified validation service
3. Add unit tests for all hooks
4. Implement E2E tests with Detox
5. Add performance monitoring
6. Implement proper error boundary
7. Add analytics tracking (Mixpanel/Amplitude)

---

## 📞 MAINTENANCE CONTACTS

### Key Dependencies
- **react-native**: Core framework
- **expo-router**: Navigation
- **zustand**: State management
- **lucide-react-native**: Icons
- **fuse.js**: Fuzzy search

### Related Files
- `/store/wineStore.ts` - Main wine state
- `/types/wine.ts` - Wine type definitions
- `/types/wineDatabase.ts` - Database types
- `/services/wineSearchService.ts` - Search logic
- `/constants/wineDatabase/` - Wine data

---

**Last Updated:** 2025-01-13  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
