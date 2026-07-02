import { useEffect, useState, useMemo } from 'react'
import { jsPDF } from 'jspdf'
import { Row, Col } from 'react-bootstrap'
import './TalentManagerCertificadosView.css'

import { getCertificado } from '../../../controllers/gestaoController'


function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true" style={{ strokeWidth: 2, stroke: 'currentColor' }}>
      <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 10 12 5 7 10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const BADGE_IMAGES = {
  badgeEntryLevel: 'https://www.figma.com/api/mcp/asset/41229589-8f50-47c3-8553-3b4939eafc0c',
  badgeTeamLeader: 'https://www.figma.com/api/mcp/asset/b4a91d17-1fb7-4a47-bc42-d9284b60851f',
  badgeDevOps: 'https://www.figma.com/api/mcp/asset/b1a47080-ecc6-400f-b8f3-775875949b31',
}

function resolveBadgeImage(badgeName) {
  const name = badgeName.toLowerCase()
  if (name.includes('devops') || name.includes('security') || name.includes('cloud')) return BADGE_IMAGES.badgeDevOps
  if (name.includes('team') || name.includes('lead') || name.includes('agile')) return BADGE_IMAGES.badgeTeamLeader
  return BADGE_IMAGES.badgeEntryLevel
}

function TalentManagerCertificadosView() {
  const [consultants, setConsultants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedConsultantName, setSelectedConsultantName] = useState('')
  const [selectedBadgeName, setSelectedBadgeName] = useState('')
  const [previewConsultantName, setPreviewConsultantName] = useState('')
  const [previewBadgeName, setPreviewBadgeName] = useState('')
  const [hasPreview, setHasPreview] = useState(false)

  useEffect(() => {
    getCertificado()
      .then((data) => {
        setConsultants(data)
        if (data.length > 0) {
          setSelectedConsultantName(data[0].nome)
          setSelectedBadgeName(data[0].badges[0] ?? '')
        }
      })
      .catch(() => setError('Erro ao carregar dados. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [])

  const availableBadges = useMemo(() => {
    const found = consultants.find((c) => c.nome === selectedConsultantName)
    return found?.badges ?? []
  }, [consultants, selectedConsultantName])

  function handleConsultantChange(nome) {
    setSelectedConsultantName(nome)
    const found = consultants.find((c) => c.nome === nome)
    setSelectedBadgeName(found?.badges[0] ?? '')
  }

  function handleVisualizeCertificate() {
    setPreviewConsultantName(selectedConsultantName)
    setPreviewBadgeName(selectedBadgeName)
    setHasPreview(true)
  }

  const previewConsultant = useMemo(
    () => consultants.find((c) => c.nome === previewConsultantName),
    [consultants, previewConsultantName]
  )

  function downloadPdf() {
    if (!previewConsultant || !previewBadgeName) return

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

    documentPdf.setFillColor(63, 106, 167)
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
    documentPdf.setTextColor(37, 194, 214)
    documentPdf.text('TI', tiStartX + tiWidth / 2, logoY, { align: 'center' })

    documentPdf.setTextColor(37, 67, 109)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(21)
    documentPdf.text('CERTIFICADO DE CONQUISTA', centerX, cardY + 39, { align: 'center' })

    documentPdf.setDrawColor(146, 174, 215)
    documentPdf.setLineWidth(0.5)
    documentPdf.line(centerX - 28, cardY + 46, centerX + 28, cardY + 46)

    documentPdf.setTextColor(138, 146, 166)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(10)
    documentPdf.text('Certifica-se que', centerX, cardY + 59, { align: 'center' })

    documentPdf.setTextColor(63, 106, 167)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(18)
    documentPdf.text(previewConsultant.nome.toUpperCase(), centerX, cardY + 70, { align: 'center' })

    documentPdf.setTextColor(138, 146, 166)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(10)
    documentPdf.text('conquistou com sucesso o badge', centerX, cardY + 82, { align: 'center' })

    documentPdf.setTextColor(37, 67, 109)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(15)
    const badgeLines = documentPdf.splitTextToSize(previewBadgeName, 95)
    documentPdf.text(badgeLines, centerX, cardY + 94, { align: 'center' })

    const issuedDate = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
    documentPdf.setTextColor(138, 146, 166)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(9)
    documentPdf.text(`Emitido em ${issuedDate}`, centerX, cardY + 131, { align: 'center' })

    documentPdf.setDrawColor(138, 146, 166)
    documentPdf.setLineWidth(0.4)
    documentPdf.line(centerX - 48, cardY + 145, centerX + 48, cardY + 145)

    documentPdf.setFont('helvetica', 'italic')
    documentPdf.setFontSize(8)
    documentPdf.text('Talent Manager', centerX, cardY + 151, { align: 'center' })
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(8)
    documentPdf.text('Softinsa - Sistemas de Informação', centerX, cardY + 158, { align: 'center' })

    documentPdf.saveGraphicsState()
    documentPdf.setGState(new documentPdf.GState({ opacity: 0.15, 'stroke-opacity': 0.15 }))

    const wmRadius = 62
    const whiteAreaTop = cardY + 24
    const whiteAreaHeight = cardHeight - 24
    const wmY = whiteAreaTop + whiteAreaHeight / 2

    documentPdf.setDrawColor(63, 106, 167)
    documentPdf.setLineWidth(1.4)
    documentPdf.circle(centerX, wmY, wmRadius, 'S')

    documentPdf.setTextColor(63, 106, 167)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(95)
    documentPdf.text('TI', centerX, wmY + 32, { align: 'center' })

    documentPdf.restoreGraphicsState()

    documentPdf.save(`certificado-${previewConsultant.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`)
  }

  if (loading) return <div className="sll-certificates-content"><p>A carregar...</p></div>
  if (error) return <div className="sll-certificates-content"><p>{error}</p></div>

  return (
    <div className="sll-certificates-content">
      <section className="sll-certificates-hero" aria-label="Certificados de Badges">
        <div className="sll-certificates-hero-copy">
          <h1>Certificados de Badges</h1>
          <p>Cria e exporta certificados de badges personalizados</p>
        </div>
      </section>

      <Row as="section" className="g-3 align-items-start" aria-label="Configuração do certificado">
        <Col xs={12}>
          <article className="sll-certificates-form-card">
            <h2>Selecionar Dados</h2>

            <div className="sll-certificates-field">
              <label>Consultor:</label>
              <div className="sll-certificates-select-wrap">
                <select value={selectedConsultantName} onChange={(e) => handleConsultantChange(e.target.value)}>
                  <option value="">Selecione o consultor</option>
                  {consultants.map((c) => (
                    <option key={c.nome} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sll-certificates-field">
              <label>Badge:</label>
              <div className="sll-certificates-select-wrap">
                <select
                  value={selectedBadgeName}
                  onChange={(e) => setSelectedBadgeName(e.target.value)}
                  disabled={availableBadges.length === 0}
                >
                  <option value="">Selecione o badge</option>
                  {availableBadges.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="sll-certificates-visualize-btn"
              onClick={handleVisualizeCertificate}
              disabled={!selectedConsultantName || !selectedBadgeName}
            >
              Visualizar Certificado
            </button>

            <button
              type="button"
              className="sll-certificates-download-btn"
              onClick={downloadPdf}
              disabled={!hasPreview}
            >
              <ExportIcon />
              <span>Descarregar PDF</span>
            </button>
          </article>
        </Col>

        <Col xs={12}>
          <article className="sll-certificates-preview-card">
            <h2>Pre-visualização</h2>

            <div className="sll-certificates-preview">
              {!hasPreview ? (
                <div className="sll-certificates-preview-empty">
                  <p>Selecione um consultor e um badge para visualizar o certificado</p>
                </div>
              ) : (
                <div className="sll-certificates-preview-canvas">
                  <div className="sll-certificates-certificate">
                    <div className="sll-certificates-certificate-topbar" aria-hidden="true">
                      <span className="sll-certificates-certificate-logo">SOF<span>TI</span>NSA</span>
                    </div>

                    <div className="sll-certificates-certificate-body">
                      <div className="sll-certificates-certificate-watermark" aria-hidden="true">TI</div>

                      <h3>CERTIFICADO DE CONQUISTA</h3>
                      <span className="sll-certificates-certificate-rule" aria-hidden="true" />

                      <p className="sll-certificates-certificate-kicker">Certifica-se que</p>
                      <p className="sll-certificates-certificate-name">{previewConsultantName.toUpperCase()}</p>
                      <p className="sll-certificates-certificate-copy">conquistou com sucesso o badge</p>
                      <p className="sll-certificates-certificate-badge">{previewBadgeName}</p>

                      <img
                        src={resolveBadgeImage(previewBadgeName)}
                        alt=""
                        aria-hidden="true"
                        className="sll-certificates-certificate-badge-img"
                      />

                      <p className="sll-certificates-certificate-date">
                        Emitido em {new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>

                      <div className="sll-certificates-certificate-signature-rule" aria-hidden="true" />
                      <p className="sll-certificates-certificate-signature">Talent Manager</p>
                      <p className="sll-certificates-certificate-company">Softinsa - Sistemas de Informação</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        </Col>
      </Row>
    </div>
  )
}

export default TalentManagerCertificadosView