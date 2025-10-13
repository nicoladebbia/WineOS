# 🔧 Comprehensive UI/UX Fix Plan

## Issues to Fix:
1. **Buttons hidden by keyboard or scroll**
2. **Lists overlapping with bottom navigation**
3. **Modal content not fully scrollable**
4. **Submit/Save buttons inside ScrollView (can be hidden)**

## Files to Fix:

### Critical (Forms with Submit Buttons):
1. ✅ `components/WineForm.tsx` - Save button inside ScrollView
2. ✅ `components/SaleForm.tsx` - Submit button visibility
3. ✅ `components/RestockModal.tsx` - Button in modal
4. ✅ `components/SaleModal.tsx` - Modal button visibility
5. ✅ `components/SupabaseSetupModal.tsx` - Setup button
6. ✅ `components/SimilarWineDialog.tsx` - Dialog buttons
7. ✅ `components/WineSearchModal.tsx` - Search results scrolling
8. ✅ `components/ProducerSelector.tsx` - Producer list scrolling
9. ✅ `components/YearInput.tsx` - Continue button

### Screens (Lists and Content):
10. ✅ `app/(tabs)/index.tsx` - Inventory list
11. ✅ `app/(tabs)/add.tsx` - Add wine screen
12. ✅ `app/(tabs)/sales.tsx` - Sales screen
13. ✅ `app/(tabs)/settings.tsx` - Settings content
14. ✅ `app/wine/[id].tsx` - Wine detail screen

## Solution Pattern:

### For Forms with Buttons:
```typescript
<View style={{flex: 1}}>
  <ScrollView 
    contentContainerStyle={{paddingBottom: 100}} // Extra space
    keyboardShouldPersistTaps="handled"
  >
    {/* Form content */}
  </ScrollView>
  
  {/* Button OUTSIDE ScrollView */}
  <View style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  }}>
    <TouchableOpacity style={styles.submitButton}>
      <Text>Save</Text>
    </TouchableOpacity>
  </View>
</View>
```

### For Lists:
```typescript
<FlatList
  data={items}
  contentContainerStyle={{
    paddingBottom: 100, // Space for tab bar
  }}
  ListFooterComponent={<View style={{height: 20}} />}
/>
```

### For Modals:
```typescript
<Modal>
  <SafeAreaView style={{flex: 1}}>
    <ScrollView contentContainerStyle={{paddingBottom: 100}}>
      {/* Content */}
    </ScrollView>
    {/* Fixed button at bottom */}
  </SafeAreaView>
</Modal>
```
