import api from '../services/api'
import { badgesChartOptions, badgesChartSeries, dashboardMetrics, dashboardUser } from '../models/dashboard.model'

export function useDashboardController() {
  return {
    user: dashboardUser,
    metrics: dashboardMetrics,
    chartOptions: badgesChartOptions,
    chartSeries: badgesChartSeries,
  }
}

export async function getDashboardConsultor() {
  const response = await api.get('/dashboard/consultor')
  console.log('Dashboard data:', response.data)
  return response.data
}
