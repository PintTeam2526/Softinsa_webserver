import api from '../services/api'

// ###############################################################################################################
// ######################## RETIRAR QUANDO AS DASHBOARDS ESTIVEREM TODAS MIGRADAS ################################
// ###############################################################################################################
import { badgesChartOptions, badgesChartSeries, dashboardMetrics, dashboardUser } from '../models/dashboard.model'

export function useDashboardController() {
  return {
    user: dashboardUser,
    metrics: dashboardMetrics,
    chartOptions: badgesChartOptions,
    chartSeries: badgesChartSeries,
  }
}
// ###############################################################################################################

// Para chamar a rota do back com os dados do consultor
export async function getDashboardConsultor() {
  try {
    const response = await api.get('/dashboard/consultor')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da dashboard', error)
    throw error
  }
}
