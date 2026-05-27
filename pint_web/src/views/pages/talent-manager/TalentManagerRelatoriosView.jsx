import { useEffect, useState } from 'react'
import './TalentManagerRelatoriosView.css'

import { getAreas } from '../../../controllers/areasController'
import { getRelatorio } from '../../../controllers/gestaoController'


const calendarIcon = 'https://www.figma.com/api/mcp/asset/3d4c9dd9-6d87-4575-baf8-e93232ba25fd'
const selectArrow = 'https://www.figma.com/api/mcp/asset/3ccd3cf8-7fc5-47f6-9509-a387af5d81f7'


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

function SelectArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M1 1L9 9L17 1" stroke="#8a92a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const summaryCards = [
  { label: 'Total de Badges', key: 'total' },
  { label: 'Badges Aprovados', key: 'approved' },
  { label: 'Badges Rejeitados', key: 'rejected' },
  { label: 'Taxa de Aprovação', key: 'approvalRate' },
]

const areaChartLabels = [
  { tone: 'is-dark', className: 'is-top-right' },
  { tone: 'is-medium', className: 'is-left' },
  { tone: 'is-light', className: 'is-bottom-right' },
]

const levelChartLabels = [
  { tone: 'is-dark', className: 'is-top-right' },
  { tone: 'is-medium', className: 'is-left' },
  { tone: 'is-light', className: 'is-bottom-right' },
]

const PIE_COLORS = ['#1E3A5F', '#39639C', '#7A9CCD', '#5B8DB8', '#A8C4E0']

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
}

function PieChartCard({ title, data }) {
  const VW = 200
  const VH = 200
  const cx = VW / 2
  const cy = VH / 2
  const r = 95

  let currentAngle = 0
  const segments = (data ?? []).map((item, i) => {
    const sweep = (item.percentagem / 100) * 360
    const start = currentAngle
    currentAngle += sweep
    return {
      ...item,
      start,
      end: currentAngle,
      mid: start + sweep / 2,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }
  })

  return (
    <article className="sll-relatorios-chart-card">
      <h3>{title}</h3>

      <div className="sll-relatorios-chart-visual">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="sll-relatorios-pie-svg" aria-hidden="true">
          {segments.length === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" />
          ) : (
            segments.map((seg, i) => (
              <path
                key={i}
                d={arcPath(cx, cy, r, seg.start, seg.end)}
                fill={seg.color}
                stroke="white"
                strokeWidth="2"
              />
            ))
          )}
        </svg>

        {segments.length > 0 && (
          <ul className="sll-relatorios-chart-legend" aria-label="Legenda">
            {segments.map((seg, i) => (
              <li key={i} className="sll-relatorios-chart-legend-item">
                <span
                  className="sll-relatorios-chart-legend-dot"
                  style={{ background: seg.color }}
                  aria-hidden="true"
                />
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

function TalentManagerRelatoriosView() {
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


  async function handleGerarRelatorio() {
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

  const summaryValues = {
    total: reportData?.resumo?.total_badges ?? 0,
    approved: reportData?.resumo?.badges_aprovados ?? 0,
    rejected: reportData?.resumo?.badges_rejeitados ?? 0,
    approvalRate: `${reportData?.resumo?.taxa_aprovacao ?? 0}%`,
  }

  const areaLabels =
    reportData?.distribuicao_por_area?.map((item, i) => ({
      text: `${item.nome} ${item.percentagem}%`,
      tone: areaChartLabels[i % areaChartLabels.length].tone,
      className: areaChartLabels[i % areaChartLabels.length].className,
    })) ?? []

  const levelLabels =
    reportData?.distribuicao_por_nivel?.map((item, i) => ({
      text: `${item.nome} ${item.percentagem}%`,
      tone: levelChartLabels[i % levelChartLabels.length].tone,
      className: levelChartLabels[i % levelChartLabels.length].className,
    })) ?? []

  const reportRows = reportData?.detalhes ?? []

  const reportAreaOptions = areas.map((a) => ({ id: a.id_area, nome: a.nome_area }))

  if (loadingAreas) return <div className="sll-relatorios-page"><p>A carregar...</p></div>
  if (error) return <div className="sll-relatorios-page"><p>{error}</p></div>

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
                <p>Selecione os filtros e clique em "Gerar Relatório"</p>
              </div>
            </div>

            <div className="sll-relatorios-filters-row">
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

              <button
                type="button"
                className="sll-relatorios-generate-btn"
                onClick={handleGerarRelatorio}
                disabled={loadingRelatorio}
              >
                {loadingRelatorio ? 'A gerar...' : 'Gerar Relatório'}
              </button>
            </div>
          </section>

          <section className="sll-relatorios-summary-grid" aria-label="Resumo de relatórios">
            {summaryCards.map((card) => (
              <StatCard key={card.label} label={card.label} value={summaryValues[card.key]} />
            ))}
          </section>

          <section className="sll-relatorios-charts-grid" aria-label="Distribuição de badges">
            <PieChartCard
              title="Distribuição de Badges Aprovados por Área"
              data={reportData?.distribuicao_por_area ?? []}
            />
            <PieChartCard
              title="Distribuição de Badges Aprovados por Nível"
              data={reportData?.distribuicao_por_nivel ?? []}
            />
          </section>

          <section className="sll-relatorios-table-card" aria-label="Detalhes por Área e Nível">
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
                          ? 'Selecione os filtros para obter mais resultados'
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

export default TalentManagerRelatoriosView