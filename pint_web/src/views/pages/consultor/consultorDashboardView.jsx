import {
  HiOutlineArrowPath,
  HiOutlineBell,
  HiOutlineFlag,
  HiOutlineTrophy,
  HiOutlineCalendarDays,
  HiOutlineArrowUturnLeft,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import './consultor-DashboardView.css'
import avtar1 from '../../../assets/images/avatars/avtar_1.png'
import avtar2 from '../../../assets/images/avatars/avtar_2.png'
import avtar3 from '../../../assets/images/avatars/avtar_3.png'
import avtar4 from '../../../assets/images/avatars/avtar_4.png'
import avtar5 from '../../../assets/images/avatars/avtar_5.png'


const metricCards = [
  { title: 'Área', value: '50%', widthClass: 'is-area' },
  { title: 'Service Line', value: '40%', widthClass: 'is-service-line' },
  { title: 'Learning Path', value: '25%', widthClass: 'is-learning-path' },
]

const alertCards = [
  {
    type: 'is-message',
    Icon: HiOutlineBell,
    title: 'Tem mensagens por ler',
    subtitle: 'Acede agora às notificações, para ver mais',
  },
  {
    type: 'is-objective',
    Icon: HiOutlineFlag,
    title: 'Objetivo Por Completar',
    subtitleHighlight: '3 dias',
    subtitle: 'até o próximo objetivo expirar',
  },
  {
    type: 'is-points',
    Icon: HiOutlineTrophy,
    title: 'Pontuação total',
    subtitle: 'Não pares por aqui, candidata-te a mais badges',
    value: '550',
  },
]

const recommendedBadges = [
  { image: avtar1, name: 'Citizen Developer', subtitle: 'LowCode(Outsystems)' },
  { image: avtar2, name: 'Team Lider Beginner', subtitle: 'Talent Management' },
  { image: avtar3, name: 'DevOps Intermediate', subtitle: 'DevOps' },
  { image: avtar4, name: 'DevOps Intermediate', subtitle: 'DevOps' },
]

const myBadges = [
  {
    image: avtar1,
    name: 'Citizen Developer',
    status: 'Expirado',
    Icon: HiOutlineCalendarDays,
    statusClass: 'is-expired',
  },
  {
    image: avtar2,
    name: 'Team Lider Beginner',
    status: 'Devolvido',
    Icon: HiOutlineArrowUturnLeft,
    statusClass: 'is-returned',
  },
  {
    image: avtar3,
    name: 'DevOps Intermediate',
    status: 'Em Análise',
    Icon: HiOutlineInformationCircle,
    statusClass: 'is-analysis',
  },
  {
    image: avtar4,
    name: 'DevOps Intermediate',
    status: 'Aceite',
    Icon: HiOutlineCheckCircle,
    statusClass: 'is-accepted',
  },
  {
    image: avtar5,
    name: 'DevOps Intermediate',
    status: 'Recusado',
    Icon: HiOutlineXCircle,
    statusClass: 'is-refused',
  },
]

function AlertCard({ type, Icon, title, subtitle, subtitleHighlight, value }) {
  return (
    <article className={`consultor-dashboard-metric ${type}`}>
      <div className="consultor-dashboard-metric-icon-tile">
        <Icon className="consultor-dashboard-metric-icon" aria-hidden="true" />
      </div>

      <div className="consultor-dashboard-metric-copy">
        <h3>{title}</h3>
        <p>
          {subtitleHighlight && (
            <span className="consultor-dashboard-metric-highlight">{subtitleHighlight} </span>
          )}
          {subtitle}
        </p>
      </div>

      {value ? (
        <strong className="consultor-dashboard-metric-value">{value}</strong>
      ) : (
        <HiOutlineChevronRight className="consultor-dashboard-metric-chevron" aria-hidden="true" />
      )}
    </article>
  )
}

function BadgeRow({ badge, isLarge = false }) {
  const StatusIcon = badge.Icon

  return (
    <div className={`consultor-dashboard-badge-row${isLarge ? ' is-my-badge' : ''}`}>
      <img
        src={badge.image}
        alt={badge.name}
        className={`consultor-dashboard-badge-image${isLarge ? ' consultor-dashboard-badge-image--large' : ''}`}
      />

      <div className={`consultor-dashboard-badge-copy${isLarge ? ' consultor-dashboard-badge-copy--my-badge' : ''}`}>
        <h4>{badge.name}</h4>
        {isLarge ? (
          <p className={`consultor-dashboard-badge-status ${badge.statusClass}`}>
            {badge.status}
            {StatusIcon && <StatusIcon className="consultor-dashboard-badge-status-icon" aria-hidden="true" />}
          </p>
        ) : (
          <p>{badge.subtitle}</p>
        )}
      </div>

      {!isLarge && (
        <HiOutlineChevronRight className="consultor-dashboard-badge-action" aria-hidden="true" />
      )}
    </div>
  )
}

function DashboardView() {
  return (
    <section className="consultor-dashboard-page">
      <header className="consultor-dashboard-hero">
        <div className="consultor-dashboard-hero-art" aria-hidden="true">
          <div className="consultor-dashboard-hero-circle consultor-dashboard-hero-circle-5" />
          <div className="consultor-dashboard-hero-circle consultor-dashboard-hero-circle-4" />
          <div className="consultor-dashboard-hero-circle consultor-dashboard-hero-circle-3" />
          <div className="consultor-dashboard-hero-circle consultor-dashboard-hero-circle-2" />
          <div className="consultor-dashboard-hero-circle consultor-dashboard-hero-circle-1" />
        </div>

        <div className="consultor-dashboard-hero-copy">
          <h1>Olá, António Portugal!</h1>
          <p>Estamos aqui para te ajudar a melhorar o currículo</p>
        </div>
      </header>

      <section className="consultor-dashboard-summary" aria-label="Métricas">
        {metricCards.map((metric) => (
          <article key={metric.title} className={`consultor-dashboard-summary-card ${metric.widthClass}`}>
            <div className="consultor-dashboard-summary-copy">
              <h2>{metric.title}</h2>
              <p>{metric.value}</p>
            </div>
            <HiOutlineArrowPath className="consultor-dashboard-summary-icon" aria-hidden="true" />
          </article>
        ))}
      </section>

      <section className="consultor-dashboard-alerts" aria-label="Alertas">
        {alertCards.map((alert) => (
          <AlertCard key={alert.type} {...alert} />
        ))}
      </section>

      <section className="consultor-dashboard-bottom-grid" aria-label="Badges">
        <article className="consultor-dashboard-card">
          <header className="consultor-dashboard-card-header">
            <h2>Badges Recomendados</h2>
          </header>

          <div className="consultor-dashboard-card-body">
            {recommendedBadges.map((badge, i) => (
              <BadgeRow key={i} badge={badge} />
            ))}
          </div>
        </article>

        <article className="consultor-dashboard-card consultor-dashboard-card--my-badges">
          <header className="consultor-dashboard-card-header consultor-dashboard-card-header--with-action">
            <h2>Os meus badges</h2>
            <HiOutlineChevronRight className="consultor-dashboard-card-chevron" aria-hidden="true" />
          </header>

          <div className="consultor-dashboard-card-body consultor-dashboard-card-body--my-badges">
            {myBadges.map((badge, i) => (
              <BadgeRow key={i} badge={badge} isLarge />
            ))}
          </div>
        </article>
      </section>
    </section>
  )
}

export default DashboardView
