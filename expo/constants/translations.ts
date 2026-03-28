export const translations = {
  appName: 'WineOS',
  inventory: 'Inventory',
  add: 'Add',
  settings: 'Settings',
  dailySales: 'Daily Sales',
  analyticsTab: 'Analytics',
  wine: {
    name: 'Name',
    year: 'Year',
    type: 'Wine Type',
    country: 'Country',
    region: 'Region',
    grapeVariety: 'Grape Variety',
    supplier: 'Supplier',
    purchasePrice: 'Purchase Price',
    sellingPrice: 'Selling Price',
    quantity: 'Quantity',
    minQuantity: 'Minimum Quantity',
    quantityTarget: 'Target Inventory Level',
    averageWeeklySales: 'Average Weekly Sales',
    lastUpdated: 'Last Updated',
    notes: 'Notes',
    sales: 'Sales',
    soldBottles: 'Bottles Sold',
    saleDate: 'Sale Date',
    saleQuantity: 'Quantity Sold',
    suggestedReorderQuantity: 'Suggested Reorder Quantity',
    stock: 'Stock',
    target: 'Target',
    price: 'Price',
    sold: 'Sold',
    bottle: 'bottle',
    bottles: 'bottles'
  },
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    add: 'Add',
    addAnother: 'Add Another Wine',
    sell: 'Sell',
    restock: 'Restock',
    export: 'Export Data',
    import: 'Import Data',
    backup: 'Backup',
    restore: 'Restore',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    clearAllFilters: 'Clear All Filters',
    sync: 'Sync'
  },
  filters: {
    all: 'All',
    type: 'Wine Type',
    country: 'Country',
    region: 'Region',
    reorderStatus: 'Reorder Status'
  },
  reorderStatus: {
    ok: 'OK',
    warning: 'Warning',
    urgent: 'Urgent'
  },
  emptyState: {
    title: 'No wines found',
    description: 'Add your first wine by pressing the button below',
    noResults: 'No results found',
    noResultsDescription: 'Try adjusting your filters to see more wines',
    noSales: 'No sales today',
    noSalesDescription: 'Record your first sale of the day'
  },
  formValidation: {
    required: 'Required field',
    positiveNumber: 'Must be a positive number',
    validYear: 'Invalid year',
    noStock: 'No bottles available',
    insufficientStock: 'Insufficient stock',
    duplicateEntry: 'This wine has already been registered',
    quantityRequired: 'Quantity must be a positive number',
    priceRequired: 'Purchase price must be a positive number',
    cannotSellMore: 'Cannot sell more than {quantity} bottles'
  },
  sales: {
    title: 'Record Sale',
    quantity: 'Quantity',
    date: 'Date',
    submit: 'Record',
    history: 'Sales History',
    noSales: 'No sales recorded',
    success: 'Sale recorded successfully',
    dailySales: 'Daily Sales',
    selectWine: 'Select Wine',
    todaySales: 'Today\'s Sales',
    weeklySales: 'Weekly Sales',
    monthlySales: 'Monthly Sales'
  },
  export: {
    success: 'Data exported successfully',
    error: 'Error exporting data'
  },
  dashboard: {
    title: 'Dashboard',
    totalWines: 'Varieties',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    topSelling: 'Top Selling',
    weeklySales: 'Weekly Sales',
    totalBottles: 'Bottles',
    inventoryValue: 'Value',
    winesNeedingReorder: 'wines below reorder threshold',
    showingResults: 'Showing {count} of {total} wines',
    reorderNeeded: 'Reorder needed'
  },
  notifications: {
    wineAdded: 'Wine added successfully to inventory',
    wineUpdated: 'Wine updated successfully',
    restockSuccess: 'Inventory updated successfully',
    similarWineFound: 'You have already added a similar wine',
    addAnyway: 'Add Anyway',
    editExisting: 'Edit Existing Wine',
    cancel: 'Cancel',
    reorderNeeded: 'Warning: You only have {quantity} bottles of {wine} but your target stock is {target}. Time to reorder.',
    backupCreated: 'Backup created successfully',
    backupRestored: 'Backup restored successfully',
    syncComplete: 'Sync completed',
    syncError: 'Error during sync'
  },
  sync: {
    status: 'Sync status',
    lastSync: 'Last sync',
    synced: 'Synced',
    syncing: 'Syncing',
    offline: 'Offline',
    enable: 'Enable sync',
    disable: 'Disable sync'
  },
  analytics: {
    // Summary metrics
    bottlesSold: 'Bottles Sold',
    revenue: 'Revenue',
    profit: 'Profit',
    avgSale: 'Avg Sale',
    avgSaleValue: 'Avg Sale Value',
    margin: 'margin',
    vsYesterday: 'vs yesterday',
    vsPrevious: 'vs previous',
    
    // Top sellers
    topSellers: 'Top Sellers',
    noSalesYet: 'No sales in this period',
    
    // Sales trend
    salesTrend: 'Sales Trend',
    noSalesData: 'No sales data available',
    periodToday: 'Today',
    periodLastDays: 'Last {count} days',
    periodLastMonths: 'Last 12 months',
    
    // Month names for chart labels
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    // Revenue insights
    revenueInsights: 'Revenue Insights',
    totalRevenue: 'Total Revenue',
    totalCost: 'Total Cost',
    grossProfit: 'Gross Profit',
    profitMargin: 'Profit Margin',
    avgProfitPerSale: 'Avg Profit/Sale',
    noRevenueData: 'No revenue data for this period',
    
    // Velocity alerts
    velocityAlerts: 'Velocity Alerts',
    currentStock: 'Current Stock',
    salesRate: 'Sales Rate',
    daysUntilStockout: 'Days Until Stockout',
    suggestedReorder: 'Suggested reorder',
    allStockHealthy: 'All stock levels are healthy!',
    
    // Recent activity
    recentActivity: 'Recent Activity',
    noRecentSales: 'No recent sales to display'
  }
};