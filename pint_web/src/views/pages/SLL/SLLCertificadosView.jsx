import { useMemo, useState } from 'react'
import { FaSearch, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-certificados.css'

const profileAvatar = 'https://www.figma.com/api/mcp/asset/791e05ae-1993-432d-aa0a-a906a2c30856'
const badgeEntryLevel = 'https://www.figma.com/api/mcp/asset/41229589-8f50-47c3-8553-3b4939eafc0c'
const badgeTeamLeader = 'https://www.figma.com/api/mcp/asset/b4a91d17-1fb7-4a47-bc42-d9284b60851f'
const badgeDevOps = 'https://www.figma.com/api/mcp/asset/b1a47080-ecc6-400f-b8f3-775875949b31'
const heroEllipse1 = 'https://www.figma.com/api/mcp/asset/7c07a289-6ec6-49e2-955f-4dd9f9188a76'
const heroEllipse2 = 'https://www.figma.com/api/mcp/asset/efa7cf7c-a875-499d-86f3-d8d3f2d9df26'
const heroEllipse3 = 'https://www.figma.com/api/mcp/asset/7fa466ca-70d0-4457-ba36-37876b930bf3'
const heroEllipse4 = 'https://www.figma.com/api/mcp/asset/1e3d09b1-88c7-40f0-9657-4a1a3bf616b0'
const heroEllipse5 = 'https://www.figma.com/api/mcp/asset/89345bfb-8506-421d-a585-9bd652a610b7'

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
    const documentPdf = new jsPDF()

    documentPdf.setFontSize(18)
    documentPdf.text('Certificado de Badges', 20, 24)

    documentPdf.setFontSize(12)
    documentPdf.text(`Consultor: ${previewConsultant.name}`, 20, 42)
    documentPdf.text(`Badge: ${previewBadge.name}`, 20, 52)
    documentPdf.text(`Área: ${previewConsultant.area}`, 20, 62)
    documentPdf.text(`Service Line: ${previewConsultant.serviceLine}`, 20, 72)
    documentPdf.text(`Learning Path: ${previewConsultant.learningPath}`, 20, 82)
    documentPdf.text(`Email: ${previewConsultant.email}`, 20, 92)

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
                    <div className="sll-certificates-preview-header">
                      <div>
                        <p className="sll-certificates-preview-kicker">Certificado de Badges</p>
                        <h3>{previewConsultant.name}</h3>
                      </div>

                      <span className="sll-certificates-preview-points">{previewConsultant.points} pontos</span>
                    </div>

                    <div className="sll-certificates-preview-body">
                      <div className="sll-certificates-preview-avatar-wrap">
                        <img src={profileAvatar} alt={previewConsultant.name} />
                      </div>

                      <div className="sll-certificates-preview-info">
                        <p><strong>Consultor:</strong> {previewConsultant.name}</p>
                        <p><strong>Badge:</strong> {previewBadge.name}</p>
                        <p><strong>Área:</strong> {previewConsultant.area}</p>
                        <p><strong>Service Line:</strong> {previewConsultant.serviceLine}</p>
                        <p><strong>Learning Path:</strong> {previewConsultant.learningPath}</p>
                        <p><strong>Email:</strong> {previewConsultant.email}</p>
                      </div>
                    </div>

                    <div className="sll-certificates-preview-badges">
                      {badges.map((badge) => (
                        <BadgeOption
                          key={badge.id}
                          badge={badge}
                          selected={badge.id === selectedBadgeId}
                          onClick={() => setSelectedBadgeId(badge.id)}
                        />
                      ))}
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