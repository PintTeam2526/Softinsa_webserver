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

export const badgesChartByYear = {
  2023: {
    series: [
      { name: 'Jornada Tecnica', data: [58, 54, 60, 57, 61, 59, 63, 58, 62, 60, 64, 59] },
      { name: 'Power Skills', data: [46, 44, 49, 45, 50, 47, 52, 46, 49, 48, 51, 45] },
    ],
  },
  2024: {
    series: [
      { name: 'Jornada Tecnica', data: [72, 68, 74, 70, 75, 73, 77, 71, 76, 74, 78, 72] },
      { name: 'Power Skills', data: [60, 57, 63, 59, 64, 61, 66, 60, 64, 62, 67, 59] },
    ],
  },
  2025: {
    series: badgesChartSeries,
  },
  2026: {
    series: [
      { name: 'Jornada Tecnica', data: [90, 86, 91, 88, 92, 89, 94, 90, 93, 91, 95, 89] },
      { name: 'Power Skills', data: [80, 76, 81, 78, 82, 79, 84, 80, 83, 81, 85, 78] },
    ],
  },
}

export const badgesChartYearOptions = [2023, 2024, 2025, 2026]

export const learningPathBadgeLevels = [
  {
    value: 'Júnior',
    label: 'Nível Júnior',
    chartSeries: [62, 48],
    paths: [
      { label: 'Jornada Técnica', value: 18, color: '#3A57E8' },
      { label: 'Power Skills', value: 9, color: '#85F4FA' },
    ],
  },
  {
    value: 'Intermédio',
    label: 'Nível Intermédio',
    chartSeries: [82, 66],
    paths: [
      { label: 'Jornada Técnica', value: 25, color: '#3A57E8' },
      { label: 'Power Skills', value: 13, color: '#85F4FA' },
    ],
  },
  {
    value: 'Sénior',
    label: 'Nível Sénior',
    chartSeries: [70, 54],
    paths: [
      { label: 'Jornada Técnica', value: 14, color: '#3A57E8' },
      { label: 'Power Skills', value: 8, color: '#85F4FA' },
    ],
  },
  {
    value: 'Especialista',
    label: 'Nível Especialista',
    chartSeries: [54, 42],
    paths: [
      { label: 'Jornada Técnica', value: 11, color: '#3A57E8' },
      { label: 'Power Skills', value: 6, color: '#85F4FA' },
    ],
  },
  {
    value: 'Líder de conhecimento',
    label: 'Nível Líder de conhecimento',
    chartSeries: [38, 30],
    paths: [
      { label: 'Jornada Técnica', value: 7, color: '#3A57E8' },
      { label: 'Power Skills', value: 4, color: '#85F4FA' },
    ],
  },
]
