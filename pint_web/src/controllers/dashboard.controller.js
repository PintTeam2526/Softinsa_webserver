import {
  badgesChartOptions,
  badgesChartSeries,
  dashboardMetrics,
  dashboardUser,
} from '../models/dashboard.model'

export function useDashboardController() {
  return {
    user: dashboardUser,
    metrics: dashboardMetrics,
    chartOptions: badgesChartOptions,
    chartSeries: badgesChartSeries,
  }
}
