import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getDashboardTM } from '../../../controllers/dashboard.controller'


function IconBadgeExpiryDate() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <g clipPath="url(#clip0_5003_3729)">
        <path d="M15.75 8.72754C16.1016 8.96777 16.415 9.24023 16.6904 9.54492C16.9658 9.84961 17.2031 10.1836 17.4023 10.5469C17.6016 10.9102 17.748 11.2939 17.8418 11.6982C17.9355 12.1025 17.9883 12.5156 18 12.9375C18 13.6348 17.8682 14.291 17.6045 14.9062C17.3408 15.5215 16.9775 16.0576 16.5146 16.5146C16.0518 16.9717 15.5156 17.332 14.9062 17.5957C14.2969 17.8594 13.6406 17.9941 12.9375 18C12.4043 18 11.8887 17.9209 11.3906 17.7627C10.8926 17.6045 10.4355 17.376 10.0195 17.0771C9.60352 16.7783 9.23438 16.4209 8.91211 16.0049C8.58984 15.5889 8.34082 15.1289 8.16504 14.625H1.125V1.125H3.375V0H4.5V1.125H12.375V0H13.5V1.125H15.75V8.72754ZM2.25 2.25V4.5H14.625V2.25H13.5V3.375H12.375V2.25H4.5V3.375H3.375V2.25H2.25ZM7.90137 13.5C7.88379 13.3184 7.875 13.1309 7.875 12.9375C7.875 12.4336 7.94531 11.9443 8.08594 11.4697C8.22656 10.9951 8.44043 10.5469 8.72754 10.125H7.875V9H9V9.75586C9.24023 9.45703 9.50684 9.19336 9.7998 8.96484C10.0928 8.73633 10.4092 8.54004 10.749 8.37598C11.0889 8.21191 11.4434 8.08887 11.8125 8.00684C12.1816 7.9248 12.5566 7.88086 12.9375 7.875C13.5234 7.875 14.0859 7.97168 14.625 8.16504V5.625H2.25V13.5H7.90137ZM12.9375 16.875C13.4824 16.875 13.9922 16.7725 14.4668 16.5674C14.9414 16.3623 15.3574 16.0811 15.7148 15.7236C16.0723 15.3662 16.3535 14.9502 16.5586 14.4756C16.7637 14.001 16.8691 13.4883 16.875 12.9375C16.875 12.3926 16.7725 11.8828 16.5674 11.4082C16.3623 10.9336 16.0811 10.5176 15.7236 10.1602C15.3662 9.80273 14.9502 9.52148 14.4756 9.31641C14.001 9.11133 13.4883 9.00586 12.9375 9C12.3926 9 11.8828 9.10254 11.4082 9.30762C10.9336 9.5127 10.5176 9.79395 10.1602 10.1514C9.80273 10.5088 9.52148 10.9248 9.31641 11.3994C9.11133 11.874 9.00586 12.3867 9 12.9375C9 13.4824 9.10254 13.9922 9.30762 14.4668C9.5127 14.9414 9.79395 15.3574 10.1514 15.7148C10.5088 16.0723 10.9248 16.3535 11.3994 16.5586C11.874 16.7637 12.3867 16.8691 12.9375 16.875ZM13.5 12.375H15.1875V13.5H12.375V10.125H13.5V12.375ZM3.375 9H4.5V10.125H3.375V9ZM5.625 9H6.75V10.125H5.625V9ZM5.625 6.75H6.75V7.875H5.625V6.75ZM3.375 11.25H4.5V12.375H3.375V11.25ZM5.625 11.25H6.75V12.375H5.625V11.25ZM9 7.875H7.875V6.75H9V7.875ZM11.25 7.875H10.125V6.75H11.25V7.875ZM13.5 7.875H12.375V6.75H13.5V7.875Z" fill="#8A92A6" />
      </g>
      <defs>
        <clipPath id="clip0_5003_3729">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function IconAlertBell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M29.6543 17.468C28.5585 16.1884 28.0606 15.0796 28.0606 13.1957V12.5552C28.0606 10.1003 27.4956 8.5186 26.2672 6.93689C24.3739 4.48049 21.1866 3 18.0663 3H17.9337C14.879 3 11.7916 4.41251 9.86549 6.7692C8.56999 8.38263 7.93939 10.0323 7.93939 12.5552V13.1957C7.93939 15.0796 7.47426 16.1884 6.34573 17.468C5.51536 18.4107 5.25 19.6223 5.25 20.9336C5.25 22.2464 5.68084 23.4897 6.5455 24.5003C7.67403 25.7119 9.26768 26.4854 10.8956 26.6198C13.2526 26.8887 15.6095 26.99 18.0007 26.99C20.3905 26.99 22.7474 26.8208 25.1059 26.6198C26.7323 26.4854 28.326 25.7119 29.4545 24.5003C30.3177 23.4897 30.75 22.2464 30.75 20.9336C30.75 19.6223 30.4846 18.4107 29.6543 17.468Z" fill="currentColor" />
      <path opacity="0.4" d="M21.013 28.8425C20.2632 28.6824 15.6939 28.6824 14.944 28.8425C14.303 28.9906 13.6098 29.335 13.6098 30.0904C13.647 30.811 14.0689 31.447 14.6533 31.8504L14.6518 31.8519C15.4077 32.441 16.2947 32.8157 17.2235 32.9501C17.7184 33.0181 18.2223 33.0151 18.7351 32.9501C19.6624 32.8157 20.5494 32.441 21.3052 31.8519L21.3038 31.8504C21.8881 31.447 22.31 30.811 22.3473 30.0904C22.3473 29.335 21.6541 28.9906 21.013 28.8425Z" fill="currentColor" />
    </svg>
  )
}

function IconDeadlineCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <g clipPath="url(#tm-deadline-calendar-clip)">
        <path
          d="M15.4853 8.72754C15.8576 8.96777 16.1894 9.24023 16.481 9.54492C16.7726 9.84961 17.0239 10.1836 17.2348 10.5469C17.4458 10.9102 17.6008 11.2939 17.7001 11.6982C17.7994 12.1025 17.8553 12.5156 17.8676 12.9375C17.8676 13.6348 17.7281 14.291 17.4489 14.9062C17.1697 15.5215 16.785 16.0576 16.2949 16.5146C15.8048 16.9717 15.2371 17.332 14.5919 17.5957C13.9467 17.8594 13.2518 17.9941 12.5074 18C11.9428 18 11.3969 17.9209 10.8695 17.7627C10.3422 17.6045 9.85818 17.376 9.41771 17.0771C8.97726 16.7783 8.5864 16.4209 8.24518 16.0049C7.90395 15.5889 7.64028 15.1289 7.45416 14.625H0V1.125H2.38235V0H3.57353V1.125H11.9118V0H13.1029V1.125H15.4853V8.72754ZM1.19118 2.25V4.5H14.2941V2.25H13.1029V3.375H11.9118V2.25H3.57353V3.375H2.38235V2.25H1.19118ZM7.17498 13.5C7.15637 13.3184 7.14706 13.1309 7.14706 12.9375C7.14706 12.4336 7.22151 11.9443 7.37041 11.4697C7.5193 10.9951 7.74575 10.5469 8.04975 10.125H7.14706V9H8.33824V9.75586C8.5926 9.45703 8.87489 9.19336 9.18508 8.96484C9.49532 8.73633 9.83033 8.54004 10.1901 8.37598C10.55 8.21191 10.9254 8.08887 11.3162 8.00684C11.707 7.9248 12.104 7.88086 12.5074 7.875C13.1277 7.875 13.7233 7.97168 14.2941 8.16504V5.625H1.19118V13.5H7.17498ZM12.5074 16.875C13.0843 16.875 13.6241 16.7725 14.1266 16.5674C14.6291 16.3623 15.0696 16.0811 15.448 15.7236C15.8266 15.3662 16.1243 14.9502 16.3415 14.4756C16.5586 14.001 16.6702 13.4883 16.6765 12.9375C16.6765 12.3926 16.5679 11.8828 16.3508 11.4082C16.1336 10.9336 15.8359 10.5176 15.4573 10.1602C15.0789 9.80273 14.6384 9.52148 14.1359 9.31641C13.6334 9.11133 13.0906 9.00586 12.5074 9C11.9304 9 11.3906 9.10254 10.8881 9.30762C10.3856 9.5127 9.94511 9.79395 9.56668 10.1514C9.18819 10.5088 8.89039 10.9248 8.67326 11.3994C8.45611 11.874 8.34444 12.3867 8.33824 12.9375C8.33824 13.4824 8.44681 13.9922 8.66395 14.4668C8.88109 14.9414 9.17889 15.3574 9.55736 15.7148C9.93579 16.0723 10.3763 16.3535 10.8788 16.5586C11.3813 16.7637 11.9242 16.8691 12.5074 16.875ZM13.1029 12.375H14.8897V13.5H11.9118V10.125H13.1029V12.375ZM2.38235 9H3.57353V10.125H2.38235V9ZM4.76471 9H5.95588V10.125H4.76471V9ZM4.76471 6.75H5.95588V7.875H4.76471V6.75ZM2.38235 11.25H3.57353V12.375H2.38235V11.25ZM4.76471 11.25H5.95588V12.375H4.76471V11.25ZM8.33824 7.875H7.14706V6.75H8.33824V7.875ZM10.7206 7.875H9.52941V6.75H10.7206V7.875ZM13.1029 7.875H11.9118V6.75H13.1029V7.875Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="tm-deadline-calendar-clip">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function IconPedidosPendentes() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.25 1.5C5.05109 1.5 4.86032 1.57902 4.71967 1.71967C4.57902 1.86032 4.5 2.05109 4.5 2.25V21.75C4.5 21.9489 4.57902 22.1397 4.71967 22.2803C4.86032 22.421 5.05109 22.5 5.25 22.5H9.75V21H6V3H18V10.5H19.5V2.25C19.5 2.05109 19.421 1.86032 19.2803 1.71967C19.1397 1.57902 18.9489 1.5 18.75 1.5H5.25Z" fill="currentColor" />
      <path opacity="0.4" d="M7.5 7.5H16.5V6H7.5V7.5ZM7.5 10.5H13.5V9H7.5V10.5Z" fill="currentColor" />
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M15.75 12C14.3576 12 13.0223 12.5531 12.0377 13.5377C11.0531 14.5223 10.5 15.8576 10.5 17.25C10.5 18.6424 11.0531 19.9777 12.0377 20.9623C13.0223 21.9469 14.3576 22.5 15.75 22.5C17.1424 22.5 18.4777 21.9469 19.4623 20.9623C20.4469 19.9777 21 18.6424 21 17.25C21 15.8576 20.4469 14.5223 19.4623 13.5377C18.4777 12.5531 17.1424 12 15.75 12ZM15 14.25V17.25C14.9998 17.3486 15.0191 17.4462 15.0567 17.5373C15.0942 17.6284 15.1494 17.7112 15.219 17.781L17.469 20.031L18.531 18.969L16.5 16.9395V14.25H15Z" fill="currentColor" />
    </svg>
  )
}

function PendingCard({ item }) {
  return (
    <article className="tm-pending-card">
      <div className="tm-pending-copy">
        <h3>{item.title}</h3>
        <p>{item.consultant}</p>
        <div className={`tm-pending-deadline${item.tone === 'calm' ? ' is-calm' : ''}`}>
          <IconDeadlineCalendar />
          <span>{item.deadline}</span>
        </div>
      </div>

      <div className="tm-pending-image-wrap" aria-hidden="true">
        <img src={item.image} alt="" />
        <span className="tm-pending-image-ring" />
      </div>
    </article>
  )
}

function BadgeRow({ badge }) {
  return (
    <div className="tm-badge-row">
      <div className="tm-badge-row-left">
        <img src={badge.image} alt="" aria-hidden="true" className="tm-badge-image" />
        <div className="tm-badge-row-copy">
          <strong>{badge.name}</strong>
          <div className="tm-badge-row-meta">
            <IconBadgeExpiryDate />
            <span>{badge.date}</span>
          </div>
        </div>
      </div>

      <div className="tm-badge-row-right">
        <span>{badge.consultant}</span>
        <Link to={`/talent-manager/perfil-publico/${badge.id}`}>
          Ver perfil +
        </Link>
      </div>
    </div>
  )
}

function resolveImagem(imagem_badge) {
  if (!imagem_badge) return null
  if (imagem_badge.startsWith('data:')) return imagem_badge
  return `data:image/png;base64,${imagem_badge}`
}

// Pedidos pendentes baseado nos dias restantes de resposta
function calcularTonePedido(diasRestantes) {
  return diasRestantes <= 5 ? 'urgent' : 'calm'
}

// Badges a expirar baseado nos dias restantes
function calcularToneBadge(diasRestantes) {
  if (diasRestantes <= 7) return 'red'
  if (diasRestantes <= 20) return 'blue'
  return 'green'
}

// Converter dias restantes numa data legível
function diasParaData(diasRestantes) {
  const data = new Date()
  data.setDate(data.getDate() + diasRestantes)
  return data.toLocaleDateString('pt-PT')
}

// Texto do deadline para os pedidos pendentes
function textoDeadline(diasRestantes) {
  if (diasRestantes < 0)
    return `Tempo limite de resposta expirado há ${Math.abs(diasRestantes)} dias`
  if (diasRestantes === 0)
    return 'Tempo limite de resposta termina hoje'
  return `Tempo limite de resposta termina em ${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'}`
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function TMDashboardSkeleton() {
  return (
    <>
      <section className="tm-hero" aria-label="Dashboard Talent Manager">
        <div className="tm-hero-copy">
          <div className="tm-skeleton tm-skeleton-hero-title" />
        </div>
      </section>

      <div className="tm-notification-callout">
        <div className="tm-skeleton tm-skeleton-notif-icon" />
        <div>
          <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-md" />
          <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-sm mt-2" />
        </div>
      </div>

      <section className="tm-dashboard-grid" aria-label="Conteúdo principal">
        <article className="tm-panel tm-pending-panel">
          <div className="tm-panel-header">
            <div className="tm-panel-title-wrap">
              <div className="tm-skeleton tm-skeleton-panel-badge" />
              <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-title" />
            </div>
          </div>

          <div className="tm-pending-list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="tm-pending-item-wrap">
                <article className="tm-pending-card">
                  <div className="tm-pending-copy w-100">
                    <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-md" />
                    <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-sm mt-2" />
                    <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-sm mt-2" />
                  </div>
                  <div className="tm-pending-image-wrap">
                    <div className="tm-skeleton tm-skeleton-circle" />
                  </div>
                </article>
                {i < 2 ? <div className="tm-panel-divider" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </article>

        <article className="tm-panel tm-badges-panel">
          <div className="tm-panel-header tm-badges-header">
            <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-title" />
          </div>

          <div className="tm-badges-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="tm-badge-row">
                <div className="tm-badge-row-left">
                  <div className="tm-skeleton tm-skeleton-badge-image" />
                  <div className="tm-badge-row-copy w-100">
                    <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-md" />
                    <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-sm mt-2" />
                  </div>
                </div>
                <div className="tm-skeleton tm-skeleton-line tm-skeleton-line-sm" />
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}

function TalentManagerDashboardView() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getDashboardTM()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <TMDashboardSkeleton />
  if (erro) return <p className="tm-error">{erro}</p>

  // Mapear pedidos pendentes
  const pendingRequests = (dados.proximos_pedidos ?? []).map(pedido => ({
    title: `${pedido.nome_badge} - ${pedido.nivel_badge}`,
    consultant: pedido.nome_consultor,
    deadline: textoDeadline(pedido.tempo_resposta_dias),
    image: resolveImagem(pedido.imagem_badge),
    tone: calcularTonePedido(pedido.tempo_resposta_dias),
  }))

  // Mapear badges a expirar
  const badgeExpiring = (dados.proximos_badges_expirar ?? []).map(badge => {
    console.log('badge raw:', badge)  // ← add this temporarily
    return {
      id: badge.id_consultor,
      name: badge.nome_badge,
      consultant: badge.nome_consultor,
      date: diasParaData(badge.dias_para_expirar),
      image: resolveImagem(badge.imagem_badge),
      tone: calcularToneBadge(badge.dias_para_expirar),
    }
  })

  return (
    <>
      <section className="tm-hero" aria-label="Dashboard Talent Manager">
        <div className="tm-hero-copy">
          <h1>Olá, {dados.nome_talent_manager}!</h1>
        </div>
      </section>

      <button
        type="button"
        className="tm-notification-callout"
        onClick={() => window.dispatchEvent(new CustomEvent('softinsa:open-notifications'))}
        aria-label="Abrir notificações: tem notificações por ler"
      >
        <div className="tm-notification-icon">
          <IconAlertBell />
        </div>

        <div>
          <h2>Tem notificações por ler</h2>
          <p>Aceda agora às notificações</p>
        </div>
      </button>

      <section className="tm-dashboard-grid" aria-label="Conteúdo principal">
        <article className="tm-panel tm-pending-panel">
          <div className="tm-panel-header">
            <div className="tm-panel-title-wrap">
              <div className="tm-panel-badge">
                <IconPedidosPendentes />
              </div>
              <h2>Pedidos Pendentes</h2>
            </div>

            <Link to="/talent-manager/pedidos" className="tm-panel-link">
              Ver todos
            </Link>
          </div>

          <div className="tm-pending-list">
            {pendingRequests.length === 0 ? (
              <p className="tm-pending-empty">Não há pedidos pendentes de momento.</p>
            ) : (
              pendingRequests.map((item, index) => (
                <div key={item.title} className="tm-pending-item-wrap">
                  <PendingCard item={item} />
                  {index < pendingRequests.length - 1 ? <div className="tm-panel-divider" aria-hidden="true" /> : null}
                </div>
              ))
            )}
          </div>
        </article>

        <article className="tm-panel tm-badges-panel">
          <div className="tm-panel-header tm-badges-header">
            <h2>Badges prestes a expirar</h2>
          </div>

          <div className="tm-badges-list">
            {badgeExpiring.map((badge) => (
              <BadgeRow key={`${badge.name}-${badge.consultant}`} badge={badge} />
            ))}
          </div>
        </article>
      </section>
    </>
  )
}

export default TalentManagerDashboardView