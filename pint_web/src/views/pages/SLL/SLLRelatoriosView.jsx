import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-relatorios.css'

import { getAreas } from '../../../controllers/areasController'
import { getRelatorio } from '../../../controllers/gestaoController'

const summaryCards = [
  { label: 'Total de Badges', key: 'total' },
  { label: 'Badges Aprovados', key: 'approved' },
  { label: 'Badges Rejeitados', key: 'rejected' },
  { label: 'Taxa de Aprovação', key: 'approvalRate' },
]

const PIE_COLORS = ['#1E3A5F', '#39639C', '#7A9CCD', '#5B8DB8', '#A8C4E0']

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.99) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`
  }
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
}

function PieChartCard({ title, data }) {
  const VW = 200, VH = 200, cx = 100, cy = 100, r = 95

  let currentAngle = 0
  const segments = (data ?? []).map((item, i) => {
    const sweep = (item.percentagem / 100) * 360
    const start = currentAngle
    currentAngle += sweep
    return { ...item, start, end: currentAngle, color: PIE_COLORS[i % PIE_COLORS.length] }
  })

  return (
    <article className="sll-relatorios-chart-card">
      <h3>{title}</h3>
      <div className="sll-relatorios-chart-visual">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="sll-relatorios-pie-svg" aria-hidden="true">
          {segments.length === 0
            ? <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" />
            : segments.map((seg, i) => (
              <path key={i} d={arcPath(cx, cy, r, seg.start, seg.end)} fill={seg.color} stroke="white" strokeWidth="2" />
            ))
          }
        </svg>

        {segments.length > 0 && (
          <ul className="sll-relatorios-chart-legend" aria-label="Legenda">
            {segments.map((seg, i) => (
              <li key={i} className="sll-relatorios-chart-legend-item">
                <span className="sll-relatorios-chart-legend-dot" style={{ background: seg.color }} aria-hidden="true" />
                <span className="sll-relatorios-chart-legend-label">{seg.nome}</span>
                <span className="sll-relatorios-chart-legend-pct">{seg.percentagem}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

function StatCard({ label, value }) {
  return (
    <article className="sll-relatorios-stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="7" stroke="#8a92a6" strokeWidth="1" />
      <circle cx="7.5" cy="3.75" r="0.75" fill="#8a92a6" />
      <path d="M7.5 5.5V11" stroke="#8a92a6" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="#8a92a6" strokeWidth="1" />
      <path d="M2 6h14" stroke="#8a92a6" strokeWidth="1" />
      <path d="M6 1v4" stroke="#8a92a6" strokeWidth="1" strokeLinecap="round" />
      <path d="M12 1v4" stroke="#8a92a6" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function SLLRelatoriosView() {
  const [reportData, setReportData] = useState(null)
  const [loadingAreas, setLoadingAreas] = useState(true)
  const [loadingRelatorio, setLoadingRelatorio] = useState(false)
  const [error, setError] = useState(null)
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    getAreas()
      .then(setAreas)
      .catch(() => setError('Erro ao carregar áreas.'))
      .finally(() => setLoadingAreas(false))
  }, [])

  async function handleVisualizarEstatisticas() {
    setLoadingRelatorio(true)
    setError(null)
    try {
      const params = {}
      if (selectedArea) params.id_area = selectedArea
      if (startDate) params.data_inicio = startDate
      if (endDate) params.data_fim = endDate
      const data = await getRelatorio(params)
      setReportData(data)
    } catch {
      setError('Erro ao carregar relatório.')
    } finally {
      setLoadingRelatorio(false)
    }
  }

  async function handleGerarPdf() {
    setLoadingRelatorio(true)
    setError(null)
    try {
      const params = {}
      if (selectedArea) params.id_area = selectedArea
      if (startDate) params.data_inicio = startDate
      if (endDate) params.data_fim = endDate

      const data = reportData ?? await getRelatorio(params)

      const doc = new jsPDF()
      const pageW = doc.internal.pageSize.getWidth()
      const today = new Date().toLocaleDateString('pt-PT')
      let y = 16

      doc.setFillColor(57, 99, 156)
      doc.rect(0, 0, pageW, 28, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Relatório de Estatísticas de Badges', pageW / 2, 17, { align: 'center' })
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Emitido em ${today}`, pageW / 2, 24, { align: 'center' })
      y = 36

      const areaLabel = selectedArea
        ? (reportAreaOptions.find((a) => String(a.id) === String(selectedArea))?.nome ?? selectedArea)
        : 'Todas'
      doc.setTextColor(138, 146, 166)
      doc.setFontSize(9)
      doc.text(`Filtros: Área — ${areaLabel}  |  Data início — ${startDate || '—'}  |  Data fim — ${endDate || '—'}`, 14, y)
      y += 10

      doc.setTextColor(35, 45, 66)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('Resumo', 14, y)
      y += 4

      autoTable(doc, {
        startY: y,
        head: [['Total de Badges', 'Aprovados', 'Rejeitados', 'Taxa de Aprovação']],
        body: [[data.resumo.total_badges, data.resumo.badges_aprovados, data.resumo.badges_rejeitados, `${data.resumo.taxa_aprovacao}%`]],
        styles: { fontSize: 10, halign: 'center' },
        headStyles: { fillColor: [57, 99, 156] },
      })
      y = doc.lastAutoTable.finalY + 12

      doc.setFont('helvetica', 'bold').setFontSize(12)
      doc.text('Distribuição por Área', 14, y)
      y += 4
      autoTable(doc, {
        startY: y,
        head: [['Área', 'Total', 'Percentagem']],
        body: data.distribuicao_por_area.map((item) => [item.nome, item.total, `${item.percentagem}%`]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [57, 99, 156] },
      })
      y = doc.lastAutoTable.finalY + 12

      doc.setFont('helvetica', 'bold').setFontSize(12)
      doc.text('Distribuição por Nível', 14, y)
      y += 4
      autoTable(doc, {
        startY: y,
        head: [['Nível', 'Total', 'Percentagem']],
        body: data.distribuicao_por_nivel.map((item) => [item.nome, item.total, `${item.percentagem}%`]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [57, 99, 156] },
      })
      y = doc.lastAutoTable.finalY + 12

      doc.setFont('helvetica', 'bold').setFontSize(12)
      doc.text('Badges Aprovados por Área e Nível', 14, y)
      y += 4
      autoTable(doc, {
        startY: y,
        head: [['Área', 'Júnior', 'Intermédio', 'Sénior', 'Especialista', 'Líder de Conhecimento', 'Total']],
        body: data.detalhes.map((row) => [
          row.area,
          row['Júnior'] ?? 0,
          row['Intermédio'] ?? 0,
          row['Sénior'] ?? 0,
          row['Especialista'] ?? 0,
          row['Líder de Conhecimento'] ?? 0,
          row.total,
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [57, 99, 156] },
        columnStyles: { 0: { cellWidth: 40 } },
      })

      doc.save(`relatorio-badges-${today.replace(/\//g, '-')}.pdf`)
    } catch {
      setError('Erro ao gerar PDF.')
    } finally {
      setLoadingRelatorio(false)
    }
  }

  const summaryValues = {
    total: reportData?.resumo?.total_badges ?? 0,
    approved: reportData?.resumo?.badges_aprovados ?? 0,
    rejected: reportData?.resumo?.badges_rejeitados ?? 0,
    approvalRate: `${reportData?.resumo?.taxa_aprovacao ?? 0}%`,
  }

  const reportAreaOptions = areas.map((a) => ({ id: a.id_area, nome: a.nome_area }))
  const reportRows = reportData?.detalhes ?? []

  if (loadingAreas) return (
    <div className="sll-relatorios-page">
      <main className="sll-relatorios-main">
        <div className="sll-relatorios-content"><p>A carregar...</p></div>
      </main>
    </div>
  )

  if (error) return (
    <div className="sll-relatorios-page">
      <main className="sll-relatorios-main">
        <div className="sll-relatorios-content"><p>{error}</p></div>
      </main>
    </div>
  )

  return (
    <div className="sll-relatorios-page">
      <main className="sll-relatorios-main">
        <div className="sll-relatorios-content">
          <section className="sll-relatorios-hero" aria-label="Relatórios e Estatísticas">
            <div className="sll-relatorios-hero-copy">
              <h1>Relatórios e Estatísticas</h1>
              <p>Cria relatórios de badges atribuídos em função da área e do período</p>
            </div>
          </section>

          <section className="sll-relatorios-filters-card" aria-label="Filtros para Relatórios">
            <div className="sll-relatorios-filters-heading">
              <h2>Filtros para Relatórios</h2>
              <div className="sll-relatorios-filters-help">
                <InfoIcon />
                <p>Selecione os filtros e clique em "Visualizar Estatísticas" ou "Gerar Relatório"</p>
              </div>
            </div>

            <div className="sll-relatorios-filters-row flex-column flex-md-row align-items-stretch align-items-md-end">
              <div className="sll-relatorios-field">
                <label>Área:</label>
                <div className="sll-relatorios-select-wrap">
                  <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                    <option value="">Selecione a Área</option>
                    {reportAreaOptions.map((area) => (
                      <option key={area.id} value={area.id}>{area.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sll-relatorios-field">
                <label>Data Início:</label>
                <div className="sll-relatorios-date-input">
                  <span aria-hidden="true"><CalendarIcon /></span>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="Data início" />
                </div>
              </div>

              <div className="sll-relatorios-field">
                <label>Data Fim:</label>
                <div className="sll-relatorios-date-input">
                  <span aria-hidden="true"><CalendarIcon /></span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="Data fim" />
                </div>
              </div>

              <div className="sll-relatorios-actions">
                <button
                  type="button"
                  className="sll-relatorios-visualize-btn"
                  onClick={handleVisualizarEstatisticas}
                  disabled={loadingRelatorio}
                >
                  {loadingRelatorio ? 'A carregar...' : 'Visualizar Estatísticas'}
                </button>
                <button
                  type="button"
                  className="sll-relatorios-generate-btn"
                  onClick={handleGerarPdf}
                  disabled={loadingRelatorio}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{width:16,height:16,flexShrink:0}}>
                    <path opacity="0.4" d="M7.5 13.5H13.5V15H7.5V13.5ZM7.5 9.75H16.5V11.25H7.5V9.75ZM7.5 17.25H11.25V18.75H7.5V17.25Z" fill="currentColor" />
                    <path d="M18.75 3.75H16.5V3C16.5 2.60218 16.342 2.22064 16.0607 1.93934C15.7794 1.65804 15.3978 1.5 15 1.5H9C8.60218 1.5 8.22064 1.65804 7.93934 1.93934C7.65804 2.22064 7.5 2.60218 7.5 3V3.75H5.25C4.85218 3.75 4.47064 3.90804 4.18934 4.18934C3.90804 4.47064 3.75 4.85218 3.75 5.25V21C3.75 21.3978 3.90804 21.7794 4.18934 22.0607C4.47064 22.342 4.85218 22.5 5.25 22.5H18.75C19.1478 22.5 19.5294 22.342 19.8107 22.0607C20.092 21.7794 20.25 21.3978 20.25 21V5.25C20.25 4.85218 20.092 4.47064 19.8107 4.18934C19.5294 3.90804 19.1478 3.75 18.75 3.75ZM9 3H15V6H9V3ZM18.75 21H5.25V5.25H7.5V7.5H16.5V5.25H18.75V21Z" fill="currentColor" />
                  </svg>
                  <span>{loadingRelatorio ? 'A gerar...' : 'Gerar Relatório'}</span>
                </button>
              </div>
            </div>
          </section>

          <Row as="section" className="row-cols-2 row-cols-md-3 row-cols-xl-4 g-3" aria-label="Resumo de relatórios">
            {summaryCards.map((card) => (
              <Col key={card.label}>
                <StatCard label={card.label} value={summaryValues[card.key]} />
              </Col>
            ))}
          </Row>

          <Row as="section" className="g-4" aria-label="Distribuição de badges">
            <Col xs={12} md={6}>
              <PieChartCard title="Distribuição de Badges Aprovados por Área" data={reportData?.distribuicao_por_area ?? []} />
            </Col>
            <Col xs={12} md={6}>
              <PieChartCard title="Distribuição de Badges Aprovados por Nível" data={reportData?.distribuicao_por_nivel ?? []} />
            </Col>
          </Row>

          <section className="sll-relatorios-table-card" aria-label="Badges Aprovados por Área e Nível">
            <h2>Badges Aprovados por Área e Nível</h2>
            <div className="sll-relatorios-table-wrap">
              <table className="sll-relatorios-table">
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Júnior</th>
                    <th>Intermédio</th>
                    <th>Sénior</th>
                    <th>Especialista</th>
                    <th>Líder de Conhecimento</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#8a92a6' }}>
                        {reportData === null
                          ? 'Selecione os filtros para obter resultados'
                          : 'Sem resultados para os filtros selecionados'}
                      </td>
                    </tr>
                  ) : (
                    reportRows.map((row) => (
                      <tr key={row.area}>
                        <td>{row.area}</td>
                        <td>{row['Júnior'] ?? 0}</td>
                        <td>{row['Intermédio'] ?? 0}</td>
                        <td>{row['Sénior'] ?? 0}</td>
                        <td>{row['Especialista'] ?? 0}</td>
                        <td>{row['Líder de Conhecimento'] ?? 0}</td>
                        <td className="is-total">{row.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SLLRelatoriosView