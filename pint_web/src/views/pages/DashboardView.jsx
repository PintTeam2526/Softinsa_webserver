import Chart from 'react-apexcharts'
import { Card, Col, Row } from 'react-bootstrap'
import {
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { useDashboardController } from '../../controllers/dashboard.controller'
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

const learningPathChartSeries = [82, 66]

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
  const { user, metrics, chartOptions, chartSeries } = useDashboardController()

  return (
    <section className="softinsa-dashboard-page">
      <div className="softinsa-dashboard-hero">
        <h1>Ola, {user.name}!</h1>
      </div>

      <Row className="g-3 mb-4">
        {metrics.map((metric) => (
          <Col key={metric.label} xxl={2} xl={3} md={4} sm={6}>
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
          </Col>
        ))}
      </Row>

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
          <Card className="softinsa-chart-card h-100">
            <Card.Header className="softinsa-chart-card-header">
              <h5 className="mb-0">Badges por Learning Path</h5>
            </Card.Header>

            <Card.Body>
              <Chart
                options={learningPathChartOptions}
                series={learningPathChartSeries}
                type="radialBar"
                height={250}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8} lg={7}>
          <Card className="softinsa-chart-card h-100">
            <Card.Header className="softinsa-chart-card-header">
              <h5 className="mb-0">Badges</h5>
            </Card.Header>

            <Card.Body>
              <Chart options={badgesBarChartOptions} series={badgesBarChartSeries} type="bar" height={250} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default DashboardView
