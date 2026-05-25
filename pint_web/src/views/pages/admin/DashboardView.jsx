import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { Card, Col, Dropdown, Row } from 'react-bootstrap'
import {
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
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
    return <HiOutlineUserGroup className="softinsa-summary-icon" />
  }

  if (icon === 'service-lines') {
    return <MdOutlineMiscellaneousServices className="softinsa-summary-icon" />
  }

  if (icon === 'areas') {
    return <HiOutlineViewGrid className="softinsa-summary-icon" />
  }

  if (icon === 'learning-paths') {
    return <HiOutlineAcademicCap className="softinsa-summary-icon" />
  }

  return <HiOutlineBadgeCheck className="softinsa-summary-icon" />
}

function DashboardView() {
  const {
    user,
    metrics,
    chartOptions,
    chartSeries,
    badgesChartByYear,
    badgesChartYearOptions,
    learningPathBadgeLevels,
  } = useDashboardController()
  const [selectedLevel, setSelectedLevel] = useState('Intermédio')
  const [selectedBadgeYear, setSelectedBadgeYear] = useState(2025)

  const selectedLearningPathLevel = useMemo(
    () =>
      learningPathBadgeLevels.find((level) => level.value === selectedLevel) ?? learningPathBadgeLevels[0],
    [learningPathBadgeLevels, selectedLevel]
  )

  const selectedBadgeYearData = badgesChartByYear[selectedBadgeYear] ?? badgesChartByYear[2025]

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
        <Card.Header className="softinsa-chart-card-header">
          <h5 className="mb-0">Badges obtidos</h5>
        </Card.Header>

        <Card.Body className="pt-2">
          <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
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
              <h5 className="mb-0">Badges</h5>

              <Dropdown className="softinsa-badges-dropdown">
                <Dropdown.Toggle
                  variant="link"
                  id="softinsa-badges-year-dropdown"
                  className="softinsa-badges-dropdown-toggle"
                >
                  {selectedBadgeYear}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="softinsa-badges-dropdown-menu">
                  {badgesChartYearOptions.map((year) => (
                    <Dropdown.Item
                      key={year}
                      active={year === selectedBadgeYear}
                      onClick={() => setSelectedBadgeYear(year)}
                    >
                      {year}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>

            <Card.Body>
              <Chart options={badgesBarChartOptions} series={selectedBadgeYearData.series} type="bar" height={250} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default DashboardView
