import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  HiOutlineClock,
  HiOutlineCurrencyEuro,
  HiOutlineStar,
  HiOutlinePaperClip,
} from 'react-icons/hi2'
import './ConsultorBadgePageView.css'
import avtar1 from '../../../assets/images/avatars/avtar_1.png'

const LOREM_LONG =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const badgeData = {
  'citizen-developer': {
    name: 'Citizen Developer',
    level: 'Nível Júnior',
    image: avtar1,
    area: 'LowCode (Outsystems)',
    serviceLine: 'Hybrid Cloud',
    learningPath: 'Jornada Técnica',
    description: LOREM_LONG,
    status: 'Em Análise',
    isSpecial: true,
    isFavorite: false,
    devolucao: {
      data: '12/04/2026',
      avaliador: 'Ana Costa',
      motivo: LOREM_LONG,
    },
    requisitos: [
      { title: 'OutSystems Fundamentals',                                  candidatura: LOREM_LONG },
      { title: 'Developing Reactive Web Applications',                     candidatura: LOREM_LONG },
      { title: 'Introduction to Low-Code Development with OutSystems',     candidatura: LOREM_LONG },
      { title: 'OutSystems Associate Developer Preparation',               candidatura: LOREM_LONG.slice(0, 120) },
      { title: 'Formação equivalente em Low-Code com OutSystems',          candidatura: LOREM_LONG },
    ],
  },
}

function getBadgeBySlug(slug) {
  return badgeData[slug] || badgeData['citizen-developer']
}

function UploadRow({ id, accept, onFileChange }) {
  const [file, setFile] = useState(null)

  function handleChange(event) {
    const next = event.target.files && event.target.files[0] ? event.target.files[0] : null
    setFile(next)
    if (onFileChange) onFileChange(next)
  }

  const inputId = id || `consultor-badge-upload-${Math.random().toString(36).slice(2, 9)}`

  return (
    <div className="consultor-badge-upload-row">
      <label htmlFor={inputId} className="consultor-badge-upload-btn">
        <HiOutlinePaperClip aria-hidden="true" />
        <span>Escolher ficheiro</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="consultor-badge-upload-input"
      />
      <span className="consultor-badge-upload-name" title={file ? file.name : ''}>
        {file ? file.name : 'Nenhum ficheiro selecionado'}
      </span>
    </div>
  )
}

function ConsultorBadgePageView() {
  const { slug } = useParams()
  const badge = getBadgeBySlug(slug)

  return (
    <section className="consultor-badge-page">
      <header className="consultor-badge-hero">
        <div className="consultor-badge-hero-art" aria-hidden="true">
          <div className="consultor-badge-hero-circle consultor-badge-hero-circle-5" />
          <div className="consultor-badge-hero-circle consultor-badge-hero-circle-4" />
          <div className="consultor-badge-hero-circle consultor-badge-hero-circle-3" />
          <div className="consultor-badge-hero-circle consultor-badge-hero-circle-2" />
          <div className="consultor-badge-hero-circle consultor-badge-hero-circle-1" />
        </div>

        <div className="consultor-badge-hero-copy">
          <h1>Badge: {badge.name}</h1>
          <div className="consultor-badge-hero-meta">
            <span>Área: {badge.area}</span>
            <span>Service Line: {badge.serviceLine}</span>
            <span>Learning Path: {badge.learningPath}</span>
          </div>
        </div>
      </header>

      <div className="consultor-badge-top-grid">
        <article className="consultor-badge-card" aria-label={`Detalhes do badge ${badge.name}`}>
          <header className="consultor-badge-info-header">
            <h2>{badge.name}</h2>
            <span className="consultor-badge-info-level">{badge.level}</span>
          </header>

          <div className="consultor-badge-info-body">
            <div className="consultor-badge-info-description">
              <span className="consultor-badge-info-description-label">Descrição:</span>
              <p className="consultor-badge-info-description-text">{badge.description}</p>
            </div>
            <img src={badge.image} alt={badge.name} className="consultor-badge-info-image" />
          </div>

          <div className="consultor-badge-info-status">
            <span className="consultor-badge-info-status-row">
              <HiOutlineClock aria-hidden="true" />
              <span>{badge.status}</span>
            </span>
            {badge.isSpecial ? (
              <span className="consultor-badge-info-status-row">
                <HiOutlineCurrencyEuro aria-hidden="true" />
                <span>Badge Especial</span>
              </span>
            ) : null}
            <span className="consultor-badge-info-status-row">
              <HiOutlineStar aria-hidden="true" />
              <span>Badge Favorito</span>
            </span>
            <div className="consultor-badge-info-actions">
              <button type="button" className="consultor-badge-info-fav-btn">
                <HiOutlineStar aria-hidden="true" />
                <span>{badge.isFavorite ? 'Remover Favorito' : 'Adicionar Favorito'}</span>
              </button>
            </div>
          </div>
        </article>

        <article className="consultor-badge-card" aria-label="Devoluções do Pedido">
          <h2 className="consultor-badge-card-title">Devoluções do Pedido</h2>

          <div className="consultor-badge-devolucoes-field">
            <label>Data da Devolução:</label>
            <span className="consultor-badge-devolucoes-field-value">{badge.devolucao.data}</span>
          </div>

          <div className="consultor-badge-devolucoes-field">
            <label>Avaliador:</label>
            <span className="consultor-badge-devolucoes-field-value">{badge.devolucao.avaliador}</span>
          </div>

          <div className="consultor-badge-devolucoes-field">
            <label>Motivo:</label>
            <span className="consultor-badge-devolucoes-field-value is-motivo">{badge.devolucao.motivo}</span>
          </div>

          <div className="consultor-badge-devolucoes-upload">
            <span className="consultor-badge-devolucoes-upload-label">Nova Documentação:</span>
            <UploadRow />
          </div>

          <div className="consultor-badge-card-actions">
            <button type="button" className="consultor-badge-primary-btn">
              Recandidatar ao Badge
            </button>
          </div>
        </article>
      </div>

      <article className="consultor-badge-card" aria-label="Lista de Requisitos">
        <h2 className="consultor-badge-card-title">Lista de Requisitos</h2>

        <div className="consultor-badge-req-list">
          {badge.requisitos.map((req, index) => (
            <div key={req.title} className="consultor-badge-req-item">
              <span className="consultor-badge-req-number">{index + 1}</span>

              <div className="consultor-badge-req-body">
                <h3 className="consultor-badge-req-title">{req.title}</h3>
                <span className="consultor-badge-req-section-label">Candidatura:</span>
                <p className="consultor-badge-req-text">{req.candidatura}</p>
                <UploadRow />
              </div>
            </div>
          ))}
        </div>

        <div className="consultor-badge-card-actions">
          <button type="button" className="consultor-badge-primary-btn">
            Candidatar ao Badge
          </button>
        </div>
      </article>
    </section>
  )
}

export default ConsultorBadgePageView
