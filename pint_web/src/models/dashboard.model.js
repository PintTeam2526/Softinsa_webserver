export const dashboardUser = {
  name: 'Antonio Portugal',
  role: 'Administrador',
}

export const dashboardMetrics = [
  { label: 'Utilizadores', value: '4600', icon: 'users' },
  { label: 'Total Badges', value: '200', icon: 'badges' },
  { label: 'Service Lines', value: '6', icon: 'service-lines' },
  { label: 'Total Areas', value: '6', icon: 'areas' },
  { label: 'Learning Paths', value: '2', icon: 'learning-paths' },
]

export const badgesChartOptions = {
  chart: {
    id: 'badges-chart',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ['#5c7aff', '#a5f3fc'],
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 },
  },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'] },
  yaxis: { min: 54, max: 99 },
  legend: { position: 'top', horizontalAlign: 'right' },
  dataLabels: { enabled: false },
}

export const badgesChartSeries = [
  { name: 'Jornada Tecnica', data: [88, 82, 88, 78, 88, 80, 92] },
  { name: 'Power Skills', data: [78, 75, 78, 70, 78, 72, 82] },
]
