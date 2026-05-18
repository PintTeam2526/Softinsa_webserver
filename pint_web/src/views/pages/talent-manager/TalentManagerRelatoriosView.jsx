import { useMemo, useState } from 'react'
import './TalentManagerRelatoriosView.css'

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
  { text: 'LowCode (Outsystems) 34%', tone: 'is-dark', className: 'is-top-right' },
  { text: 'DevOps 29%', tone: 'is-medium', className: 'is-left' },
  { text: 'Sourc. & Talent Manag.\n37%', tone: 'is-light', className: 'is-bottom-right' },
]

const levelChartLabels = [
  { text: 'Junior 40%', tone: 'is-dark', className: 'is-top-right' },
  { text: 'Intermédio 33%', tone: 'is-medium', className: 'is-left' },
  { text: 'Senior 27%', tone: 'is-light', className: 'is-bottom-right' },
]

const reportRows = [
  { area: 'LowCode (Outsystems)', junior: 32, intermediate: 28, senior: 25, total: 85 },
  { area: 'DevOps', junior: 28, intermediate: 24, senior: 20, total: 72 },
  { area: 'Sourc. & Talent Manag.', junior: 38, intermediate: 30, senior: 23, total: 91 },
]

const reportEntries = [
  { area: 'LowCode (Outsystems)', level: 'Junior', date: '2024-12-04', status: 'Aprovado' },
  { area: 'LowCode (Outsystems)', level: 'Junior', date: '2024-11-20', status: 'Aprovado' },
  { area: 'LowCode (Outsystems)', level: 'Intermédio', date: '2024-11-08', status: 'Aprovado' },
  { area: 'LowCode (Outsystems)', level: 'Senior', date: '2024-10-13', status: 'Rejeitado' },
  { area: 'DevOps', level: 'Junior', date: '2024-12-01', status: 'Aprovado' },
  { area: 'DevOps', level: 'Intermédio', date: '2024-11-15', status: 'Aprovado' },
  { area: 'DevOps', level: 'Senior', date: '2024-10-30', status: 'Aprovado' },
  { area: 'DevOps', level: 'Senior', date: '2024-09-17', status: 'Rejeitado' },
  { area: 'Sourc. & Talent Manag', level: 'Junior', date: '2024-12-06', status: 'Aprovado' },
  { area: 'Sourc. & Talent Manag', level: 'Intermédio', date: '2024-11-11', status: 'Aprovado' },
  { area: 'Sourc. & Talent Manag', level: 'Senior', date: '2024-10-22', status: 'Aprovado' },
  { area: 'Sourc. & Talent Manag', level: 'Senior', date: '2024-09-05', status: 'Rejeitado' },
]

const reportAreaOptions = [...new Set(reportEntries.map((entry) => entry.area))]

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

  const filteredAreaLabels = useMemo(() => {
    const approvedEntries = filteredEntries.filter((entry) => entry.status === 'Aprovado')
    const areaCounts = reportAreaOptions.map((area) => ({
      area,
      count: approvedEntries.filter((entry) => entry.area === area).length,
    }))
    const total = areaCounts.reduce((sum, item) => sum + item.count, 0) || 1

    return areaCounts.map((item, index) => ({
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
              labels={filteredAreaLabels}
            />
            <PieChartCard
              title="Distribuição de Badges Aprovados por Nível"
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