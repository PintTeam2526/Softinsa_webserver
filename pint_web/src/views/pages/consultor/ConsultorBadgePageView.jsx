import { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import {
  HiOutlineCurrencyEuro,
  HiOutlineStar,
  HiOutlinePaperClip,
  HiOutlineShare,
  HiOutlineXMark,
  HiStar,
} from 'react-icons/hi2'
import './ConsultorBadgePageView.css'
import outsystems1 from '../../../assets/images/badges/outsystems_1.png'
import outsystems2 from '../../../assets/images/badges/outsystems_2.png'
import outsystems3 from '../../../assets/images/badges/outsystems_3.png'
import outsystems4 from '../../../assets/images/badges/outsystems_4.png'
import outsystems5 from '../../../assets/images/badges/outsystems_5.png'
import devops1 from '../../../assets/images/badges/devops_1.png'
import devops2 from '../../../assets/images/badges/devops_2.png'
import devops3 from '../../../assets/images/badges/devops_3.png'
import devops4 from '../../../assets/images/badges/devops_4.png'
import devops5 from '../../../assets/images/badges/devops_5.png'
import tm1 from '../../../assets/images/badges/tm_1.png'
import tm2 from '../../../assets/images/badges/tm_2.png'
import tm3 from '../../../assets/images/badges/tm_3.png'
import tm4 from '../../../assets/images/badges/tm_4.png'
import tm5 from '../../../assets/images/badges/tm_5.png'

const LOREM_LONG =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

function slugify(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function IconBadgePoints({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8.17001 2.76C9.38508 2.25995 10.6861 2.00179 12 2C13.31 2 14.61 2.26 15.83 2.76C17.04 3.26 18.14 4 19.07 4.93C20 5.86 20.74 6.96 21.24 8.17C21.74 9.39 22 10.69 22 12C22 14.65 20.95 17.2 19.07 19.07C18.1426 20 17.0406 20.7376 15.8273 21.2404C14.614 21.7432 13.3134 22.0014 12 22C10.6861 21.9982 9.38508 21.7401 8.17001 21.24C6.95807 20.7363 5.85714 19.9989 4.93001 19.07C4.00002 18.1426 3.26244 17.0406 2.75962 15.8273C2.2568 14.614 1.99865 13.3134 2.00001 12C2.00001 9.35 3.05001 6.8 4.93001 4.93C5.86001 4 6.96001 3.26 8.17001 2.76ZM12 17L13.56 13.58L17 12L13.56 10.44L12 7L10.43 10.44L7.00001 12L10.43 13.58L12 17Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconBadgeClock({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M23.9524 19.6867L19.5635 11.5702C20.0112 10.554 20.2617 9.43085 20.2617 8.24922C20.2617 3.69522 16.5699 0.00372314 12.0162 0.00372314C7.46148 0.00372314 3.76998 3.6956 3.76998 8.24922C3.76998 9.45935 4.03286 10.6076 4.50086 11.6426L0.0923572 19.683C-0.0497913 19.9413 -0.0261663 20.2601 0.151584 20.496C0.329709 20.7311 0.630459 20.8417 0.917685 20.7742L4.68231 19.9106L5.97081 23.4994C6.07131 23.7784 6.32594 23.9719 6.62106 23.9936C6.64021 23.9951 6.65856 23.9959 6.67656 23.9959C6.81218 23.9958 6.94524 23.959 7.06159 23.8893C7.17795 23.8197 7.27323 23.7198 7.33731 23.6002L11.1739 16.4524C11.4537 16.4807 11.7346 16.4949 12.0158 16.4948C12.2764 16.4948 12.5337 16.4813 12.7879 16.4573L16.7078 23.6059C16.7771 23.7326 16.8817 23.8366 17.0087 23.9053C17.1358 23.974 17.28 24.0046 17.424 23.9932C17.7184 23.9696 17.9719 23.7765 18.0716 23.499L19.3601 19.9102L23.1248 20.7739C23.4135 20.8436 23.7113 20.7315 23.8894 20.4971C24.0683 20.2631 24.0923 19.9458 23.9524 19.6867H23.9524ZM6.81301 21.4065L5.86947 18.7777C5.74047 18.4203 5.36624 18.2122 4.99572 18.3003L2.21134 18.9389L5.38501 13.1504C6.43014 14.5623 7.91514 15.6273 9.63751 16.1456L6.81301 21.4065ZM5.27662 8.2492C5.27662 4.53332 8.30026 1.51007 12.0165 1.51007C15.7324 1.51007 18.7556 4.53332 18.7556 8.2492C18.7556 11.9651 15.7324 14.9891 12.0165 14.9891C8.29986 14.9891 5.27662 11.9651 5.27662 8.2492ZM19.0466 18.3003C18.6746 18.2126 18.3019 18.4203 18.1729 18.7777L17.223 21.4255L14.3366 16.1624C16.1047 15.6445 17.6257 14.5514 18.6844 13.0983L21.8449 18.9419L19.0466 18.3003Z"
        fill="currentColor"
      />
      <circle cx="12.0165" cy="8.2492" r="3.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M12.0165 6.2 L12.0165 8.2492 L13.6 9.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function buildBadge(spec) {
  return {
    description: LOREM_LONG,
    status: 'Em Análise',
    isSpecial: false,
    isFavorite: false,
    serviceLine: 'Hybrid Cloud',
    learningPath: 'Jornada Técnica',
    ...spec,
    devolucao: {
      data: '12/04/2026',
      avaliador: 'Ana Costa, Tech Lead',
      motivo: LOREM_LONG,
      ...(spec.devolucao || {}),
    },
    requisitos: spec.requisitos || [
      { title: 'Curso de Fundamentos',                  descricao: LOREM_LONG },
      { title: 'Curso Intermédio',                      descricao: LOREM_LONG },
      { title: 'Curso Avançado',                        descricao: LOREM_LONG },
      { title: 'Avaliação prática',                     descricao: LOREM_LONG.slice(0, 120) },
      { title: 'Formação equivalente reconhecida',      descricao: LOREM_LONG },
    ],
  }
}

const BADGE_SPECS = [
  // OutSystems / LowCode
  { name: 'Citizen developer',    level: 'Nível Júnior',          image: outsystems1, area: 'LowCode (Outsystems)', isSpecial: true,
    requisitos: [
      { title: 'OutSystems Fundamentals',                                  descricao: LOREM_LONG },
      { title: 'Developing Reactive Web Applications',                     descricao: LOREM_LONG },
      { title: 'Introduction to Low-Code Development with OutSystems',     descricao: LOREM_LONG },
      { title: 'OutSystems Associate Developer Preparation',               descricao: LOREM_LONG.slice(0, 120) },
      { title: 'Formação equivalente em Low-Code com OutSystems',          descricao: LOREM_LONG },
    ],
  },
  { name: 'Low-Code Builder',     level: 'Nível Intermédio',      image: outsystems2, area: 'LowCode (Outsystems)' },
  { name: 'Application Creator',  level: 'Nível Sénior',          image: outsystems3, area: 'LowCode (Outsystems)' },
  { name: 'Full-Stack Low-Code',  level: 'Nível Especialista',    image: outsystems4, area: 'LowCode (Outsystems)' },
  { name: 'Elite OutSystems',     level: 'Líder de conhecimento', image: outsystems5, area: 'LowCode (Outsystems)', isSpecial: true },

  // DevOps
  { name: 'DevOps Beginner',      level: 'Nível Júnior',          image: devops1, area: 'DevOps', serviceLine: 'Application Ops.' },
  { name: 'DevOps Intermediate',  level: 'Nível Intermédio',      image: devops2, area: 'DevOps', serviceLine: 'Application Ops.',
    devolucao: { data: '03/04/2026', avaliador: 'Carla Mendes, DevOps Lead', motivo: LOREM_LONG },
    requisitos: [
      { title: 'CI/CD Fundamentals',                  descricao: LOREM_LONG },
      { title: 'Infrastructure as Code',              descricao: LOREM_LONG },
      { title: 'Monitoring and Observability',        descricao: LOREM_LONG },
      { title: 'Container Orchestration Basics',      descricao: LOREM_LONG.slice(0, 120) },
      { title: 'Formação equivalente em DevOps',      descricao: LOREM_LONG },
    ],
  },
  { name: 'DevOps Specialist',    level: 'Nível Sénior',          image: devops3, area: 'DevOps', serviceLine: 'Application Ops.' },
  { name: 'DevOps Expert',        level: 'Nível Especialista',    image: devops4, area: 'DevOps', serviceLine: 'Application Ops.' },
  { name: 'DevOps Architect',     level: 'Líder de conhecimento', image: devops5, area: 'DevOps', serviceLine: 'Application Ops.', isSpecial: true },

  // Talent Management
  { name: 'Talent Beginner',      level: 'Nível Júnior',          image: tm1, area: 'Talent Management', serviceLine: 'Sourc. & Talent Manag.', learningPath: 'Jornada de Liderança' },
  { name: 'Team Lider Beginner',  level: 'Nível Júnior',          image: tm1, area: 'Talent Management', serviceLine: 'Sourc. & Talent Manag.', learningPath: 'Jornada de Liderança',
    devolucao: { data: '08/04/2026', avaliador: 'Bruno Silva, Talent Manager', motivo: LOREM_LONG },
    requisitos: [
      { title: 'Team Leadership Fundamentals',                  descricao: LOREM_LONG },
      { title: 'People Management Basics',                      descricao: LOREM_LONG },
      { title: 'Feedback and Coaching in Teams',                descricao: LOREM_LONG },
      { title: 'Conflict Resolution for Leaders',               descricao: LOREM_LONG.slice(0, 120) },
      { title: 'Formação equivalente em gestão de equipas',     descricao: LOREM_LONG },
    ],
  },
  { name: 'Talent Sourcer',       level: 'Nível Intermédio',      image: tm2, area: 'Talent Management', serviceLine: 'Sourc. & Talent Manag.', learningPath: 'Jornada de Liderança' },
  { name: 'Talent Manager',       level: 'Nível Sénior',          image: tm3, area: 'Talent Management', serviceLine: 'Sourc. & Talent Manag.', learningPath: 'Jornada de Liderança' },
  { name: 'Talent Strategist',    level: 'Nível Especialista',    image: tm4, area: 'Talent Management', serviceLine: 'Sourc. & Talent Manag.', learningPath: 'Jornada de Liderança' },
  { name: 'Talent Leader',        level: 'Líder de conhecimento', image: tm5, area: 'Talent Management', serviceLine: 'Sourc. & Talent Manag.', learningPath: 'Jornada de Liderança', isSpecial: true },
]

const badgeData = BADGE_SPECS.reduce((acc, spec) => {
  acc[slugify(spec.name)] = buildBadge(spec)
  return acc
}, {})

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

const SHARE_TABS = [
  { id: 'email',    label: 'Assinatura Email' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'pdf',      label: 'Certificado PDF' },
]

const CONSULTOR_NAME = 'António Portugal'

const PT_MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

function formatPortugueseDate(date = new Date()) {
  return `${date.getDate()} de ${PT_MONTHS[date.getMonth()]} de ${date.getFullYear()}`
}

function ShareModal({ badge, onClose }) {
  const [activeTab, setActiveTab] = useState('email')
  const modalRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const badgeUrl = typeof window !== 'undefined' ? window.location.href : ''

  function handleEmailExport() {
    const subject = encodeURIComponent(`Badge Softinsa: ${badge.name}`)
    const body = encodeURIComponent(
      `Olá,\n\nQuero partilhar o meu badge "${badge.name}" — ${badge.level}.\n\n${badgeUrl}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    onClose()
  }

  function handleLinkedInPublish() {
    const url = encodeURIComponent(badgeUrl)
    const text = encodeURIComponent(`Conquistei o badge "${badge.name}" na Softinsa!`)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  function handlePdfExport() {
    const issuedDate = formatPortugueseDate()
    const documentPdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = documentPdf.internal.pageSize.getWidth()
    const pageHeight = documentPdf.internal.pageSize.getHeight()
    const cardWidth = 262
    const cardHeight = 170
    const cardX = (pageWidth - cardWidth) / 2
    const cardY = 16
    const centerX = pageWidth / 2

    documentPdf.setFillColor(248, 250, 252)
    documentPdf.rect(0, 0, pageWidth, pageHeight, 'F')

    documentPdf.setDrawColor(224, 182, 43)
    documentPdf.setFillColor(255, 255, 255)
    documentPdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'FD')

    documentPdf.setFillColor(57, 99, 156)
    documentPdf.roundedRect(cardX, cardY, cardWidth, 24, 3, 3, 'F')
    documentPdf.rect(cardX, cardY + 20, cardWidth, 4, 'F')

    documentPdf.setTextColor(255, 255, 255)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(22)
    const logoY = cardY + 15
    const logoText = 'SOFTINSA'
    const logoWidth = documentPdf.getTextWidth(logoText)
    const logoStartX = centerX - logoWidth / 2

    documentPdf.text(logoText, centerX, logoY, { align: 'center' })

    const softWidth = documentPdf.getTextWidth('SOF')
    const tiWidth = documentPdf.getTextWidth('TI')
    const tiStartX = logoStartX + softWidth

    documentPdf.setTextColor(0, 184, 224)
    documentPdf.text('TI', tiStartX + tiWidth / 2, logoY, { align: 'center' })

    documentPdf.setTextColor(30, 58, 95)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(21)
    documentPdf.text('CERTIFICADO DE CONQUISTA', centerX, cardY + 39, { align: 'center' })

    documentPdf.setDrawColor(146, 174, 215)
    documentPdf.setLineWidth(0.5)
    documentPdf.line(centerX - 28, cardY + 46, centerX + 28, cardY + 46)

    documentPdf.setTextColor(108, 117, 125)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(10)
    documentPdf.text('Certifica-se que', centerX, cardY + 59, { align: 'center' })

    documentPdf.setTextColor(57, 99, 156)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(18)
    documentPdf.text(CONSULTOR_NAME.toUpperCase(), centerX, cardY + 70, { align: 'center' })

    documentPdf.setTextColor(108, 117, 125)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(10)
    documentPdf.text('conquistou com sucesso o badge', centerX, cardY + 82, { align: 'center' })

    documentPdf.setTextColor(30, 58, 95)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(15)
    const badgeLines = documentPdf.splitTextToSize(badge.name, 200)
    documentPdf.text(badgeLines, centerX, cardY + 94, { align: 'center' })

    documentPdf.setTextColor(73, 80, 87)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(9)
    const levelLabel = badge.level.replace('Nível ', '')
    documentPdf.text(`Nível: ${levelLabel} | Área: ${badge.area}`, centerX, cardY + 110, { align: 'center' })
    documentPdf.text(`Service Line: ${badge.serviceLine}`, centerX, cardY + 118, { align: 'center' })

    documentPdf.setTextColor(108, 117, 125)
    documentPdf.setFontSize(9)
    documentPdf.text(`Emitido em ${issuedDate}`, centerX, cardY + 131, { align: 'center' })

    documentPdf.setDrawColor(108, 117, 125)
    documentPdf.setLineWidth(0.4)
    documentPdf.line(centerX - 48, cardY + 145, centerX + 48, cardY + 145)

    documentPdf.setTextColor(108, 117, 125)
    documentPdf.setFont('helvetica', 'italic')
    documentPdf.setFontSize(8)
    documentPdf.text('Service Line Leader', centerX, cardY + 151, { align: 'center' })
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(8)
    documentPdf.text('Softinsa - Sistemas de Informação', centerX, cardY + 158, { align: 'center' })

    const safeSlug = badge.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    documentPdf.save(`certificado-${safeSlug || 'badge'}.pdf`)
    onClose()
  }

  return (
    <div className="consultor-badge-share-backdrop" role="presentation">
      <div
        ref={modalRef}
        className={`consultor-badge-share-modal is-${activeTab}`}
        role="dialog"
        aria-modal="true"
        aria-label="Partilhar Badge"
      >
        <button
          type="button"
          className="consultor-badge-share-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <HiOutlineXMark aria-hidden="true" />
        </button>

        <h2 className="consultor-badge-share-title">Partilhar Badge</h2>

        <nav className="consultor-badge-share-tabs" role="tablist">
          {SHARE_TABS.map((tab, index) => (
            <Fragment key={tab.id}>
              {index > 0 ? <span className="consultor-badge-share-tab-sep" aria-hidden="true" /> : null}
              <button
                type="button"
                role="tab"
                className={`consultor-badge-share-tab${activeTab === tab.id ? ' is-active' : ''}`}
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </Fragment>
          ))}
        </nav>

        {activeTab === 'email' ? (
          <div className="consultor-badge-share-body">
            <div className="consultor-badge-share-field">
              <label>Imagem:</label>
              <span className="consultor-badge-share-field-value">link para descarregar a imagem do badge</span>
            </div>
            <div className="consultor-badge-share-field">
              <label>Link do Badge:</label>
              <span className="consultor-badge-share-field-value">{badgeUrl || 'http://localhost:3000/paginadobadge'}</span>
            </div>
            <div className="consultor-badge-share-actions">
              <button type="button" className="consultor-badge-share-submit" onClick={handleEmailExport}>
                Exportar
              </button>
            </div>
          </div>
        ) : null}

        {activeTab === 'linkedin' ? (
          <div className="consultor-badge-share-body">
            <div className="consultor-badge-share-field">
              <label htmlFor="consultor-badge-li-user">Login:</label>
              <input
                id="consultor-badge-li-user"
                type="text"
                className="consultor-badge-share-input"
                placeholder="utilizador@linkedin"
              />
            </div>
            <div className="consultor-badge-share-field">
              <label htmlFor="consultor-badge-li-pass">Password:</label>
              <input
                id="consultor-badge-li-pass"
                type="password"
                className="consultor-badge-share-input"
                placeholder="••••••••"
              />
            </div>
            <div className="consultor-badge-share-actions">
              <button type="button" className="consultor-badge-share-submit" onClick={handleLinkedInPublish}>
                Publicar
              </button>
            </div>
          </div>
        ) : null}

        {activeTab === 'pdf' ? (
          <div className="consultor-badge-share-body is-pdf">
            <div className="consultor-badge-share-cert">
              <div className="consultor-badge-share-cert-header">
                <span className="consultor-badge-share-cert-logo">SOF<span>TI</span>NSA</span>
              </div>
              <div className="consultor-badge-share-cert-body">
                <h3>CERTIFICADO DE CONQUISTA</h3>
                <span className="consultor-badge-share-cert-rule" aria-hidden="true" />
                <p className="consultor-badge-share-cert-kicker">Certifica-se que</p>
                <p className="consultor-badge-share-cert-name">{CONSULTOR_NAME.toUpperCase()}</p>
                <p className="consultor-badge-share-cert-copy">conquistou com sucesso o badge</p>
                <p className="consultor-badge-share-cert-badge">{badge.name}</p>
                <p className="consultor-badge-share-cert-meta">Nível: {badge.level.replace('Nível ', '')} | Área: {badge.area}</p>
                <p className="consultor-badge-share-cert-meta">Service Line: {badge.serviceLine}</p>
                <p className="consultor-badge-share-cert-date">Emitido em {formatPortugueseDate()}</p>
                <span className="consultor-badge-share-cert-sig-rule" aria-hidden="true" />
                <p className="consultor-badge-share-cert-signature">Service Line Leader</p>
                <p className="consultor-badge-share-cert-company">Softinsa - Sistemas de Informação</p>
              </div>
            </div>
            <div className="consultor-badge-share-actions">
              <button type="button" className="consultor-badge-share-submit" onClick={handlePdfExport}>
                Exportar
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ConsultorBadgePageView() {
  const { slug } = useParams()
  const badge = getBadgeBySlug(slug)

  const [isFavorite, setIsFavorite] = useState(Boolean(badge.isFavorite))
  const [isShareOpen, setIsShareOpen] = useState(false)

  function toggleFavorite() {
    setIsFavorite((prev) => !prev)
  }

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
              <IconBadgeClock />
              <span>{badge.status}</span>
            </span>
            {badge.isSpecial ? (
              <span className="consultor-badge-info-status-row">
                <HiOutlineCurrencyEuro aria-hidden="true" />
                <span>Badge Especial</span>
              </span>
            ) : null}
            <span className="consultor-badge-info-status-row">
              <IconBadgePoints />
              <span>{badge.points || 550} Pontos</span>
            </span>
          </div>

          <div className="consultor-badge-info-actions">
            <button
              type="button"
              className={`consultor-badge-info-action-btn${isFavorite ? ' is-active' : ''}`}
              onClick={toggleFavorite}
              aria-pressed={isFavorite}
            >
              {isFavorite ? (
                <HiStar aria-hidden="true" />
              ) : (
                <HiOutlineStar aria-hidden="true" />
              )}
              <span>{isFavorite ? 'Retirar dos Favoritos' : 'Marcar como Favorito'}</span>
            </button>

            <button
              type="button"
              className="consultor-badge-info-action-btn"
              onClick={() => setIsShareOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isShareOpen}
            >
              <HiOutlineShare aria-hidden="true" />
              <span>Partilhar Badge</span>
            </button>
          </div>
        </article>

        <article className="consultor-badge-card" aria-label="Devoluções do Pedido">
          <h2 className="consultor-badge-card-title">Devoluções do Pedido</h2>

          <div className="consultor-badge-devolucoes-field">
            <label>Data da Devolução:</label>
            <span className="consultor-badge-devolucoes-field-value">{badge.devolucao.data}</span>
          </div>

          <div className="consultor-badge-devolucoes-field">
            <label>Avaliador e Cargo:</label>
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
                <span className="consultor-badge-req-section-label">Descrição:</span>
                <p className="consultor-badge-req-text">{req.descricao}</p>
                <span className="consultor-badge-req-section-label">Documentação:</span>
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

      {isShareOpen ? <ShareModal badge={badge} onClose={() => setIsShareOpen(false)} /> : null}
    </section>
  )
}

export default ConsultorBadgePageView
