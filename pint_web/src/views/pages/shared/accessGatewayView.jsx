import { Link } from 'react-router-dom'
import './access-gateway.css'

const portalOptions = [
  {
    id: 'admin',
    to: '/admin',
    badge: 'Portal de Gestao',
    title: 'Entrar como Admin',
    summary:
      'Acede ao dashboard de gestao para utilizadores, badges, areas, service lines e controlo operacional.',
    cta: 'Ir para Admin',
  },
  {
    id: 'consultor',
    to: '/consultor',
    badge: 'Portal de Consultor',
    title: 'Entrar como Consultor',
    summary:
      'Consulta objetivos, conquistas, pedidos e listas de badges no espaco dedicado ao consultor.',
    cta: 'Ir para Consultor',
  },
  {
    id: 'sll',
    to: '/sll',
    badge: 'Portal de Lider',
    title: 'Entrar como Service Line Leader',
    summary:
      'Acompanha alertas, pedidos pendentes, desempenho da equipa e progresso global da service line.',
    cta: 'Ir para Service Line Leader',
  },
  {
    id: 'talent-manager',
    to: '/talent-manager',
    badge: 'Portal de Talentos',
    title: 'Entrar como Talent Manager',
    summary:
      'Gere pedidos pendentes, notificações, validade de badges e acompanhamento da equipa a partir do dashboard.',
    cta: 'Ir para Talent Manager',
  },
]

function AccessCard({ option }) {
  return (
    <article className={`access-gateway-card access-gateway-card-${option.id}`}>
      <p className="access-gateway-card-badge">{option.badge}</p>
      <h2>{option.title}</h2>
      <p className="access-gateway-card-summary">{option.summary}</p>

      <Link className="access-gateway-card-link" to={option.to}>
        {option.cta}
      </Link>
    </article>
  )
}

function AccessGatewayView() {
  return (
    <main className="access-gateway-page">
      <div className="access-gateway-backdrop" aria-hidden="true" />

      <section className="access-gateway-panel" aria-label="Selecao de perfil">
        <p className="access-gateway-eyebrow">SOFTINSA PLATFORM</p>
        <h1>Escolhe o portal de entrada</h1>
        <p className="access-gateway-lead">
          Seleciona o perfil que queres utilizar nesta sessao para aceder ao conjunto certo de
          funcionalidades.
        </p>

        <div className="access-gateway-grid">
          {portalOptions.map((option) => (
            <AccessCard key={option.id} option={option} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default AccessGatewayView