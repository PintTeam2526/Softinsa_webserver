import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import { Row, Col } from 'react-bootstrap'
import './consultor-DashboardView.css'

import { getDashboardConsultor } from '../../../controllers/dashboard.controller'


const STATUS_MAP = {
  'Expirado': { Icon: HiOutlineCalendarDays, statusClass: 'is-expired' },
  'Devolvido': { Icon: HiOutlineDocumentText, statusClass: 'is-returned' },
  'Em Análise': { Icon: HiOutlineClock, statusClass: 'is-analysis' },
  'Aceite': { Icon: HiOutlineCheckCircle, statusClass: 'is-accepted' },
  'Recusado': { Icon: HiOutlineXCircle, statusClass: 'is-refused' },
}


function IconAlertBell({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <path d="M29.6543 17.468C28.5585 16.1884 28.0606 15.0796 28.0606 13.1957V12.5552C28.0606 10.1003 27.4956 8.5186 26.2672 6.93689C24.3739 4.48049 21.1866 3 18.0663 3H17.9337C14.879 3 11.7916 4.41251 9.86549 6.7692C8.56999 8.38263 7.93939 10.0323 7.93939 12.5552V13.1957C7.93939 15.0796 7.47426 16.1884 6.34573 17.468C5.51536 18.4107 5.25 19.6223 5.25 20.9336C5.25 22.2464 5.68084 23.4897 6.5455 24.5003C7.67403 25.7119 9.26768 26.4854 10.8956 26.6198C13.2526 26.8887 15.6095 26.99 18.0007 26.99C20.3905 26.99 22.7474 26.8208 25.1059 26.6198C26.7323 26.4854 28.326 25.7119 29.4545 24.5003C30.3177 23.4897 30.75 22.2464 30.75 20.9336C30.75 19.6223 30.4846 18.4107 29.6543 17.468Z" fill="currentColor" />
      <path opacity="0.4" d="M21.013 28.8425C20.2631 28.6824 15.6939 28.6824 14.944 28.8425C14.303 28.9906 13.6097 29.335 13.6097 30.0904C13.647 30.811 14.0689 31.447 14.6533 31.8503L14.6518 31.8518C15.4076 32.441 16.2947 32.8157 17.2234 32.9501C17.7184 33.0181 18.2223 33.0151 18.7351 32.9501C19.6624 32.8157 20.5494 32.441 21.3052 31.8518L21.3037 31.8503C21.8881 31.447 22.31 30.811 22.3473 30.0904C22.3473 29.335 21.6541 28.9906 21.013 28.8425Z" fill="currentColor" />
    </svg>
  )
}

function IconAlertTarget({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <g clipPath="url(#consultor-alert-target-clip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M29.3332 0.128222C29.6416 0.255954 29.9052 0.472274 30.0906 0.749822C30.2761 1.02737 30.375 1.35368 30.375 1.68747V5.62497H34.3125C34.646 5.62527 34.972 5.72439 35.2492 5.90984C35.5265 6.09528 35.7425 6.35873 35.8701 6.66689C35.9977 6.97506 36.0311 7.31413 35.9661 7.64128C35.9012 7.96843 35.7407 8.26898 35.505 8.50497L28.755 15.255C28.4388 15.5715 28.0099 15.7496 27.5625 15.75H26.7142C27.161 17.4808 27.0823 19.3054 26.4881 20.9913C25.8939 22.6771 24.8112 24.1479 23.3779 25.216C21.9446 26.2842 20.2257 26.9013 18.4404 26.9888C16.655 27.0763 14.884 26.6301 13.3532 25.7072C11.8223 24.7843 10.601 23.4264 9.84482 21.8067C9.08866 20.187 8.83195 18.3788 9.10741 16.6127C9.38287 14.8465 10.178 13.2024 11.3915 11.8898C12.605 10.5773 14.1818 9.65588 15.921 9.24297C16.3566 9.13944 16.8155 9.21319 17.1967 9.44801C17.578 9.68283 17.8503 10.0595 17.9538 10.4951C18.0574 10.9307 17.9836 11.3896 17.7488 11.7709C17.514 12.1521 17.1373 12.4244 16.7017 12.528C15.5773 12.7942 14.5622 13.4003 13.7943 14.2638C13.0265 15.1273 12.5432 16.2063 12.4102 17.3541C12.2772 18.502 12.5009 19.6629 13.0509 20.6791C13.6009 21.6953 14.4506 22.5175 15.4843 23.0338C16.5181 23.5502 17.6857 23.7356 18.8286 23.5649C19.9714 23.3943 21.034 22.8758 21.8718 22.08C22.7096 21.2842 23.2819 20.2497 23.5111 19.1171C23.7402 17.9845 23.615 16.8089 23.1525 15.75H22.635L19.1925 19.1925C19.038 19.3583 18.8517 19.4912 18.6447 19.5835C18.4377 19.6757 18.2142 19.7253 17.9876 19.7293C17.7611 19.7333 17.536 19.6916 17.3259 19.6067C17.1158 19.5219 16.9249 19.3955 16.7646 19.2353C16.6044 19.0751 16.4781 18.8842 16.3932 18.6741C16.3083 18.4639 16.2666 18.2389 16.2706 18.0123C16.2746 17.7857 16.3242 17.5623 16.4165 17.3553C16.5087 17.1483 16.6417 16.962 16.8075 16.8075L20.25 13.365V8.43747C20.2504 7.99007 20.4284 7.56114 20.745 7.24497L27.495 0.494972C27.7308 0.258966 28.0313 0.0981634 28.3585 0.0328855C28.6857 -0.0323925 29.0249 0.000783834 29.3332 0.128222ZM23.625 9.13722V12.375H26.865L30.24 8.99997H27V5.75997L23.625 9.13722ZM10.845 5.24247C13.4803 3.76424 16.5088 3.13857 19.5142 3.45147C19.7346 3.47437 19.9574 3.45363 20.1698 3.39043C20.3822 3.32724 20.5801 3.22282 20.7522 3.08315C20.9242 2.94348 21.0671 2.77129 21.1726 2.57641C21.2781 2.38153 21.3442 2.16777 21.3671 1.94735C21.39 1.72692 21.3693 1.50415 21.3061 1.29174C21.2429 1.07933 21.1385 0.88145 20.9988 0.709395C20.8591 0.53734 20.6869 0.394479 20.492 0.28897C20.2972 0.183462 20.0834 0.117371 19.863 0.0944718C16.1637 -0.290438 12.436 0.480026 9.19239 2.29993C5.94881 4.11984 3.34861 6.89982 1.74929 10.2577C0.149976 13.6155 -0.36992 17.3863 0.261084 21.0517C0.892089 24.717 2.64301 28.0969 5.27311 30.7266C7.90321 33.3564 11.2833 35.1068 14.9488 35.7373C18.6142 36.3678 22.385 35.8474 25.7426 34.2476C29.1002 32.6478 31.8798 30.0472 33.6993 26.8034C35.5187 23.5595 36.2887 19.8317 35.9032 16.1325C35.8803 15.912 35.8142 15.6983 35.7087 15.5034C35.6032 15.3085 35.4604 15.1363 35.2883 14.9967C35.1162 14.857 34.9184 14.7526 34.706 14.6894C34.4935 14.6262 34.2708 14.6054 34.0503 14.6283C33.8299 14.6512 33.6162 14.7173 33.4213 14.8228C33.2264 14.9284 33.0542 15.0712 32.9145 15.2433C32.7749 15.4153 32.6705 15.6132 32.6073 15.8256C32.5441 16.038 32.5233 16.2608 32.5462 16.4812C32.8203 19.1064 32.3788 21.7568 31.2686 24.1513C30.1585 26.5459 28.4209 28.5954 26.2403 30.0825C24.0597 31.5696 21.5174 32.4389 18.8827 32.5982C16.2481 32.7574 13.6195 32.2007 11.2757 30.9871C8.93183 29.7735 6.96009 27.9482 5.56954 25.7048C4.17899 23.4614 3.42148 20.8835 3.37732 18.2445C3.33317 15.6054 4.00402 13.0036 5.31873 10.715C6.63345 8.42628 8.54303 6.53606 10.845 5.24472V5.24247Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="consultor-alert-target-clip">
          <rect width="36" height="36" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function IconAlertSparkle({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <path d="M12.255 4.14C14.0776 3.38992 16.0291 3.00269 18 3C19.965 3 21.915 3.39 23.745 4.14C25.56 4.89 27.21 6 28.605 7.395C30 8.79 31.11 10.44 31.86 12.255C32.61 14.085 33 16.035 33 18C33 21.975 31.425 25.8 28.605 28.605C27.2139 30 25.5609 31.1064 23.741 31.8606C21.9211 32.6148 19.97 33.002 18 33C16.0291 32.9973 14.0776 32.6101 12.255 31.86C10.4371 31.1044 8.78571 29.9984 7.39501 28.605C6.00004 27.2139 4.89366 25.5609 4.13943 23.741C3.38519 21.9211 2.99797 19.97 3.00001 18C3.00001 14.025 4.57501 10.2 7.39501 7.395C8.79001 6 10.44 4.89 12.255 4.14ZM18 25.5L20.34 20.37L25.5 18L20.34 15.66L18 10.5L15.645 15.66L10.5 18L15.645 20.37L18 25.5Z" fill="currentColor" />
    </svg>
  )
}

function openTopbarNotifications() {
  window.dispatchEvent(new CustomEvent('consultor:open-notifications'))
}

function DonutChart({ percent }) {
  const centerX = 35
  const centerY = 36
  const radius = 34

  // Calcular as coordenadas do arco baseado na percentagem
  const angle = (percent / 100) * 360 - 90 // Começar no topo
  const radians = (angle * Math.PI) / 180
  const endX = centerX + radius * Math.cos(radians)
  const endY = centerY + radius * Math.sin(radians)
  const largeArcFlag = percent > 50 ? 1 : 0

  const arcPath = `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 71 72"
      fill="none"
      className="consultor-dashboard-summary-donut"
      role="img"
      aria-label={`${percent}% completo`}
    >
      <circle cx="35" cy="36" r="34" stroke="#E9ECEF" strokeWidth="2" />
      <path
        d={arcPath}
        stroke="#00B8E0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M26.1904 44.284C25.8209 44.6944 25.854 45.3267 26.2645 45.6963C26.6749 46.0658 27.3072 46.0327 27.6767 45.6223L26.9336 44.9531L26.1904 44.284ZM43.7763 27.3042C43.7474 26.7527 43.2768 26.329 42.7253 26.3579L33.7376 26.8289C33.1861 26.8578 32.7624 27.3284 32.7913 27.8799C32.8202 28.4314 33.2908 28.8551 33.8423 28.8262L41.8313 28.4075L42.25 36.3965C42.2789 36.9481 42.7495 37.3717 43.301 37.3428C43.8525 37.3139 44.2762 36.8434 44.2473 36.2919L43.7763 27.3042ZM26.9336 44.9531L27.6767 45.6223L43.5208 28.0257L42.7776 27.3565L42.0345 26.6874L26.1904 44.284L26.9336 44.9531Z"
        fill="#ADB5BD"
      />
    </svg>
  )
}

function AlertCard({ type, Icon, title, subtitle, subtitleHighlight, value, onClick }) {
  const isInteractive = typeof onClick === 'function'

  function handleKeyDown(event) {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <article
      className={`consultor-dashboard-metric ${type}${isInteractive ? ' is-clickable' : ''}`}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
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

function BadgeRow({ badge, isLarge = false, onClick, navigate: propNavigate = null }) {
  const StatusIcon = badge.Icon
  const defaultNavigate = propNavigate || (() => {})
  const handleClick = isLarge ? () => defaultNavigate('/consultor/badges/pedidos') : onClick
  const isInteractive = typeof handleClick === 'function'

  function handleKeyDown(event) {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={`consultor-dashboard-badge-row${isLarge ? ' is-my-badge' : ''}${isInteractive ? ' is-clickable' : ''}`}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
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

function resolveImagem(imagem_badge) {
  if (!imagem_badge) return null
  if (imagem_badge.startsWith('data:')) return imagem_badge
  return `data:image/png;base64,${imagem_badge}`
}


function DashboardView() {
  const navigate = useNavigate()

  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getDashboardConsultor()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="consultor-dashboard-loading">A carregar...</p>
  if (erro) return <p className="consultor-dashboard-error">{erro}</p>

  const metricCards = [
    { title: 'Área', percent: Math.round(dados.progresso_area), widthClass: 'is-area' },
    { title: 'Service Line', percent: Math.round(dados.progresso_service_line), widthClass: 'is-service-line' },
    { title: 'Learning Path', percent: Math.round(dados.progresso_learning_path), widthClass: 'is-learning-path' },
  ]

  const diasLabel = dados.dias_proximo_objetivo < 0
    ? `Expirado há ${Math.abs(dados.dias_proximo_objetivo)} dias`
    : `${dados.dias_proximo_objetivo} ${dados.dias_proximo_objetivo === 1 ? 'dia' : 'dias'}`

  const alertCards = [
    {
      type: 'is-message',
      Icon: IconAlertBell,
      title: 'Tem mensagens por ler',
      subtitle: 'Acede agora às notificações, para ver mais',
      onClick: openTopbarNotifications,
    },
    {
      type: 'is-objective',
      Icon: IconAlertTarget,
      title: 'Objetivos Por Completar',
      subtitleHighlight: diasLabel,
      subtitle: dados.dias_proximo_objetivo < 0 ? '' : 'até o próximo objetivo expirar',
      onClick: () => navigate('/consultor/badges/objetivos'),
    },
    {
      type: 'is-points',
      Icon: IconAlertSparkle,
      title: 'Pontuação total',
      subtitle: 'Não pares por aqui, candidata-te a mais badges',
      value: String(dados.pontos_consultor),
    },
  ]

  const myBadges = (dados.pedidos_badge ?? []).map(pedido => ({
    image: resolveImagem(pedido.imagem_badge),
    name: pedido.nome_badge,
    status: pedido.estado_atual,
    ...(STATUS_MAP[pedido.estado_atual] ?? { Icon: null, statusClass: '' }),
  }))

  return (
    <section className="consultor-dashboard-page">
      <header className="consultor-dashboard-hero">
        <div className="consultor-dashboard-hero-copy">
          <h1>Olá, {dados.nome_consultor}!</h1>
          <p>Estamos aqui para te ajudar a melhorar o currículo</p>
        </div>
      </header>

      <Row as="section" className="g-4 justify-content-center mb-4" aria-label="Métricas">
        {metricCards.map((metric) => (
          <Col xs={12} sm={6} lg={4} key={metric.title}>
            <article className={`consultor-dashboard-summary-card w-100 ${metric.widthClass}`}>
              <div className="consultor-dashboard-summary-copy">
                <h2>{metric.title}</h2>
                <p>{metric.percent}%</p>
              </div>
              <DonutChart percent={metric.percent} />
            </article>
          </Col>
        ))}
      </Row>

      <section className="consultor-dashboard-alerts" aria-label="Alertas">
        {alertCards.map((alert) => (
          <AlertCard key={alert.type} {...alert} />
        ))}
      </section>

      <Row as="section" className="justify-content-center mb-5" aria-label="Badges">
        <Col xs={12} xl={8}>
          <article className="consultor-dashboard-card consultor-dashboard-card--my-badges">
            <div className="consultor-dashboard-card-header">
              <h2>Os meus badges</h2>
            </div>

            <div className="consultor-dashboard-card-body consultor-dashboard-card-body--my-badges">
              {myBadges.map((badge, i) => (
                <BadgeRow key={i} badge={badge} isLarge navigate={navigate} />
              ))}
            </div>
          </article>
        </Col>
      </Row>
    </section>
  )
}

export default DashboardView
