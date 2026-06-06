import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import './PerfilPublicoView.css'

import { getConsultor } from '../../../controllers/utilizadoresController'

// Converte base64 puro para data URL utilizável numa <img>
function normalizeImage(raw) {
  if (!raw) return null
  if (raw.startsWith('data:') || raw.startsWith('http')) return raw
  return `data:image/png;base64,${raw}`
}

// Formata uma data ISO para dd/mm/aaaa
function formatDate(raw) {
  if (!raw) return '—'
  const d = new Date(raw)
  if (isNaN(d)) return raw
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function BadgeItem({ image, name, date }) {
  return (
    <div className="sll-profile-badge-item">
      <div className="sll-profile-badge-image">
        <img src={normalizeImage(image)} alt={name} />
      </div>
      <p>{name}</p>
      <span>{formatDate(date)}</span>
    </div>
  )
}

function mapApiResponse(data) {
  return {
    profile: {
      name: data.nome,
      role: 'Consultor',
      area: data.area,
      serviceLine: data.service_line ?? '—',
      learningPath: data.learning_path ?? '—',
      points: `${data.total_pontos} Pontos`,
      badges: `${data.total_badges} Badges Obtidos`,
      email: data.email,
      avatarUrl: normalizeImage(data.foto),
    },
    badges: (data.badges ?? []).map((b) => ({
      image: b.imagem,
      name: b.nome,
      date: b.data_conclusao,
    })),
  }
}

function ConsultorPublicProfileView() {
  const { id_consultor } = useParams()

  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getConsultor(id_consultor)
      .then((data) => {
        const mapped = mapApiResponse(data)
        setProfile(mapped.profile)
        setBadges(mapped.badges)
      })
      .catch(() => setError('Não foi possível carregar o perfil. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [id_consultor])

  if (loading) {
    return (
      <div className="sll-profile-page">
        <main className="sll-profile-main">
          <div className="sll-profile-scroll">
            <section className="sll-profile-hero" aria-hidden="true">
              <div className="sll-profile-hero-copy"><h1>Perfis Públicos</h1></div>
            </section>
            <p style={{ padding: '24px', color: '#8a92a6' }}>A carregar perfil…</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="sll-profile-page">
        <main className="sll-profile-main">
          <div className="sll-profile-scroll">
            <section className="sll-profile-hero" aria-hidden="true">
              <div className="sll-profile-hero-copy"><h1>Perfis Públicos</h1></div>
            </section>
            <p style={{ padding: '24px', color: '#e74c3c' }}>{error ?? 'Perfil não encontrado.'}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="sll-profile-page">
      <main className="sll-profile-main">
        <div className="sll-profile-scroll">

          {/* Hero */}
          <section className="sll-profile-hero" aria-label="Perfil público consultor">
            <div className="sll-profile-hero-copy">
              <h1>Perfis Públicos</h1>
              <p>Estamos aqui para te ajudar a melhorar o currículo</p>
            </div>
          </section>

          {/* Cartão principal */}
          <section className="sll-profile-card d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center">
            <div className="sll-profile-card-main">
              <div className="sll-profile-avatar">
                <img
                  src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=3b8aff&color=fff`}
                  alt={profile.name}
                />
              </div>
              <div className="sll-profile-copy">
                <div className="sll-profile-name-row">
                  <h2>{profile.name}</h2>
                  <span className="sll-profile-role-pill">{profile.role}</span>
                </div>
                <p>Área: {profile.area}</p>
                <p>Service Line: {profile.serviceLine}</p>
                <p>Learning Path: {profile.learningPath}</p>
              </div>
            </div>

            <div className="vr d-none d-lg-block" />
            <hr className="d-lg-none w-100 m-0" />

            <div className="sll-profile-stats">
              <div className="sll-profile-stat-item">
                <span>{profile.points}</span>
              </div>
              <div className="sll-profile-stat-item">
                <span>{profile.badges}</span>
              </div>
              <div className="sll-profile-stat-item">
                <span>{profile.email}</span>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section className="sll-profile-badges-card">
            <div className="sll-profile-badges-header">
              <h3>Badges Obtidos</h3>
            </div>

            {badges.length === 0 ? (
              <p style={{ color: '#8a92a6', fontSize: '16px' }}>Ainda não foram obtidos badges.</p>
            ) : (
              <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {badges.map((badge, index) => (
                  <Col key={`${badge.name}-${index}`}>
                    <BadgeItem
                      image={badge.image}
                      name={badge.name}
                      date={badge.date}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </section>

        </div>
      </main>
    </div>
  )
}

export default ConsultorPublicProfileView