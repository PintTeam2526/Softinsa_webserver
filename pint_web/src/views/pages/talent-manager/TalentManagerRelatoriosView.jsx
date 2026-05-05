import { useMemo, useState } from 'react'
import './TalentManagerRelatoriosView.css'

const heroEllipse1 = 'https://www.figma.com/api/mcp/asset/d52bcef6-8633-4aef-a46d-620628b11422'
const heroEllipse2 = 'https://www.figma.com/api/mcp/asset/015d6486-d269-4542-b2af-cbffe841b87a'
const heroEllipse3 = 'https://www.figma.com/api/mcp/asset/a95d40bd-58a1-4651-b2be-51b95d3ff5d3'
const heroEllipse4 = 'https://www.figma.com/api/mcp/asset/c31d8d2e-032c-42c1-90ad-576563f8c6c7'
const heroEllipse5 = 'https://www.figma.com/api/mcp/asset/83a3d8e4-0fed-4f71-a3dc-985cb88a65cc'
const infoIcon = 'https://www.figma.com/api/mcp/asset/e9cb1122-307c-4ebc-938d-34bf0718335c'
const calendarIcon = 'https://www.figma.com/api/mcp/asset/3d4c9dd9-6d87-4575-baf8-e93232ba25fd'
const selectArrow = 'https://www.figma.com/api/mcp/asset/3ccd3cf8-7fc5-47f6-9509-a387af5d81f7'

const summaryCards = [
  { label: 'Total de Badges', key: 'total' },
  { label: 'Badges Aprovados', key: 'approved' },
  { label: 'Badges Rejeitados', key: 'rejected' },
  { label: 'Taxa de Aprovação', key: 'approvalRate' },
]

const areaChartSegments = [
  { value: 34, color: '#1e3a5f' },
  { value: 29, color: '#39639c' },
  { value: 37, color: '#7a9ccd' },
]

const levelChartSegments = [
  { value: 40, color: '#1e3a5f' },
  { value: 33, color: '#39639c' },
  { value: 27, color: '#7a9ccd' },
]

const areaChartLabels = [
  { text: 'LowCode (Outsystems) 34%', tone: 'is-dark', className: 'is-top-right' },
  { text: 'DevSecOps & IT Automation 29%', tone: 'is-medium', className: 'is-left' },
  { text: 'Sourcing & Talent Management\n37%', tone: 'is-light', className: 'is-bottom-right' },
]

const levelChartLabels = [
  { text: 'Junior 40%', tone: 'is-dark', className: 'is-top-right' },
  { text: 'Intermédio 33%', tone: 'is-medium', className: 'is-left' },
  { text: 'Senior 27%', tone: 'is-light', className: 'is-bottom-right' },
]

const reportRows = [
  { area: 'LowCode (Outsystems)', junior: 32, intermediate: 28, senior: 25, total: 85 },
  { area: 'DevSecOps & IT Automation', junior: 28, intermediate: 24, senior: 20, total: 72 },
  { area: 'Sourcing & Talent Management', junior: 38, intermediate: 30, senior: 23, total: 91 },
]

const reportEntries = [
  { area: 'LowCode (Outsystems)', level: 'Junior', date: '2024-12-04', status: 'Aprovado' },
  { area: 'LowCode (Outsystems)', level: 'Junior', date: '2024-11-20', status: 'Aprovado' },
  { area: 'LowCode (Outsystems)', level: 'Intermédio', date: '2024-11-08', status: 'Aprovado' },
  { area: 'LowCode (Outsystems)', level: 'Senior', date: '2024-10-13', status: 'Rejeitado' },
  { area: 'DevSecOps & IT Automation', level: 'Junior', date: '2024-12-01', status: 'Aprovado' },
  { area: 'DevSecOps & IT Automation', level: 'Intermédio', date: '2024-11-15', status: 'Aprovado' },
  { area: 'DevSecOps & IT Automation', level: 'Senior', date: '2024-10-30', status: 'Aprovado' },
  { area: 'DevSecOps & IT Automation', level: 'Senior', date: '2024-09-17', status: 'Rejeitado' },
  { area: 'Sourcing & Talent Management', level: 'Junior', date: '2024-12-06', status: 'Aprovado' },
  { area: 'Sourcing & Talent Management', level: 'Intermédio', date: '2024-11-11', status: 'Aprovado' },
  { area: 'Sourcing & Talent Management', level: 'Senior', date: '2024-10-22', status: 'Aprovado' },
  { area: 'Sourcing & Talent Management', level: 'Senior', date: '2024-09-05', status: 'Rejeitado' },
]

const reportAreaOptions = [...new Set(reportEntries.map((entry) => entry.area))]

function buildConicGradient(segments) {
  let current = 0

  return segments
    .map((segment) => {
      const start = current
      current += segment.value
      return `${segment.color} ${start}% ${current}%`
    })
    .join(', ')
}

function PieChartCard({ title, segments, labels }) {
  return (
    <article className="sll-relatorios-chart-card">
      <h3>{title}</h3>

      <div className="sll-relatorios-chart-visual" aria-hidden="true">
        <div className="sll-relatorios-pie" style={{ background: `conic-gradient(${buildConicGradient(segments)})` }} />
        <div className="sll-relatorios-pie-hole" />

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

function TalentManagerRelatoriosView() {
  const [selectedArea, setSelectedArea] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({
    area: '',
    startDate: '',
    endDate: '',
  })

  const filteredEntries = useMemo(() => {
    return reportEntries.filter((entry) => {
      const matchesArea = !appliedFilters.area || entry.area === appliedFilters.area
      const matchesStartDate = !appliedFilters.startDate || entry.date >= appliedFilters.startDate
      const matchesEndDate = !appliedFilters.endDate || entry.date <= appliedFilters.endDate

      return matchesArea && matchesStartDate && matchesEndDate
    })
  }, [appliedFilters.area, appliedFilters.endDate, appliedFilters.startDate])

  const summaryValues = useMemo(() => {
    const total = filteredEntries.length
    const approved = filteredEntries.filter((entry) => entry.status === 'Aprovado').length
    const rejected = filteredEntries.filter((entry) => entry.status === 'Rejeitado').length
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

    return {
      total,
      approved,
      rejected,
      approvalRate,
    }
  }, [filteredEntries])

  const filteredAreaChartSegments = useMemo(() => {
    const approvedEntries = filteredEntries.filter((entry) => entry.status === 'Aprovado')
    const areaCounts = reportAreaOptions.map((area) => ({
      area,
      count: approvedEntries.filter((entry) => entry.area === area).length,
    }))
    const total = areaCounts.reduce((sum, item) => sum + item.count, 0) || 1

    return areaCounts.map((item, index) => ({
      value: Math.round((item.count / total) * 100),
      color: areaChartSegments[index].color,
    }))
  }, [filteredEntries])

  const filteredLevelChartSegments = useMemo(() => {
    const approvedEntries = filteredEntries.filter((entry) => entry.status === 'Aprovado')
    const levelOrder = ['Junior', 'Intermédio', 'Senior']
    const levelCounts = levelOrder.map((level) => ({
      level,
      count: approvedEntries.filter((entry) => entry.level === level).length,
    }))
    const total = levelCounts.reduce((sum, item) => sum + item.count, 0) || 1

    return levelCounts.map((item, index) => ({
      value: Math.round((item.count / total) * 100),
      color: levelChartSegments[index].color,
    }))
  }, [filteredEntries])

  const filteredAreaLabels = useMemo(() => {
    const approvedEntries = filteredEntries.filter((entry) => entry.status === 'Aprovado')
    const counts = reportAreaOptions.map((area) => ({
      area,
      count: approvedEntries.filter((entry) => entry.area === area).length,
    }))
    const total = counts.reduce((sum, item) => sum + item.count, 0) || 1

    return counts.map((item, index) => ({
      text: `${item.area} ${Math.round((item.count / total) * 100)}%`,
      tone: areaChartLabels[index].tone,
      className: areaChartLabels[index].className,
    }))
  }, [filteredEntries])

  const filteredLevelLabels = useMemo(() => {
    const approvedEntries = filteredEntries.filter((entry) => entry.status === 'Aprovado')
    const levelOrder = ['Junior', 'Intermédio', 'Senior']
    const counts = levelOrder.map((level) => ({
      level,
      count: approvedEntries.filter((entry) => entry.level === level).length,
    }))
    const total = counts.reduce((sum, item) => sum + item.count, 0) || 1

    return counts.map((item, index) => ({
      text: `${item.level} ${Math.round((item.count / total) * 100)}%`,
      tone: levelChartLabels[index].tone,
      className: levelChartLabels[index].className,
    }))
  }, [filteredEntries])

  const filteredReportRows = useMemo(() => {
    return reportRows.map((row) => {
      const approvedEntries = filteredEntries.filter((entry) => entry.status === 'Aprovado' && entry.area === row.area)
      const counts = {
        junior: approvedEntries.filter((entry) => entry.level === 'Junior').length,
        intermediate: approvedEntries.filter((entry) => entry.level === 'Intermédio').length,
        senior: approvedEntries.filter((entry) => entry.level === 'Senior').length,
      }

      return {
        area: row.area,
        junior: counts.junior,
        intermediate: counts.intermediate,
        senior: counts.senior,
        total: counts.junior + counts.intermediate + counts.senior,
      }
    })
  }, [filteredEntries])

  function applyFilters() {
    setAppliedFilters({
      area: selectedArea,
      startDate,
      endDate,
    })
  }

  return (
    <div className="sll-relatorios-page">
      <main className="sll-relatorios-main">
        <div className="sll-relatorios-content">
          <section className="sll-relatorios-hero" aria-label="Relatórios e Estatísticas">
            <div className="sll-relatorios-hero-art" aria-hidden="true">
              <img className="sll-relatorios-hero-circle sll-relatorios-hero-circle-5" src={heroEllipse5} alt="" />
              <img className="sll-relatorios-hero-circle sll-relatorios-hero-circle-4" src={heroEllipse4} alt="" />
              <img className="sll-relatorios-hero-circle sll-relatorios-hero-circle-3" src={heroEllipse3} alt="" />
              <img className="sll-relatorios-hero-circle sll-relatorios-hero-circle-2" src={heroEllipse2} alt="" />
              <img className="sll-relatorios-hero-circle sll-relatorios-hero-circle-1" src={heroEllipse1} alt="" />
            </div>

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
                  <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)}>
                    <option value="">
                      Selecione a área
                    </option>
                    {reportAreaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <img src={selectArrow} alt="" aria-hidden="true" className="sll-relatorios-select-arrow" />
                </div>
              </div>

              <div className="sll-relatorios-field">
                <label>Data início</label>
                <div className="sll-relatorios-date-input">
                  <span aria-hidden="true">
                    <img src={calendarIcon} alt="" />
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    aria-label="Data início"
                  />
                </div>
              </div>

              <div className="sll-relatorios-field">
                <label>Data fim</label>
                <div className="sll-relatorios-date-input">
                  <span aria-hidden="true">
                    <img src={calendarIcon} alt="" />
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    aria-label="Data fim"
                  />
                </div>
              </div>

              <button type="button" className="sll-relatorios-generate-btn" onClick={applyFilters}>
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
            <PieChartCard
              title="Distribuição de Badges Aprovados por Área"
              segments={filteredAreaChartSegments}
              labels={filteredAreaLabels}
            />
            <PieChartCard
              title="Distribuição de Badges Aprovados por Nível"
              segments={filteredLevelChartSegments}
              labels={filteredLevelLabels}
            />
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
                      <td>{row.junior}</td>
                      <td>{row.intermediate}</td>
                      <td>{row.senior}</td>
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