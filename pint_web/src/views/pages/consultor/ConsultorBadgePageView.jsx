import { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import {
  HiOutlineCurrencyEuro, HiOutlineStar, HiOutlinePaperClip,
  HiOutlineShare, HiOutlineXMark, HiStar,
  HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowUturnLeft,
  HiOutlineCalendarDays, HiOutlineArrowDownTray,
  HiOutlineLink,
  HiOutlineClipboard,
} from 'react-icons/hi2'
import { Row, Col } from 'react-bootstrap'
import './ConsultorBadgePageView.css'

import outsystems1 from '../../../assets/images/badges/outsystems_1.png'

import { getLearningPaths } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas } from '../../../controllers/areasController'
import { getBadgeById, getFavoritos, setFavorito } from '../../../controllers/badgesController'
import { getRequisitosByBadge } from '../../../controllers/requisitosController'
import { getPedidos, uploadDocumentacao, createPedido, getPedidoHistorico } from '../../../controllers/pedidosController'

// ─── imagem ───────────────────────────────────────────────────────────────────

function resolveImage(raw) {
  if (!raw) return outsystems1
  if (raw.startsWith('data:')) return raw
  if (raw.startsWith('http')) return raw
  if (/\.(png|jpe?g|gif|webp)$/i.test(raw)) return raw
  return `data:image/png;base64,${raw}`
}

// ─── normalização ─────────────────────────────────────────────────────────────

function normalizeRequisito(r, i) {
  return {
    id: r.id_requisito ?? r.id ?? i + 1,
    title: r.nome_requisito ?? r.titulo ?? r.title ?? `Requisito ${i + 1}`,
    descricao: r.descricao_requisito ?? r.descricao ?? r.description ?? '',
    image: resolveImage(r.imagem_requisito ?? r.imagem ?? r.image ?? null),
  }
}

function normalizeBadge(raw, requisitosRaw = [], resolved = {}) {
  return {
    id: raw.id_badge ?? raw.id,
    name: raw.nome_badge ?? raw.nome ?? raw.name ?? '—',
    level: raw.nivel_badge ?? raw.nivel ?? raw.level ?? '—',
    description: raw.descricao_badge ?? raw.descricao ?? raw.description ?? '',
    points: raw.pontos_badge ?? raw.pontos ?? raw.points ?? 550,
    isSpecial: raw.especial ?? raw.isSpecial ?? false,
    isFavorite: raw.favorito ?? raw.isFavorite ?? false,
    image: resolveImage(raw.imagem_badge ?? raw.imagem ?? raw.image ?? null),
    pago: raw.pago ?? null,
    validade: raw.validade ?? null,
    dataInsercao: raw.data_insercao ?? null,
    area: resolved.area ?? raw.Area?.nome_area ?? raw.area?.nome ?? raw.area ?? '—',
    serviceLine: resolved.serviceLine ?? raw.ServiceLine?.nome_service_line ?? raw.serviceLine?.nome ?? raw.serviceLine ?? '—',
    learningPath: resolved.learningPath ?? raw.LearningPath?.nome_learning_path ?? raw.learningPath?.nome ?? raw.learningPath ?? '—',
    status: raw.status ?? 'Submetido',
    devolucao: {
      data: raw.devolucao?.data ?? '—',
      avaliador: raw.devolucao?.avaliador ?? '—',
      motivo: raw.devolucao?.motivo ?? '—',
    },
    requisitos: requisitosRaw.length > 0
      ? requisitosRaw.map(normalizeRequisito)
      : REQUISITOS_PLACEHOLDER,
  }
}


// ─── helpers ──────────────────────────────────────────────────────────────────

function getConsultorIdFromToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id_consultor ?? payload.id ?? null  // id_consultor primeiro
  } catch { return null }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function calcularDataExpiracao(dataBase, validadeDias) {
  if (!dataBase || validadeDias == null) return null
  const data = new Date(dataBase)
  data.setDate(data.getDate() + Number(validadeDias))
  return data.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const PT_MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
function formatPortugueseDate(date = new Date()) {
  return `${date.getDate()} de ${PT_MONTHS[date.getMonth()]} de ${date.getFullYear()}`
}

// ─── UploadRow ────────────────────────────────────────────────────────────────

function UploadRow({ id, accept, onFileChange }) {
  const [file, setFile] = useState(null)
  const inputId = id || `upload-${Math.random().toString(36).slice(2, 9)}`

  function handleChange(e) {
    const next = e.target.files?.[0] ?? null
    setFile(next)
    onFileChange?.(next)
  }

  return (
    <div className="consultor-badge-upload-row">
      <label htmlFor={inputId} className="consultor-badge-upload-btn">
        <HiOutlinePaperClip aria-hidden="true" />
        <span>Ficheiro</span>
      </label>
      <input id={inputId} type="file" accept={accept} onChange={handleChange} className="consultor-badge-upload-input" />
      <span className="consultor-badge-upload-name" title={file?.name ?? ''}>
        {file ? file.name : 'Nenhum ficheiro selecionado'}
      </span>
    </div>
  )
}

// ─── ShareModal ───────────────────────────────────────────────────────────────

const SHARE_TABS = [{ id: 'email', label: 'Assinatura Email' }, { id: 'linkedin', label: 'LinkedIn' }, { id: 'pdf', label: 'Certificado PDF' }]
const CONSULTOR_NAME = 'António Portugal'

function ShareModal({ badge, onClose }) {
  const [activeTab, setActiveTab] = useState('email')
  const modalRef = useRef(null)

  useEffect(() => {
    function onOut(e) { if (modalRef.current && !modalRef.current.contains(e.target)) onClose() }
    function onEsc(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onOut)
    document.addEventListener('keydown', onEsc)
    return () => { document.removeEventListener('mousedown', onOut); document.removeEventListener('keydown', onEsc) }
  }, [onClose])

  const badgeUrl = `${window.location.origin}/badges/${badge.id}`

  function handleEmailExport() {
    const s = encodeURIComponent(`Badge Softinsa: ${badge.name}`)
    const b = encodeURIComponent(`Olá,\n\nQuero partilhar o meu badge "${badge.name}" — ${badge.level}.\n\n${badgeUrl}`)
    window.location.href = `mailto:?subject=${s}&body=${b}`
    onClose()
  }

  function handleLinkedInPublish() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(badgeUrl)}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  function handlePdfExport() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pw = doc.internal.pageSize.getWidth()
    const ph = doc.internal.pageSize.getHeight()
    const cw = 262, ch = 170, cx = (pw - cw) / 2, cy = 16, mx = pw / 2

    doc.setFillColor(248, 250, 252); doc.rect(0, 0, pw, ph, 'F')
    doc.setDrawColor(224, 182, 43); doc.setFillColor(255, 255, 255); doc.roundedRect(cx, cy, cw, ch, 3, 3, 'FD')
    doc.setFillColor(57, 99, 156); doc.roundedRect(cx, cy, cw, 24, 3, 3, 'F'); doc.rect(cx, cy + 20, cw, 4, 'F')
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22)
    doc.text('SOFTINSA', mx, cy + 15, { align: 'center' })
    doc.setTextColor(0, 184, 224)
    doc.text('TI', mx - doc.getTextWidth('SOFTINSA') / 2 + doc.getTextWidth('SOF') + doc.getTextWidth('TI') / 2, cy + 15, { align: 'center' })
    doc.setTextColor(30, 58, 95); doc.setFontSize(21); doc.text('CERTIFICADO DE CONQUISTA', mx, cy + 39, { align: 'center' })
    doc.setDrawColor(146, 174, 215); doc.setLineWidth(0.5); doc.line(mx - 28, cy + 46, mx + 28, cy + 46)
    doc.setTextColor(108, 117, 125); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
    doc.text('Certifica-se que', mx, cy + 59, { align: 'center' })
    doc.setTextColor(57, 99, 156); doc.setFont('helvetica', 'bold'); doc.setFontSize(18)
    doc.text(CONSULTOR_NAME.toUpperCase(), mx, cy + 70, { align: 'center' })
    doc.setTextColor(108, 117, 125); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
    doc.text('conquistou com sucesso o badge', mx, cy + 82, { align: 'center' })
    doc.setTextColor(30, 58, 95); doc.setFont('helvetica', 'bold'); doc.setFontSize(15)
    doc.text(doc.splitTextToSize(badge.name, 200), mx, cy + 94, { align: 'center' })
    doc.setTextColor(73, 80, 87); doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
    doc.text(`Nível: ${badge.level.replace('Nível ', '')} | Área: ${badge.area}`, mx, cy + 110, { align: 'center' })
    doc.text(`Service Line: ${badge.serviceLine}`, mx, cy + 118, { align: 'center' })
    doc.setTextColor(108, 117, 125); doc.setFontSize(9)
    doc.text(`Emitido em ${formatPortugueseDate()}`, mx, cy + 131, { align: 'center' })
    doc.setDrawColor(108, 117, 125); doc.setLineWidth(0.4); doc.line(mx - 48, cy + 145, mx + 48, cy + 145)
    doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.text('Service Line Leader', mx, cy + 151, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.text('Softinsa - Sistemas de Informação', mx, cy + 158, { align: 'center' })
    doc.save(`certificado-${badge.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.pdf`)
    onClose()
  }

  async function handleImageDownload() {
    try {
      const response = await fetch(badge.image)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // fallback: abre em nova aba para o utilizador guardar manualmente
      window.open(badge.image, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="consultor-badge-share-backdrop" role="presentation">
      <div ref={modalRef} className={`consultor-badge-share-modal is-${activeTab}`} role="dialog" aria-modal="true" aria-label="Partilhar Badge">
        <button type="button" className="consultor-badge-share-close" onClick={onClose} aria-label="Fechar"><HiOutlineXMark aria-hidden="true" /></button>
        <h2 className="consultor-badge-share-title">Partilhar Badge</h2>
        <nav className="consultor-badge-share-tabs" role="tablist">
          {SHARE_TABS.map((tab, i) => (
            <Fragment key={tab.id}>
              {i > 0 && <span className="consultor-badge-share-tab-sep" aria-hidden="true" />}
              <button type="button" role="tab" className={`consultor-badge-share-tab${activeTab === tab.id ? ' is-active' : ''}`} aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            </Fragment>
          ))}
        </nav>

        {activeTab === 'email' && (
          <div className="consultor-badge-share-body">

            {/* Preview do badge */}
            <div className="consultor-badge-share-email-preview">
              <img src={badge.image} alt={badge.name} className="consultor-badge-share-email-preview-img" />
              <div className="consultor-badge-share-email-preview-info">
                <p className="consultor-badge-share-email-preview-name">{badge.name}</p>
                <p className="consultor-badge-share-email-preview-meta">{badge.level} · {badge.area}</p>
              </div>
            </div>

            {/* Imagem */}
            <div className="consultor-badge-share-field">
              <span className="consultor-badge-share-field-section-label">Imagem do badge</span>
              <div className="consultor-badge-share-field-row">
                <HiOutlinePaperClip className="consultor-badge-share-field-row-icon" aria-hidden="true" />
                <span className="consultor-badge-share-field-value">
                  badge-{badge.name.toLowerCase().replace(/\s+/g, '-')}.png
                </span>
                <button type="button" className="consultor-badge-share-download-btn" onClick={handleImageDownload}>
                  <HiOutlineArrowDownTray aria-hidden="true" />
                  Descarregar
                </button>
              </div>
            </div>

            {/* Link público */}
            <div className="consultor-badge-share-field">
              <span className="consultor-badge-share-field-section-label">Link público</span>
              <div className="consultor-badge-share-field-row">
                <HiOutlineLink className="consultor-badge-share-field-row-icon" aria-hidden="true" />
                <span className="consultor-badge-share-field-value">{badgeUrl}</span>
                <button type="button" className="consultor-badge-share-copy-btn"
                  onClick={() => navigator.clipboard.writeText(badgeUrl)}>
                  <HiOutlineClipboard aria-hidden="true" />
                  Copiar
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'linkedin' && (
          <div className="consultor-badge-share-body">
            <div className="consultor-badge-share-field"><label htmlFor="li-user">Login:</label><input id="li-user" type="text" className="consultor-badge-share-input" placeholder="utilizador@linkedin" /></div>
            <div className="consultor-badge-share-field"><label htmlFor="li-pass">Password:</label><input id="li-pass" type="password" className="consultor-badge-share-input" placeholder="••••••••" /></div>
            <div className="consultor-badge-share-actions"><button type="button" className="consultor-badge-share-submit" onClick={handleLinkedInPublish}>Publicar</button></div>
          </div>
        )}
        {activeTab === 'pdf' && (
          <div className="consultor-badge-share-body is-pdf">
            <div className="consultor-badge-share-cert">
              <div className="consultor-badge-share-cert-header"><span className="consultor-badge-share-cert-logo">SOF<span>TI</span>NSA</span></div>
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
            <div className="consultor-badge-share-actions"><button type="button" className="consultor-badge-share-submit" onClick={handlePdfExport}>Exportar</button></div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ícones ───────────────────────────────────────────────────────────────────

function IconBadgePoints({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8.17001 2.76C9.38508 2.25995 10.6861 2.00179 12 2C13.31 2 14.61 2.26 15.83 2.76C17.04 3.26 18.14 4 19.07 4.93C20 5.86 20.74 6.96 21.24 8.17C21.74 9.39 22 10.69 22 12C22 14.65 20.95 17.2 19.07 19.07C18.1426 20 17.0406 20.7376 15.8273 21.2404C14.614 21.7432 13.3134 22.0014 12 22C10.6861 21.9982 9.38508 21.7401 8.17001 21.24C6.95807 20.7363 5.85714 19.9989 4.93001 19.07C4.00002 18.1426 3.26244 17.0406 2.75962 15.8273C2.2568 14.614 1.99865 13.3134 2.00001 12C2.00001 9.35 3.05001 6.8 4.93001 4.93C5.86001 4 6.96001 3.26 8.17001 2.76ZM12 17L13.56 13.58L17 12L13.56 10.44L12 7L10.43 10.44L7.00001 12L10.43 13.58L12 17Z" fill="currentColor" />
    </svg>
  )
}



// ─── configuração de estado / ícone ───────────────────────────────────────────

const STATUS_CONFIG = {
  'Submetido': { label: 'Em Análise', Icon: HiOutlineClock, cls: 'is-analysis' },
  'Correto': { label: 'Em Análise', Icon: HiOutlineClock, cls: 'is-analysis' },
  'Incorreto': { label: 'Devolvido', Icon: HiOutlineArrowUturnLeft, cls: 'is-returned' },
  'Aprovado': { label: 'Badge Aceite', Icon: HiOutlineCheckCircle, cls: 'is-accepted' },
  'Rejeitado': { label: 'Badge Recusado', Icon: HiOutlineXCircle, cls: 'is-rejected' },
  'Devolvido': { label: 'Devolvido', Icon: HiOutlineArrowUturnLeft, cls: 'is-returned' },
}

function IconStatus({ status, className }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['Submetido']
  const StatusIcon = config.Icon
  return <StatusIcon className={className} aria-hidden="true" />
}

// ─── view principal ───────────────────────────────────────────────────────────

function ConsultorBadgePageView({ isGuest = false }) {
  const { badgeId } = useParams()

  const [badge, setBadge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [files, setFiles] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // ── fetch badge + requisitos em paralelo ────────────────────────────────────

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        setLoading(true)
        setError(null)

        const basePromises = [
          getBadgeById(badgeId),
          getRequisitosByBadge(badgeId),
          getAreas(),
          getServiceLines(),
          getLearningPaths(),
        ]

        const [badgeData, requisitosData, areasData, slData, lpData, pedidosData, favoritos] =
          await Promise.all([
            ...basePromises,
            ...(!isGuest ? [getPedidos(), getFavoritos()] : [Promise.resolve([]), Promise.resolve([])]),
          ])


        if (!cancelled) {
          const raw = badgeData?.badge ?? badgeData?.data ?? badgeData
          const reqs = Array.isArray(requisitosData)
            ? requisitosData
            : (requisitosData?.requisitos ?? requisitosData?.data ?? [])

          const area = areasData.find((a) => a.id_area === raw.id_area)
          const sl = slData.find((s) => s.id_service_line === area?.id_service_line)
          const lp = lpData.find((l) => l.id_learning_path === sl?.id_learning_path)

          const resolvedNames = {
            area: area?.nome_area ?? '—',
            serviceLine: sl?.nome_service_line ?? '—',
            learningPath: lp?.nome_learning_path ?? '—',
          }

          const normalized = normalizeBadge(raw, reqs, resolvedNames)

          const pedidos = Array.isArray(pedidosData)
            ? pedidosData
            : (pedidosData?.pedidos ?? pedidosData?.data ?? [])

          const pedidoDoBadge = pedidos.find((p) => p.id_badge === normalized.id)

          if (pedidoDoBadge) {
            const ESTADO_MAP = {
              1: 'Submetido', 2: 'Correto', 3: 'Incorreto',
              4: 'Aprovado', 5: 'Rejeitado', 6: 'Devolvido',
            }
            normalized.status = ESTADO_MAP[pedidoDoBadge.estado_atual] ?? 'Submetido'
            normalized.pedidoId = pedidoDoBadge.id_pedido_badge

            const estadosDevolvido = [3, 6]
            if (estadosDevolvido.includes(pedidoDoBadge.estado_atual)) {
              try {
                const historico = await getPedidoHistorico(pedidoDoBadge.id_pedido_badge)
                const entrada = [...historico].reverse().find((h) =>
                  estadosDevolvido.includes(h.id_estado)
                )
                if (entrada) {
                  const cargo = entrada.id_estado === 3 ? 'Talent Manager' : 'Service Line Líder'
                  normalized.devolucao = {
                    data: entrada.data ? new Date(entrada.data).toLocaleDateString('pt-PT') : '—',
                    avaliador: entrada.nome_avaliador ? `${entrada.nome_avaliador} / ${cargo}` : cargo,
                    motivo: entrada.motivo ?? entrada.estado_objetivo ?? '—',
                  }
                }
              } catch (err) {
                console.error('Erro ao buscar devolução', err)
              }
            }

            normalized.dataExpiracao = pedidoDoBadge.estado_atual === 4
              ? calcularDataExpiracao(pedidoDoBadge.updatedAt ?? pedidoDoBadge.createdAt, raw.validade)
              : calcularDataExpiracao(raw.data_insercao, raw.validade)

          } else {
            normalized.dataExpiracao = calcularDataExpiracao(raw.data_insercao, raw.validade)
          }

          setBadge(normalized)
          const jaFavorito = Array.isArray(favoritos) && favoritos.some((f) => f.id_badge === normalized.id)
          setIsFavorite(jaFavorito)
        }
      } catch (err) {
        console.error('Erro ao carregar badge:', err)
        if (!cancelled) setError('Não foi possível carregar o badge.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (badgeId) {
      fetchAll()
    } else {
      setError('ID do badge em falta. Verifica a rota.')
      setLoading(false)
    }

    return () => { cancelled = true }
  }, [badgeId, isGuest])

  async function handleToggleFavorito() {
    if (!badge) return
    const novoEstado = !isFavorite
    setIsFavorite(novoEstado) // optimistic update
    try {
      await setFavorito(badge.id, novoEstado)
    } catch {
      setIsFavorite(!novoEstado) // reverte se falhar
    }
  }


  // ── uploads ─────────────────────────────────────────────────────────────────

  function handleFileChange(requisitoId, file) {
    setFiles((prev) => ({ ...prev, [requisitoId]: file }))
    setSubmitSuccess(false)
    setSubmitError(null)
  }

  // ── submissão ────────────────────────────────────────────────────────────────

  async function handleCandidatar() {
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(null)

    try {
      // sessão única para ligar docs + pedido
      const sessaoId = crypto.randomUUID()

      // id do consultor do token
      const idConsultor = getConsultorIdFromToken()

      if (!idConsultor) {
        throw new Error('Consultor não autenticado')
      }

      // 1. upload dos documentos temporários
      await Promise.all(
        badge.requisitos
          .filter((r) => files[r.id])
          .map(async (req) => {
            const base64 = await fileToBase64(files[req.id])

            await uploadDocumentacao({
              sessaoId,
              id_requisito: req.id,
              documentacao: base64,
            })
          })
      )

      // 2. criar pedido
      await createPedido({
        id_badge: badge.id,
        id_consultor: idConsultor,
        sessao_id: sessaoId,
      })

      setSubmitSuccess(true)
      setFiles({})
    } catch (err) {
      console.error('Erro ao submeter candidatura', err)

      setSubmitError(
        err?.response?.data?.mensagem ??
        err?.response?.data?.message ??
        err?.message ??
        'Ocorreu um erro ao submeter a candidatura.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── loading / erro ───────────────────────────────────────────────────────────

  if (loading) {
    return <section className="consultor-badge-page"><div className="consultor-badge-page-feedback">A carregar badge…</div></section>
  }

  if (error || !badge) {
    return <section className="consultor-badge-page"><div className="consultor-badge-page-feedback is-error">{error ?? 'Badge não encontrado.'}</div></section>
  }

  const badgeAceite = badge.status === 'Aprovado'
  const badgeDevolvido = badge.status === 'Incorreto' || badge.status === 'Devolvido'

  // ── render ───────────────────────────────────────────────────────────────────

  return (

    <section className="consultor-badge-page">
      <header className="consultor-badge-hero">
        <div className="consultor-badge-hero-copy">
          <h1>Badge: {badge.name}</h1>
          <div className="consultor-badge-hero-meta">
            <span>Área: {badge.area}</span>
            <span>Service Line: {badge.serviceLine}</span>
            <span>Learning Path: {badge.learningPath}</span>
          </div>
        </div>
      </header>

      <Row className="g-4 justify-content-center">
        <Col xs={12} lg={badgeDevolvido ? 6 : 8}>
        <article className="consultor-badge-card" aria-label={`Detalhes do badge ${badge.name}`}>
          <header className="consultor-badge-info-header">
            <h2>{badge.name}</h2>
            <span className="consultor-badge-info-level">{badge.level}</span>
          </header>
          <Row className="g-3 align-items-center">
            <Col xs={12} md>
              <div className="consultor-badge-info-description">
                <span className="consultor-badge-info-description-label">Descrição:</span>
                <p className="consultor-badge-info-description-text">{badge.description}</p>
              </div>
            </Col>
            <Col xs={12} md="auto">
              <img src={badge.image} alt={badge.name} className="consultor-badge-info-image" />
            </Col>
          </Row>
          <div className="consultor-badge-info-status">
            <span className="consultor-badge-info-status-row">
              <IconStatus status={badge.status} />
              <span>{badge.status}</span>
            </span>
            <span className="consultor-badge-info-status-row">
              <HiOutlineCurrencyEuro aria-hidden="true" />
              <span>{badge.pago === true ? 'Inclui documentação paga' : badge.pago === false ? 'Badge Gratuito' : '—'}</span>
            </span>
            <span className="consultor-badge-info-status-row">
              <HiOutlineCalendarDays aria-hidden="true" />
              <span>
                {badge.dataExpiracao
                  ? `Expira em ${badge.dataExpiracao}`
                  : 'Sem data de expiração'}
              </span>
            </span>
            <span className="consultor-badge-info-status-row">
              <IconBadgePoints />
              <span>{badge.points} Pontos</span>
            </span>

          </div>
          <div className="consultor-badge-info-actions">
            {!isGuest && (
              <button
                type="button"
                className={`consultor-badge-info-action-btn${isFavorite ? ' is-active' : ''}`}
                onClick={handleToggleFavorito}
                aria-pressed={isFavorite}
              >
                {isFavorite ? <HiStar aria-hidden="true" /> : <HiOutlineStar aria-hidden="true" />}
                <span>{isFavorite ? 'Retirar dos Favoritos' : 'Marcar como Favorito'}</span>
              </button>
            )}
            {!isGuest && (
              <button
                type="button"
                className="consultor-badge-info-action-btn"
                onClick={() => setIsShareOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isShareOpen}
                disabled={!badgeAceite}
                title={!badgeAceite ? 'Só podes partilhar um badge aprovado' : undefined}
              >
                <HiOutlineShare aria-hidden="true" />
                <span>Partilhar Badge</span>
              </button>
            )}
          </div>
        </article>
        </Col>

        {badgeDevolvido && (
          <Col xs={12} lg={6}>
          <article className="consultor-badge-card" aria-label="Devoluções do Pedido">
            <h2 className="consultor-badge-card-title">Devoluções do Pedido</h2>
            <div className="consultor-badge-devolucoes-field"><label>Data da Devolução:</label><span className="consultor-badge-devolucoes-field-value">{badge.devolucao.data}</span></div>
            <div className="consultor-badge-devolucoes-field"><label>Avaliador e Cargo:</label><span className="consultor-badge-devolucoes-field-value">{badge.devolucao.avaliador}</span></div>
            <div className="consultor-badge-devolucoes-field"><label>Motivo:</label><span className="consultor-badge-devolucoes-field-value is-motivo">{badge.devolucao.motivo}</span></div>
            <div className="consultor-badge-devolucoes-upload">
              <span className="consultor-badge-devolucoes-upload-label">Nova Documentação:</span>
              <UploadRow />
            </div>
            <div className="consultor-badge-card-actions">
              <button type="button" className="consultor-badge-primary-btn">Recandidatar ao Badge</button>
            </div>
          </article>
          </Col>
        )}
      </Row>

      <article className="consultor-badge-card" aria-label="Lista de Requisitos">
        <h2 className="consultor-badge-card-title">Lista de Requisitos</h2>
        <div className="consultor-badge-req-list">
          {badge.requisitos.map((req, index) => (
            <div key={req.id} className="consultor-badge-req-item">
              <div className="consultor-badge-req-number">
                {req.image && req.image !== outsystems1 ? (
                  <img src={req.image} alt={req.title} />
                ) : (
                  index + 1
                )}
              </div>

              <div className="consultor-badge-req-body">
                <h3 className="consultor-badge-req-title">{req.title}</h3>
                <span className="consultor-badge-req-section-label">Descrição:</span>
                <p className="consultor-badge-req-text">{req.descricao}</p>
                {!isGuest && (
                  <span className="consultor-badge-req-section-label">Documentação:</span>
                )}
                {!isGuest && (
                  <UploadRow id={`req-upload-${req.id}`} onFileChange={(f) => handleFileChange(req.id, f)} />
                )}
              </div>
            </div>
          ))}
        </div>

        {submitSuccess && <p className="consultor-badge-submit-feedback is-success" role="status">Candidatura submetida com sucesso!</p>}
        {submitError && <p className="consultor-badge-submit-feedback is-error" role="alert">{submitError}</p>}

        <div className="consultor-badge-card-actions">
          {!isGuest && (
            <button type="button" className="consultor-badge-primary-btn" onClick={handleCandidatar} disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? 'A submeter…' : 'Candidatar ao Badge'}
            </button>
          )}
        </div>
      </article>

      {isShareOpen && <ShareModal badge={badge} onClose={() => setIsShareOpen(false)} />}
    </section>
  )
}

export default ConsultorBadgePageView