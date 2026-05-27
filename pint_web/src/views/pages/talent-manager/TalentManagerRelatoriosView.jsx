import { useEffect, useState, useMemo } from 'react'
import './TalentManagerRelatoriosView.css'

import { getAreas } from '../../../controllers/areasController'
import { getRelatorio } from '../../../controllers/gestaoController'

// ── constantes de UI (não são dados, não vêm da API) ───────────────────────────
const infoIcon = 'https://www.figma.com/api/mcp/asset/e9cb1122-307c-4ebc-938d-34bf0718335c'
const calendarIcon = 'https://www.figma.com/api/mcp/asset/3d4c9dd9-6d87-4575-baf8-e93232ba25fd'
const selectArrow = 'https://www.figma.com/api/mcp/asset/3ccd3cf8-7fc5-47f6-9509-a387af5d81f7'

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

// ── componentes ────────────────────────────────────────────────────────────────
function PieGraphic() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="161" height="161" viewBox="0 0 161 161" fill="none" aria-hidden="true" className="sll-relatorios-pie-svg">
      <path d="M160.5 80.5C160.5 66.0559 156.589 51.8813 149.183 39.4805C141.777 27.0797 131.152 16.9153 118.435 10.0661C105.718 3.2169 91.384 -0.0615638 76.9542 0.578633C62.5243 1.21883 48.537 5.7538 36.4766 13.7023L80.5 80.5H160.5Z" fill="#1E3A5F" stroke="white" />
      <path d="M36.4766 13.7021C26.2783 20.4234 17.7543 29.3906 11.5582 39.9162C5.36215 50.4419 1.65842 62.2465 0.730979 74.4252C-0.196466 86.604 1.677 98.8333 6.20777 110.176C10.7385 121.518 17.8063 131.673 26.8692 139.861L80.5 80.4999L36.4766 13.7021Z" fill="#39639C" stroke="white" />
      <path d="M26.8691 139.861C38.3536 150.237 52.6013 157.059 67.8851 159.499C83.1689 161.94 98.8325 159.894 112.977 153.611C127.122 147.328 139.14 137.076 147.575 124.099C156.01 111.123 160.5 95.9774 160.5 80.5H80.4999L26.8691 139.861Z" fill="#7A9CCD" stroke="white" />
    </svg>
  )
}

function PieChartCard({ title, labels }) {
  return (
    <article className="sll-relatorios-chart-card">
      <h3>{title}</h3>
      <div className="sll-relatorios-chart-visual" aria-hidden="true">
        <PieGraphic />
        {labels.map((label) => (
          <span key={label.text} className={`sll-relatorios-chart-label ${label.className} ${label.tone}`}>
            {label.text}
          </span>
        ))}
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

// ── view ───────────────────────────────────────────────────────────────────────
function TalentManagerRelatoriosView() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const [relatorioData, areasData] = await Promise.all([
          getRelatorio(),
          getAreas(),
        ])

        setReportData(relatorioData)
        setAreas(areasData)

      } catch (err) {
        console.log(err)
        setError('Erro ao carregar relatório.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredReportData = useMemo(() => {
    if (!reportData) return null

    let detalhes = [...(reportData.detalhes || [])]

    if (selectedArea) {
      const areaSelecionada = areas.find(
        (a) => String(a.id_area) === String(selectedArea)
      )

      if (areaSelecionada) {
        detalhes = detalhes.filter(
          (row) => row.area === areaSelecionada.nome_area
        )
      }
    }

    return {
      ...reportData,
      detalhes,
    }
  }, [reportData, selectedArea, areas])

  const summaryValues = {
    total: filteredReportData?.resumo?.total_badges || 0,
    approved: filteredReportData?.resumo?.badges_aprovados || 0,
    rejected: filteredReportData?.resumo?.badges_rejeitados || 0,
    approvalRate: `${filteredReportData?.resumo?.taxa_aprovacao || 0}%`,
  }

  const filteredAreaLabels =
    filteredReportData?.distribuicao_por_area?.map((item, index) => ({
      text: `${item.nome} ${item.percentagem}%`,
      tone: areaChartLabels[index % areaChartLabels.length].tone,
      className: areaChartLabels[index % areaChartLabels.length].className,
    })) || []

  const filteredLevelLabels =
    filteredReportData?.distribuicao_por_nivel?.map((item, index) => ({
      text: `${item.nome} ${item.percentagem}%`,
      tone: levelChartLabels[index % levelChartLabels.length].tone,
      className: levelChartLabels[index % levelChartLabels.length].className,
    })) || []

  const filteredReportRows = filteredReportData?.detalhes || []

  const reportAreaOptions =
    areas.map((area) => ({
      id: area.id_area,
      nome: area.nome_area,
    }))

  if (loading) return <div className="sll-relatorios-page"><p>A carregar...</p></div>
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
                <img src={infoIcon} alt="" aria-hidden="true" />
                <p>Selecione os filtros e clique em "Gerar Relatório"</p>
              </div>
            </div>

            <div className="sll-relatorios-filters-row">
              <div className="sll-relatorios-field">
                <label>Área</label>
                <div className="sll-relatorios-select-wrap">
                  <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                    <option value="">Selecione a área</option>
                    {reportAreaOptions.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nome}
                      </option>
                    ))}
                  </select>
                  <img src={selectArrow} alt="" aria-hidden="true" className="sll-relatorios-select-arrow" />
                </div>
              </div>

              <div className="sll-relatorios-field">
                <label>Data início</label>
                <div className="sll-relatorios-date-input">
                  <span aria-hidden="true"><img src={calendarIcon} alt="" /></span>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="Data início" />
                </div>
              </div>

              <div className="sll-relatorios-field">
                <label>Data fim</label>
                <div className="sll-relatorios-date-input">
                  <span aria-hidden="true"><img src={calendarIcon} alt="" /></span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="Data fim" />
                </div>
              </div>

              <button type="button" className="sll-relatorios-generate-btn">
                Gerar Relatório
              </button>
            </div>
          </section>

          <section className="sll-relatorios-summary-grid" aria-label="Resumo de relatórios">
            {summaryCards.map((card) => (
              <StatCard key={card.label} label={card.label} value={summaryValues[card.key]} />
            ))}
          </section>

          <section className="sll-relatorios-charts-grid" aria-label="Distribuição de badges">
            <PieChartCard title="Distribuição de Badges Aprovados por Área" labels={filteredAreaLabels} />
            <PieChartCard title="Distribuição de Badges Aprovados por Nível" labels={filteredLevelLabels} />
          </section>

          <section className="sll-relatorios-table-card" aria-label="Detalhes por Área e Nível">
            <h2>Detalhes por Área e Nível</h2>
            <div className="sll-relatorios-table-wrap">
              <table className="sll-relatorios-table">
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Junior</th>
                    <th>Intermédio</th>
                    <th>Senior</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportRows.map((row) => (
                    <tr key={row.area}>
                      <td>{row.area}</td>
                      <td>{row.Junior || 0}</td>
                      <td>{row['Intermédio'] || 0}</td>
                      <td>{row.Senior || 0}</td>
                      <td className="is-total">{row.total}</td>
                    </tr>
                  ))}
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