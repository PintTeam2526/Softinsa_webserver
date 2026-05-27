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
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
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
    series: [
      { name: 'Jornada Tecnica', data: [88, 82, 88, 78, 86, 88, 80, 92, 89, 90, 91, 87] },
      { name: 'Power Skills', data: [78, 75, 78, 70, 76, 78, 72, 82, 79, 80, 81, 77] },
    ],
  },
  2026: {
    series: [
      { name: 'Jornada Tecnica', data: [90, 86, 91, 88, 92, 89, 94, 90, 93, 91, 95, 89] },
      { name: 'Power Skills', data: [80, 76, 81, 78, 82, 79, 84, 80, 83, 81, 85, 78] },
    ],
  },
}

export const badgesChartYearOptions = [2023, 2024, 2025, 2026]

export const badgesChartMonthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const badgesChartLearningPathByYear = {
  2023: [
    { name: 'Jornada Tecnica', data: [18, 28, 24, 31, 25, 36, 28, 20, 26, 24, 27, 22] },
    { name: 'Power Skills', data: [15, 24, 20, 27, 22, 31, 24, 17, 21, 20, 23, 18] },
  ],
  2024: [
    { name: 'Jornada Tecnica', data: [20, 31, 26, 35, 28, 39, 31, 22, 29, 27, 30, 25] },
    { name: 'Power Skills', data: [17, 27, 22, 30, 24, 34, 27, 19, 24, 23, 26, 20] },
  ],
  2025: [
    { name: 'Jornada Tecnica', data: [22, 38, 29, 41, 29, 46, 29, 22, 32, 29, 32, 22] },
    { name: 'Power Skills', data: [19, 33, 26, 35, 26, 40, 26, 19, 28, 26, 28, 19] },
  ],
  2026: [
    { name: 'Jornada Tecnica', data: [24, 41, 31, 44, 33, 49, 33, 24, 35, 32, 36, 24] },
    { name: 'Power Skills', data: [21, 36, 29, 38, 29, 43, 29, 21, 31, 29, 31, 21] },
  ],
}

export const badgesGroupedChartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    stacked: false,
  },
  colors: ['#3A57E8', '#85F4FA'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      columnWidth: '40%',
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: badgesChartMonthOptions,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#232D42', fontSize: '13px', fontWeight: 400 },
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      formatter: (value) => `${Math.round(value)}%`,
      style: { colors: '#232D42', fontSize: '13px', fontWeight: 400 },
    },
  },
  grid: {
    borderColor: '#E9ECEF',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (value) => `${Math.round(value)}%`,
    },
  },
}

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
