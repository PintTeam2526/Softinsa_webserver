import { useMemo, useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-certificados.css'

const profileAvatar = 'https://www.figma.com/api/mcp/asset/791e05ae-1993-432d-aa0a-a906a2c30856'
const badgeEntryLevel = 'https://www.figma.com/api/mcp/asset/41229589-8f50-47c3-8553-3b4939eafc0c'
const badgeTeamLeader = 'https://www.figma.com/api/mcp/asset/b4a91d17-1fb7-4a47-bc42-d9284b60851f'
const badgeDevOps = 'https://www.figma.com/api/mcp/asset/b1a47080-ecc6-400f-b8f3-775875949b31'
const heroEllipse1 = 'https://www.figma.com/api/mcp/asset/d52bcef6-8633-4aef-a46d-620628b11422'
const heroEllipse2 = 'https://www.figma.com/api/mcp/asset/015d6486-d269-4542-b2af-cbffe841b87a'
const heroEllipse3 = 'https://www.figma.com/api/mcp/asset/a95d40bd-58a1-4651-b2be-51b95d3ff5d3'
const heroEllipse4 = 'https://www.figma.com/api/mcp/asset/c31d8d2e-032c-42c1-90ad-576563f8c6c7'
const heroEllipse5 = 'https://www.figma.com/api/mcp/asset/83a3d8e4-0fed-4f71-a3dc-985cb88a65cc'

const consultants = [
  { id: 'antonio', name: 'António Portugal', role: 'Consultor', area: 'LowCode (Outsystems)', serviceLine: 'Hybrid Cloud', learningPath: 'Jornada Técnica', points: 550, email: 'antoniopt@gmail.com' },
  { id: 'austin', name: 'Austin Robertson', role: 'Service Line Lider', area: 'Cloud Architecture', serviceLine: 'Hybrid Cloud', learningPath: 'Arquitetura Cloud', points: 620, email: 'austin.robertson@softinsa.pt' },
  { id: 'ana', name: 'Ana Martins', role: 'Consultora', area: 'Automation', serviceLine: 'Digital Workplace', learningPath: 'Automação', points: 480, email: 'ana.martins@softinsa.pt' },
]

const badges = [
  { id: 'badge-1', name: 'Citzen Developer', image: badgeEntryLevel },
  { id: 'badge-2', name: 'Team Lider Beginner', image: badgeTeamLeader },
  { id: 'badge-3', name: 'DevOps Intermidiate', image: badgeDevOps },
  { id: 'badge-4', name: 'Cloud Architect', image: badgeEntryLevel },
  { id: 'badge-5', name: 'Agile Leadership', image: badgeTeamLeader },
  { id: 'badge-6', name: 'Security Expert', image: badgeDevOps },
]

function BadgeOption({ badge, selected, onClick }) {
  return (
    <button type="button" className={`sll-certificates-badge-option${selected ? ' is-selected' : ''}`} onClick={onClick}>
      <img src={badge.image} alt="" aria-hidden="true" />
      <span>{badge.name}</span>
    </button>
  )
}

function SLLCertificadosView() {
  const [selectedConsultantId, setSelectedConsultantId] = useState('antonio')
  const [selectedBadgeId, setSelectedBadgeId] = useState('badge-1')
  const [previewConsultantId, setPreviewConsultantId] = useState('antonio')
  const [previewBadgeId, setPreviewBadgeId] = useState('badge-1')
  const [hasPreview, setHasPreview] = useState(false)

  const selectedConsultant = useMemo(
    () => consultants.find((consultant) => consultant.id === selectedConsultantId) ?? consultants[0],
    [selectedConsultantId]
  )
  const selectedBadge = useMemo(() => badges.find((badge) => badge.id === selectedBadgeId) ?? badges[0], [selectedBadgeId])
  const previewConsultant = useMemo(
    () => consultants.find((consultant) => consultant.id === previewConsultantId) ?? consultants[0],
    [previewConsultantId]
  )
  const previewBadge = useMemo(() => badges.find((badge) => badge.id === previewBadgeId) ?? badges[0], [previewBadgeId])

  function handleVisualizeCertificate() {
    setPreviewConsultantId(selectedConsultantId)
    setPreviewBadgeId(selectedBadgeId)
    setHasPreview(true)
  }

  function downloadPdf() {
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
    documentPdf.text(previewConsultant.name.toUpperCase(), centerX, cardY + 70, { align: 'center' })

    documentPdf.setTextColor(138, 146, 166)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(10)
    documentPdf.text('conquistou com sucesso o badge', centerX, cardY + 82, { align: 'center' })

    documentPdf.setTextColor(37, 67, 109)
    documentPdf.setFont('helvetica', 'bold')
    documentPdf.setFontSize(15)
    const badgeLines = documentPdf.splitTextToSize(previewBadge.name, 95)
    documentPdf.text(badgeLines, centerX, cardY + 94, { align: 'center' })

    documentPdf.setTextColor(75, 85, 99)
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(9)
    documentPdf.text(`Nível: Junior | Área: ${previewConsultant.area}`, centerX, cardY + 110, { align: 'center' })
    documentPdf.text(`Service Line: ${previewConsultant.serviceLine}`, centerX, cardY + 118, { align: 'center' })

    documentPdf.setTextColor(138, 146, 166)
    documentPdf.setFontSize(9)
    documentPdf.text('Emitido em 15 de março de 2024', centerX, cardY + 131, { align: 'center' })

    documentPdf.setDrawColor(138, 146, 166)
    documentPdf.setLineWidth(0.4)
    documentPdf.line(centerX - 48, cardY + 145, centerX + 48, cardY + 145)

    documentPdf.setTextColor(138, 146, 166)
    documentPdf.setFont('helvetica', 'italic')
    documentPdf.setFontSize(8)
    documentPdf.text('Service Line Leader', centerX, cardY + 151, { align: 'center' })
    documentPdf.setFont('helvetica', 'normal')
    documentPdf.setFontSize(8)
    documentPdf.text('Softinsa - Sistemas de Informacao', centerX, cardY + 158, { align: 'center' })

    documentPdf.save('certificado-badge.pdf')
  }

  return (
    <div className="sll-certificates-page">
      <SLLSidebar />

      <main className="sll-certificates-main">
        <SLLTopbar />

        <div className="sll-certificates-content">
          <section className="sll-certificates-hero" aria-label="Certificados de Badges">
            <div className="sll-certificates-hero-art" aria-hidden="true">
              <img className="sll-certificates-hero-circle sll-certificates-hero-circle-5" src={heroEllipse5} alt="" />
              <img className="sll-certificates-hero-circle sll-certificates-hero-circle-4" src={heroEllipse4} alt="" />
              <img className="sll-certificates-hero-circle sll-certificates-hero-circle-3" src={heroEllipse3} alt="" />
              <img className="sll-certificates-hero-circle sll-certificates-hero-circle-2" src={heroEllipse2} alt="" />
              <img className="sll-certificates-hero-circle sll-certificates-hero-circle-1" src={heroEllipse1} alt="" />
            </div>

            <div className="sll-certificates-hero-copy">
              <h1>Certificados de Badges</h1>
              <p>Cria e exporta certificados de badges personalizados</p>
            </div>
          </section>

          <section className="sll-certificates-layout" aria-label="Configuração do certificado">
            <article className="sll-certificates-form-card">
              <h2>Selecionar Dados</h2>

              <div className="sll-certificates-field">
                <label>Consultor:</label>
                <div className="sll-certificates-select-wrap">
                  <select value={selectedConsultantId} onChange={(event) => setSelectedConsultantId(event.target.value)}>
                    <option value="">Selecione o consultor</option>
                    {consultants.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sll-certificates-field">
                <label>Badge:</label>
                <div className="sll-certificates-select-wrap">
                  <select value={selectedBadgeId} onChange={(event) => setSelectedBadgeId(event.target.value)}>
                    <option value="">Selecione o badge</option>
                    {badges.map((badge) => (
                      <option key={badge.id} value={badge.id}>
                        {badge.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="button" className="sll-certificates-visualize-btn" onClick={handleVisualizeCertificate}>
                Visualizar Certificado
              </button>

              <button type="button" className="sll-certificates-download-btn" onClick={downloadPdf}>
                <FaUpload aria-hidden="true" />
                <span>Descarregar PDF</span>
              </button>
            </article>

            <article className="sll-certificates-preview-card">
              <h2>Pre-visualização</h2>

              <div className="sll-certificates-preview">
                {!hasPreview ? (
                  <div className="sll-certificates-preview-empty">
                    <img src={profileAvatar} alt="" aria-hidden="true" />
                    <p>Selecione um consultor e um badge para visualizar o certificado</p>
                  </div>
                ) : (
                  <div className="sll-certificates-preview-canvas">
                    <div className="sll-certificates-certificate">
                      <div className="sll-certificates-certificate-topbar" aria-hidden="true">
                        <span className="sll-certificates-certificate-logo">SOF<span>TI</span>NSA</span>
                      </div>

                      <div className="sll-certificates-certificate-body">
                        <h3>CERTIFICADO DE CONQUISTA</h3>
                        <span className="sll-certificates-certificate-rule" aria-hidden="true" />

                        <p className="sll-certificates-certificate-kicker">Certifica-se que</p>
                        <p className="sll-certificates-certificate-name">{previewConsultant.name.toUpperCase()}</p>
                        <p className="sll-certificates-certificate-copy">conquistou com sucesso o badge</p>
                        <p className="sll-certificates-certificate-badge">{previewBadge.name}</p>

                        <p className="sll-certificates-certificate-meta">
                          Nível: Junior | Área: {previewConsultant.area}
                        </p>
                        <p className="sll-certificates-certificate-meta">
                          Service Line: {previewConsultant.serviceLine}
                        </p>

                        <p className="sll-certificates-certificate-date">
                          Emitido em 15 de março de 2024
                        </p>

                        <div className="sll-certificates-certificate-signature-rule" aria-hidden="true" />
                        <p className="sll-certificates-certificate-signature">Service Line Leader</p>
                        <p className="sll-certificates-certificate-company">Softinsa - Sistemas de Informacao</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SLLCertificadosView
