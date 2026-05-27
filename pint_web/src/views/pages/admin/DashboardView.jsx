import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { Card, Col, Dropdown, Row } from 'react-bootstrap'
import { useDashboardController } from '../../../controllers/dashboard.controller'
import './DashboardView.css'

const learningPathChartOptions = {
  chart: {
    type: 'radialBar',
    sparkline: { enabled: true },
    toolbar: { show: false },
  },
  colors: ['#3A57E8', '#85F4FA'],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 270,
      hollow: {
        margin: 0,
        size: '60%',
        background: 'transparent',
      },
      track: {
        background: '#E9ECEF',
        strokeWidth: '100%',
        margin: 8,
      },
      dataLabels: {
        show: false,
      },
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Jornada Tecnica', 'Power Skills'],
}

const iconSvgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  'aria-hidden': true,
}

function DashboardUsersIcon() {
  return (
    <svg {...iconSvgProps} viewBox="0 0 24 24" className="softinsa-summary-icon">
      <path
        d="M11.949 14.5399C8.49903 14.5399 5.58807 15.1037 5.58807 17.2794C5.58807 19.4561 8.51783 20 11.949 20C15.399 20 18.31 19.4362 18.31 17.2605C18.31 15.0839 15.3802 14.5399 11.949 14.5399Z"
        fill="currentColor"
      />
      <path
        opacity="0.4"
        d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z"
        fill="currentColor"
      />
      <path
        opacity="0.4"
        d="M21.0879 9.21926C21.6923 6.84179 19.9203 4.70657 17.6639 4.70657C17.4186 4.70657 17.184 4.73359 16.9548 4.77952C16.9243 4.78672 16.8903 4.80203 16.8724 4.82905C16.8518 4.86327 16.867 4.9092 16.8894 4.93892C17.5672 5.89531 17.9567 7.05973 17.9567 8.3097C17.9567 9.50744 17.5995 10.6241 16.9727 11.5508C16.9082 11.6463 16.9655 11.775 17.0792 11.7949C17.2368 11.8228 17.398 11.8372 17.5627 11.8417C19.2058 11.8849 20.6805 10.8213 21.0879 9.21926Z"
        fill="currentColor"
      />
      <path
        d="M22.8093 14.8169C22.5084 14.1721 21.7823 13.73 20.6782 13.5129C20.1571 13.385 18.7468 13.2049 17.4351 13.2292C17.4154 13.2319 17.4046 13.2455 17.4028 13.2545C17.4002 13.2671 17.4055 13.2887 17.4315 13.3022C18.0377 13.6039 20.381 14.916 20.0864 17.6834C20.0738 17.8032 20.1696 17.9067 20.2887 17.8887C20.8654 17.8059 22.349 17.4853 22.8093 16.4866C23.0636 15.9588 23.0636 15.3456 22.8093 14.8169Z"
        fill="currentColor"
      />
      <path
        opacity="0.4"
        d="M7.04483 4.77979C6.8165 4.73296 6.58101 4.70685 6.33567 4.70685C4.07926 4.70685 2.30726 6.84207 2.91255 9.21953C3.31906 10.8216 4.79379 11.8852 6.43685 11.842C6.60161 11.8375 6.76368 11.8221 6.92037 11.7951C7.03409 11.7753 7.09139 11.6465 7.02692 11.5511C6.40014 10.6235 6.04288 9.50771 6.04288 8.30997C6.04288 7.0591 6.43327 5.89468 7.11109 4.93919C7.13258 4.90947 7.1487 4.86354 7.12721 4.82932C7.1093 4.80141 7.07617 4.787 7.04483 4.77979Z"
        fill="currentColor"
      />
      <path
        d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.485 3.13531 17.8065 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6831C3.61883 14.9166 5.9621 13.6045 6.56918 13.3028C6.59425 13.2884 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z"
        fill="currentColor"
      />
    </svg>
  )
}

function DashboardBadgesIcon() {
  return (
    <svg {...iconSvgProps} viewBox="0 0 24 24" className="softinsa-summary-icon">
      <g clipPath="url(#dashboard_badges_clip)">
        <path
          d="M20.4908 9.39773C20.4908 11.651 19.5957 13.812 18.0024 15.4053C16.4091 16.9986 14.2481 17.8937 11.9948 17.8937C9.74156 17.8937 7.58057 16.9986 5.98726 15.4053C4.39395 13.812 3.49884 11.651 3.49884 9.39773C3.49884 7.14445 4.39395 4.98346 5.98726 3.39015C7.58057 1.79684 9.74156 0.901733 11.9948 0.901733C14.2481 0.901733 16.4091 1.79684 18.0024 3.39015C19.5957 4.98346 20.4908 7.14445 20.4908 9.39773Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.6354 13.5652L0.857117 20.1103L4.93883 19.0166L6.03426 23.0983L9.31197 17.4206M19.3645 13.5652L23.1428 20.1103L19.0594 19.0166L17.9657 23.0983L14.688 17.4206M12.3428 4.78459L13.5137 7.14002C13.5391 7.19986 13.5803 7.2517 13.6328 7.29004C13.6853 7.32837 13.7472 7.35176 13.812 7.35773L16.4125 7.75202C16.487 7.76153 16.5571 7.79208 16.6148 7.84008C16.6725 7.88808 16.7152 7.95153 16.7381 8.02299C16.7609 8.09445 16.7629 8.17094 16.7438 8.2435C16.7247 8.31605 16.6853 8.38165 16.6303 8.43259L14.7085 10.2566C14.6797 10.311 14.6647 10.3716 14.6647 10.4332C14.6647 10.4947 14.6797 10.5553 14.7085 10.6097L15.0771 13.1949C15.0931 13.2698 15.0869 13.3477 15.0593 13.4192C15.0318 13.4907 14.9839 13.5526 14.9218 13.5973C14.8596 13.642 14.7857 13.6677 14.7092 13.6711C14.6326 13.6745 14.5568 13.6556 14.4908 13.6166L12.1765 12.3926C12.1167 12.3656 12.0519 12.3517 11.9863 12.3517C11.9206 12.3517 11.8558 12.3656 11.796 12.3926L9.48169 13.6166C9.41581 13.6545 9.34037 13.6726 9.26445 13.6687C9.18853 13.6647 9.11537 13.6389 9.05378 13.5944C8.99219 13.5498 8.9448 13.4884 8.9173 13.4175C8.88981 13.3466 8.8834 13.2693 8.89883 13.1949L9.33426 10.6097C9.35315 10.5498 9.35677 10.4861 9.34479 10.4245C9.33282 10.3628 9.30563 10.3051 9.26569 10.2566L7.3474 8.41716C7.29585 8.3656 7.2596 8.30076 7.24269 8.22984C7.22578 8.15892 7.22886 8.0847 7.2516 8.01542C7.27433 7.94615 7.31583 7.88454 7.37148 7.83743C7.42713 7.79033 7.49475 7.75957 7.56683 7.74859L10.1657 7.37145C10.2304 7.36548 10.2924 7.34208 10.3449 7.30375C10.3974 7.26542 10.4386 7.21358 10.464 7.15373L11.6348 4.7983C11.666 4.73145 11.7153 4.67468 11.7771 4.63444C11.8389 4.59421 11.9108 4.57212 11.9846 4.57069C12.0583 4.56926 12.131 4.58855 12.1943 4.62636C12.2576 4.66417 12.3091 4.71899 12.3428 4.78459Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="dashboard_badges_clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function DashboardAreasIcon() {
  return (
    <svg {...iconSvgProps} viewBox="0 0 24 24" className="softinsa-summary-icon">
      <path
        d="M10.5 7.5C10.5 7.20333 10.588 6.91332 10.7528 6.66665C10.9176 6.41997 11.1519 6.22771 11.426 6.11418C11.7001 6.00065 12.0017 5.97094 12.2926 6.02882C12.5836 6.0867 12.8509 6.22956 13.0607 6.43934C13.2704 6.64912 13.4133 6.91639 13.4712 7.20736C13.5291 7.49834 13.4994 7.79994 13.3858 8.07403C13.2723 8.34811 13.08 8.58238 12.8334 8.7472C12.5867 8.91203 12.2967 9 12 9C11.6022 9 11.2206 8.84196 10.9393 8.56066C10.658 8.27936 10.5 7.89782 10.5 7.5ZM6 7.5C6 5.9087 6.63214 4.38258 7.75736 3.25736C8.88258 2.13214 10.4087 1.5 12 1.5C13.5913 1.5 15.1174 2.13214 16.2426 3.25736C17.3679 4.38258 18 5.9087 18 7.5C18 13.1203 12.6019 16.2694 12.375 16.4016C12.2617 16.4663 12.1334 16.5004 12.0028 16.5004C11.8723 16.5004 11.744 16.4663 11.6306 16.4016C11.3981 16.2694 6 13.125 6 7.5ZM7.5 7.5C7.5 11.4563 10.86 14.0822 12 14.8594C13.1391 14.0831 16.5 11.4563 16.5 7.5C16.5 6.30653 16.0259 5.16193 15.182 4.31802C14.3381 3.47411 13.1935 3 12 3C10.8065 3 9.66193 3.47411 8.81802 4.31802C7.97411 5.16193 7.5 6.30653 7.5 7.5ZM19.0097 13.8403C18.8251 13.7793 18.624 13.7924 18.4489 13.8768C18.2738 13.9612 18.1382 14.1102 18.0709 14.2926C18.0035 14.475 18.0096 14.6764 18.0879 14.8543C18.1661 15.0323 18.3104 15.1729 18.4903 15.2466C20.0381 15.8194 21 16.5863 21 17.25C21 18.5025 17.5763 20.25 12 20.25C6.42375 20.25 3 18.5025 3 17.25C3 16.5863 3.96187 15.8194 5.50969 15.2475C5.6896 15.1739 5.8339 15.0332 5.91215 14.8553C5.99039 14.6773 5.99648 14.4759 5.92913 14.2935C5.86178 14.1112 5.72624 13.9621 5.5511 13.8777C5.37596 13.7933 5.17491 13.7803 4.99031 13.8412C2.73937 14.6709 1.5 15.8822 1.5 17.25C1.5 20.1731 6.91031 21.75 12 21.75C17.0897 21.75 22.5 20.1731 22.5 17.25C22.5 15.8822 21.2606 14.6709 19.0097 13.8403Z"
        fill="currentColor"
      />
    </svg>
  )
}

function DashboardServiceLinesIcon() {
  return (
    <svg {...iconSvgProps} viewBox="0 0 24 24" className="softinsa-summary-icon">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 9C5 7.14348 5.7375 5.36301 7.05025 4.05025C8.36301 2.7375 10.1435 2 12 2C13.8565 2 15.637 2.7375 16.9497 4.05025C18.2625 5.36301 19 7.14348 19 9V10.035C20.696 10.278 22 11.737 22 13.5V13.75C21.9999 14.1836 21.913 14.6128 21.7444 15.0123C21.5759 15.4119 21.3291 15.7736 21.0186 16.0763C20.7081 16.379 20.3401 16.6164 19.9365 16.7747C19.5328 16.933 19.1015 17.0089 18.668 16.998C17.928 19.118 16.046 20.547 14.015 20.909C13.545 21.081 12.989 21 12.5 21C12.1022 21 11.7206 20.842 11.4393 20.5607C11.158 20.2794 11 19.8978 11 19.5C11 19.1022 11.158 18.7206 11.4393 18.4393C11.7206 18.158 12.1022 18 12.5 18H13.5C13.7348 18 13.9664 18.055 14.176 18.1608C14.3856 18.2666 14.5675 18.4201 14.707 18.609C16.003 17.992 17 16.689 17 15V9C17 7.67392 16.4732 6.40215 15.5355 5.46447C14.5979 4.52678 13.3261 4 12 4C10.6739 4 9.40215 4.52678 8.46447 5.46447C7.52678 6.40215 7 7.67392 7 9V15.25C7 15.7141 6.81563 16.1592 6.48744 16.4874C6.15925 16.8156 5.71413 17 5.25 17C4.38805 17 3.5614 16.6576 2.9519 16.0481C2.34241 15.4386 2 14.612 2 13.75V13.5C1.99978 12.6582 2.30296 11.8446 2.85395 11.2082C3.40495 10.5718 4.16685 10.1553 5 10.035V9ZM5 12.085C4.70742 12.1884 4.45413 12.3801 4.27503 12.6335C4.09593 12.8869 3.99984 13.1897 4 13.5V13.75C4 14.355 4.43 14.86 5 14.975V12.085ZM19 12.085V14.975C19.57 14.859 20 14.355 20 13.75V13.5C20.0002 13.1897 19.9041 12.8869 19.725 12.6335C19.5459 12.3801 19.2926 12.1884 19 12.085Z"
        fill="currentColor"
      />
    </svg>
  )
}

function DashboardLearningPathsIcon() {
  return (
    <svg {...iconSvgProps} viewBox="0 0 24 24" className="softinsa-summary-icon">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6C3.00014 5.43893 3.15762 4.88915 3.45455 4.41309C3.75149 3.93703 4.17597 3.55379 4.67979 3.30687C5.1836 3.05996 5.74657 2.95929 6.30473 3.01628C6.8629 3.07327 7.3939 3.28565 7.83742 3.62929C8.28094 3.97293 8.6192 4.43406 8.81379 4.9603C9.00838 5.48654 9.0515 6.05681 8.93825 6.60633C8.82499 7.15585 8.5599 7.6626 8.17309 8.06901C7.78628 8.47543 7.29325 8.76523 6.75 8.9055V17.25C6.75 17.8467 6.98705 18.419 7.40901 18.841C7.83097 19.2629 8.40326 19.5 9 19.5C9.59674 19.5 10.169 19.2629 10.591 18.841C11.0129 18.419 11.25 17.8467 11.25 17.25V6.75C11.25 5.75544 11.6451 4.80161 12.3483 4.09835C13.0516 3.39509 14.0054 3 15 3C15.9946 3 16.9484 3.39509 17.6517 4.09835C18.3549 4.80161 18.75 5.75544 18.75 6.75V11.25H17.25V6.75C17.25 6.15326 17.0129 5.58097 16.591 5.15901C16.169 4.73705 15.5967 4.5 15 4.5C14.4033 4.5 13.831 4.73705 13.409 5.15901C12.9871 5.58097 12.75 6.15326 12.75 6.75V17.25C12.75 18.2446 12.3549 19.1984 11.6517 19.9016C10.9484 20.6049 9.99456 21 9 21C8.00544 21 7.05161 20.6049 6.34835 19.9016C5.64509 19.1984 5.25 18.2446 5.25 17.25V8.9055C4.60591 8.7392 4.03535 8.36353 3.62806 7.83758C3.22076 7.31163 2.99983 6.66522 3 6ZM15 15.75C15 14.9544 15.3161 14.1913 15.8787 13.6287C16.4413 13.0661 17.2044 12.75 18 12.75C18.7956 12.75 19.5587 13.0661 20.1213 13.6287C20.6839 14.1913 21 14.9544 21 15.75C20.9999 16.6349 20.7865 17.5068 20.3779 18.2917C19.9692 19.0766 19.3774 19.7514 18.6525 20.259L18 20.715L17.3475 20.259C16.6226 19.7514 16.0308 19.0766 15.6221 18.2917C15.2135 17.5068 15.0001 16.6349 15 15.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

const badgesBarChartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    stacked: true,
  },
  colors: ['#3A57E8', '#85F4FA'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      columnWidth: '22%',
      dataLabels: { position: 'top' },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
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

const badgesBarChartSeries = [
  {
    name: 'Jornada Tecnica',
    data: [22, 38, 29, 41, 29, 46, 29, 22, 32, 29, 32, 22],
  },
  {
    name: 'Power Skills',
    data: [19, 33, 26, 35, 26, 40, 26, 19, 28, 26, 28, 19],
  },
]

function MetricIcon({ icon }) {
  if (icon === 'users') {
    return <DashboardUsersIcon />
  }

  if (icon === 'badges') {
    return <DashboardBadgesIcon />
  }

  if (icon === 'service-lines') {
    return <DashboardServiceLinesIcon />
  }

  if (icon === 'areas') {
    return <DashboardAreasIcon />
  }

  if (icon === 'learning-paths') {
    return <DashboardLearningPathsIcon />
  }

  return <DashboardBadgesIcon />
}

function DashboardView() {
  const {
    user,
    metrics,
    chartOptions,
    chartSeries,
    badgesChartByYear,
    badgesChartYearOptions,
    badgesChartMonthOptions,
    badgesChartLearningPathByYear,
    badgesGroupedChartOptions,
    learningPathBadgeLevels,
  } = useDashboardController()
  const [selectedLevel, setSelectedLevel] = useState('Intermédio')
  const [selectedPrimaryYear, setSelectedPrimaryYear] = useState(2025)
  const [selectedGroupedYear, setSelectedGroupedYear] = useState(2025)
  const [selectedMonthStart, setSelectedMonthStart] = useState(null)
  const [selectedMonthEnd, setSelectedMonthEnd] = useState(null)

  const selectedLearningPathLevel = useMemo(
    () =>
      learningPathBadgeLevels.find((level) => level.value === selectedLevel) ?? learningPathBadgeLevels[0],
    [learningPathBadgeLevels, selectedLevel]
  )

  const selectedPrimaryYearData = badgesChartByYear[selectedPrimaryYear] ?? badgesChartByYear[2025]
  const selectedGroupedYearData = badgesChartLearningPathByYear[selectedGroupedYear] ?? badgesChartLearningPathByYear[2025]

  const lastMonthIndex = badgesChartMonthOptions.length - 1
  const rawStartIndex = selectedMonthStart ? badgesChartMonthOptions.indexOf(selectedMonthStart) : 0
  const rawEndIndex = selectedMonthEnd ? badgesChartMonthOptions.indexOf(selectedMonthEnd) : lastMonthIndex
  const normalizedMonthStartIndex = Math.min(rawStartIndex, rawEndIndex)
  const normalizedMonthEndIndex = Math.max(rawStartIndex, rawEndIndex)
  const filteredMonths = badgesChartMonthOptions.slice(normalizedMonthStartIndex, normalizedMonthEndIndex + 1)

  const filteredPrimaryChartSeries = selectedPrimaryYearData.series.map((series) => ({
    ...series,
    data: series.data.slice(normalizedMonthStartIndex, normalizedMonthEndIndex + 1),
  }))

  const filteredPrimaryChartOptions = {
    ...chartOptions,
    xaxis: {
      ...chartOptions.xaxis,
      categories: filteredMonths,
    },
  }

  return (
    <section className="softinsa-dashboard-page">
      <div className="softinsa-dashboard-hero">
        <h1>Olá, {user.name}!</h1>
      </div>

      <div className="softinsa-summary-grid">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <Card className="softinsa-summary-card">
              <Card.Body className="softinsa-summary-card-body">
                <span className="softinsa-summary-icon-shell">
                  <MetricIcon icon={metric.icon} />
                </span>

                <div className="softinsa-summary-content">
                  <p>{metric.label}</p>
                  <h5>{metric.value}</h5>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Card className="softinsa-chart-card mb-4">
        <Card.Header className="softinsa-chart-card-header softinsa-primary-chart-header">
          <h5 className="mb-0">Badges Obtidos</h5>

          <Dropdown className="softinsa-primary-chart-year-dropdown">
            <Dropdown.Toggle
              variant="link"
              id="softinsa-primary-chart-year-dropdown"
              className="softinsa-primary-chart-year-dropdown-toggle"
            >
              {selectedPrimaryYear}
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="softinsa-primary-chart-year-dropdown-menu">
              {badgesChartYearOptions.map((year) => (
                <Dropdown.Item
                  key={year}
                  active={year === selectedPrimaryYear}
                  onClick={() => setSelectedPrimaryYear(year)}
                >
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>

        <Card.Body className="softinsa-primary-chart-body">
          <div className="softinsa-primary-chart-chart-wrap">
            <Chart options={filteredPrimaryChartOptions} series={filteredPrimaryChartSeries} type="area" height={300} />
          </div>

          <div className="softinsa-primary-chart-periods" aria-label="Periodo do gráfico">
            <Dropdown className="softinsa-primary-chart-period-dropdown">
              <Dropdown.Toggle
                variant="link"
                id="softinsa-primary-chart-period-start"
                className={`softinsa-primary-chart-period-box softinsa-primary-chart-period-toggle${
                  selectedMonthStart ? '' : ' softinsa-primary-chart-period-placeholder'
                }`}
              >
                {selectedMonthStart ?? 'Mês Inicial'}
              </Dropdown.Toggle>

              <Dropdown.Menu className="softinsa-primary-chart-period-menu">
                {badgesChartMonthOptions.map((month) => (
                  <Dropdown.Item key={month} active={month === selectedMonthStart} onClick={() => setSelectedMonthStart(month)}>
                    {month}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <div className="softinsa-primary-chart-period-label">até</div>
            <Dropdown className="softinsa-primary-chart-period-dropdown">
              <Dropdown.Toggle
                variant="link"
                id="softinsa-primary-chart-period-end"
                className={`softinsa-primary-chart-period-box softinsa-primary-chart-period-toggle${
                  selectedMonthEnd ? '' : ' softinsa-primary-chart-period-placeholder'
                }`}
              >
                {selectedMonthEnd ?? 'Mês Final'}
              </Dropdown.Toggle>

              <Dropdown.Menu className="softinsa-primary-chart-period-menu">
                {badgesChartMonthOptions.map((month) => (
                  <Dropdown.Item key={month} active={month === selectedMonthEnd} onClick={() => setSelectedMonthEnd(month)}>
                    {month}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col xl={4} lg={5}>
          <Card className="softinsa-chart-card softinsa-learning-path-card h-100">
            <Card.Header className="softinsa-chart-card-header softinsa-learning-path-card-header">
              <div className="softinsa-learning-path-card-title-wrap">
                <h5 className="mb-0">Badges Por Learning Path</h5>

                <Dropdown className="softinsa-learning-path-dropdown">
                  <Dropdown.Toggle
                    variant="link"
                    id="softinsa-learning-path-dropdown"
                    className="softinsa-learning-path-dropdown-toggle"
                  >
                    {selectedLearningPathLevel.label}
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="start" className="softinsa-learning-path-dropdown-menu">
                    {learningPathBadgeLevels.map((level) => (
                      <Dropdown.Item
                        key={level.value}
                        active={level.value === selectedLearningPathLevel.value}
                        onClick={() => setSelectedLevel(level.value)}
                      >
                        {level.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>

            <Card.Body className="softinsa-learning-path-card-body">
              <div className="softinsa-learning-path-chart-wrap">
                <Chart
                  options={learningPathChartOptions}
                  series={selectedLearningPathLevel.chartSeries}
                  type="radialBar"
                  height={250}
                />
              </div>

              <div className="softinsa-learning-path-legend" aria-label="Quantidade por learning path">
                {selectedLearningPathLevel.paths.map((path) => (
                  <div key={path.label} className="softinsa-learning-path-legend-item">
                    <span
                      className="softinsa-learning-path-legend-dot"
                      style={{ backgroundColor: path.color }}
                      aria-hidden="true"
                    />

                    <div className="softinsa-learning-path-legend-content">
                      <p>{path.label}</p>
                      <strong>{path.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8} lg={7}>
          <Card className="softinsa-chart-card h-100">
            <Card.Header className="softinsa-chart-card-header softinsa-badges-card-header">
              <h5 className="mb-0">Badges Obtidos (%)</h5>

              <Dropdown className="softinsa-badges-dropdown">
                <Dropdown.Toggle
                  variant="link"
                  id="softinsa-badges-year-dropdown"
                  className="softinsa-badges-dropdown-toggle"
                >
                  {selectedGroupedYear}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="softinsa-badges-dropdown-menu">
                  {badgesChartYearOptions.map((year) => (
                    <Dropdown.Item
                      key={year}
                      active={year === selectedGroupedYear}
                      onClick={() => setSelectedGroupedYear(year)}
                    >
                      {year}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>

            <Card.Body>
              <Chart options={badgesGroupedChartOptions} series={selectedGroupedYearData} type="bar" height={250} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default DashboardView
