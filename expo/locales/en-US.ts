/**
 * English (US) Translations
 */

export const enUS = {
  analytics: {
    // Page title
    title: 'Analytics',
    
    // Period labels
    today: 'Today',
    week: 'Week',
    month: 'Month',
    all: 'All',
    lastNDays: 'Last {{count}} days',
    lastNDaysPlural: 'Last {{count}} days',
    
    // Period descriptions
    todayDescription: 'Today',
    todayWithContext: 'Today + 6 days context',
    lastSevenDays: 'Last 7 days',
    lastThirtyDays: 'Last 30 days',
    lastTwelveMonths: 'Last 12 months',
    allTime: 'All time',
    
    // Metrics
    bottlesSold: 'Bottles Sold',
    revenue: 'Revenue',
    profit: 'Profit',
    avgSale: 'Avg Sale',
    avgSaleValue: 'Avg Sale Value',
    
    // Trends
    vsYesterday: 'vs yesterday',
    vsPrevious: 'vs previous',
    
    // Charts
    salesTrend: 'Sales Trend',
    noSalesData: 'No sales data available',
    
    // Top Sellers
    topSellers: 'Top Sellers',
    noSalesYet: 'No sales in this period',
    bottles: 'bottles',
    bottle: 'bottle',
    
    // Revenue Insights
    revenueInsights: 'Revenue Insights',
    totalRevenue: 'Total Revenue',
    totalCost: 'Total Cost',
    grossProfit: 'Gross Profit',
    profitMargin: 'Profit Margin',
    avgProfitPerSale: 'Avg Profit/Sale',
    noRevenueData: 'No revenue data for this period',
    margin: 'margin',
    
    // Velocity Alerts
    velocityAlerts: 'Velocity Alerts',
    currentStock: 'Current Stock',
    salesRate: 'Sales Rate',
    daysUntilStockout: 'Days Until Stockout',
    suggestedReorder: 'Suggested reorder',
    allStockHealthy: 'All stock levels are healthy! 🎉',
    bottlesPerWeek: 'bottles/week',
    days: 'days',
    
    // Recent Activity
    recentActivity: 'Recent Activity',
    noRecentSales: 'No recent sales to display',
    sales: 'sales',
    
    // Time ago
    justNow: 'Just now',
    minutesAgo: '{{count}} min ago',
    minutesAgoPlural: '{{count}} mins ago',
    hoursAgo: '{{count}} hour ago',
    hoursAgoPlural: '{{count}} hours ago',
    yesterday: 'Yesterday',
    daysAgo: '{{count}} days ago',
    
    // Date categories
    todayCategory: 'Today',
    yesterdayCategory: 'Yesterday',
    thisWeek: 'This Week',
    older: 'Older',
    
    // Empty states
    noData: 'No data available',
    noSales: 'No sales',
    
    // Loading
    loading: 'Loading...',
    refreshing: 'Refreshing...',
  },
  
  common: {
    bottles: 'bottles',
    bottle: 'bottle',
    wine: 'wine',
    wines: 'wines',
    region: 'region',
    country: 'country',
  },
};

export type Translations = typeof enUS;
