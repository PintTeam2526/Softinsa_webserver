import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFilter, FaSearch, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'
import SLLPagination from '../../components/SLLPagination'
import './ConsultorPedidosView.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/d52bcef6-8633-4aef-a46d-620628b11422'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/015d6486-d269-4542-b2af-cbffe841b87a'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/a95d40bd-58a1-4651-b2be-51b95d3ff5d3'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/c31d8d2e-032c-42c1-90ad-576563f8c6c7'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/83a3d8e4-0fed-4f71-a3dc-985cb88a65cc'

// Mock data - substituir por chamada à API
const meusPedidosData = [
  {
    id: 1,
    title: 'Data Analytics - Sénior',
    area: 'Data',
    date: '10/11/2023',
    status: 'Aprovado',
    avatar: 'DA',
    avatarTone: 'primary',
  },
  {
    id: 2,
    title: 'Cloud Architecture - Intermédio',
    area: 'Cloud',
    date: '15/11/2023',
    status: 'Pendente',
    avatar: 'CA',
    avatarTone: 'secondary',
  },
  {
    id: 3,
    title: 'Agile Leadership - Júnior',
    area: 'Agile',
    date: '02/12/2023',
    status: 'Rejeitado',
    avatar: 'AL',
    avatarTone: 'dark',
  },
  {
    id: 4,
    title: 'Frontend Development - Pleno',
    area: 'Web',
    date: '20/12/2023',
    status: 'Pendente',
    avatar: 'FD',
    avatarTone: 'primary',
  },
]

function StatusBadge({ status }) {
  const statusConfig = {
    Aprovado: { icon: FaCheckCircle, className: 'is-approved' },
    Pendente: { icon: FaClock, className: 'is-pending' },
    Rejeitado: { icon: FaTimesCircle, className: 'is-rejected' },
  }

  const config = statusConfig[status] || statusConfig.Pendente
  const Icon = config.icon

  return (
    <div className={`consultor-pedidos-status ${config.className}`}>
      <Icon aria-hidden="true" />
      <span>{status}</span>
    </div>
  )
}

function PedidoCard({ pedido }) {
  return (
    <article className="consultor-pedidos-card">
      <div className="consultor-pedidos-card-head">
        <div className={`consultor-pedidos-avatar is-${pedido.avatarTone}`}>
          {pedido.avatar}
        </div>
        <div className="consultor-pedidos-card-head-copy">
          <h3>{pedido.title}</h3>
          <p>Área: {pedido.area}</p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <div className="consultor-pedidos-card-body">
        <div className="consultor-pedidos-info">
          <strong>Data do Pedido:</strong>
          <span>{pedido.date}</span>
        </div>
      </div>
    </article>
  )
}

function ConsultorPedidosView() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [draftStatus, setDraftStatus] = useState('')
  const [appliedStatus, setAppliedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const filterPopoverRef = useRef(null)

  const statusOptions = ['Aprovado', 'Pendente', 'Rejeitado']

  const filteredPedidos = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return meusPedidosData.filter((pedido) => {
      const searchableText = `${pedido.title} ${pedido.area}`.toLowerCase()
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)
      const matchesStatus = !appliedStatus || pedido.status === appliedStatus

      return matchesSearch && matchesStatus
    })
  }, [appliedStatus, searchTerm])

  const requestsPerPage = 3
  const totalPages = Math.max(1, Math.ceil(filteredPedidos.length / requestsPerPage))

  const paginatedPedidos = useMemo(() => {
    const startIndex = (currentPage - 1) * requestsPerPage
    return filteredPedidos.slice(startIndex, startIndex + requestsPerPage)
  }, [currentPage, filteredPedidos])

  useEffect(() => {
    setCurrentPage(1)
  }, [appliedStatus, searchTerm])

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    function handleDocumentClick(event) {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  useEffect(() => {
    if (isFilterOpen) {
      setDraftStatus(appliedStatus)
    }
  }, [appliedStatus, isFilterOpen])

  function applyFilter() {
    setAppliedStatus(draftStatus)
    setIsFilterOpen(false)
  }

  return (
    <div className="consultor-pedidos-content">
      <section className="consultor-pedidos-hero" aria-label="Os meus pedidos">
        <div className="consultor-pedidos-hero-art" aria-hidden="true">
          <img className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-5" src={heroCircle5} alt="" />
          <img className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-4" src={heroCircle4} alt="" />
          <img className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-3" src={heroCircle3} alt="" />
          <img className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-2" src={heroCircle2} alt="" />
          <img className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-1" src={heroCircle1} alt="" />
        </div>

        <div className="consultor-pedidos-hero-copy">
          <h1>Os Meus Pedidos</h1>
          <p>Acompanha o estado e histórico dos teus pedidos de badges</p>
        </div>
      </section>

      <section className="consultor-pedidos-toolbar" aria-label="Pesquisar pedidos">
        <label className="consultor-pedidos-search">
          <FaSearch aria-hidden="true" />
          <input
            type="text"
            placeholder="Pesquisar por nome do badge ou área..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="consultor-pedidos-filter-popover-wrap" ref={filterPopoverRef}>
          <button
            type="button"
            className="consultor-pedidos-filter-btn"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-expanded={isFilterOpen}
            aria-haspopup="dialog"
          >
            <FaFilter aria-hidden="true" />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="consultor-pedidos-filter-popover" role="dialog" aria-label="Filtro de Pedidos">
              <div className="consultor-pedidos-filter-field">
                <label>Estado</label>
                <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
                  <option value="">Todos os estados</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="consultor-pedidos-filter-apply" onClick={applyFilter}>
                Filtrar
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="consultor-pedidos-list" aria-label="Lista de pedidos">
        {paginatedPedidos.length > 0 ? (
          paginatedPedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
        ) : (
          <div className="consultor-pedidos-empty">Nenhum pedido encontrado.</div>
        )}
      </section>

      {totalPages > 1 && (
        <SLLPagination
          className="consultor-pedidos-pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          firstContent="«"
          previousContent="‹"
          nextContent="›"
          lastContent="»"
        />
      )}
    </div>
  )
}

export default ConsultorPedidosView