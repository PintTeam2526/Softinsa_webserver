import { useEffect, useRef, useState } from 'react'
import { FaDownload, FaFileAlt, FaFilter, FaSearch, FaStar } from 'react-icons/fa'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-pendentes.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/288fce76-e128-4294-99a0-2da910fa598e'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/72189645-88a7-49c5-9d57-6e68bd098b5b'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/cdd091b5-b5e5-4ef4-8207-d871d25984d9'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/95830a8c-9cec-42b8-9e1c-40587c2a28eb'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/5736997c-a9f9-48f5-b679-0a4d5b6a8abc'

const pendingRequests = [
  {
    title: 'Data Analytics - Sénior',
    consultant: 'Maria Santos',
    deadline: 'Tempo limite de resposta termina em 5 dias',
    avatar: 'DA',
    avatarTone: 'primary',
    requirements: [
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
    ],
    documents: ['Evidência 1', 'Evidência 2', 'Evidência 3'],
  },
  {
    title: 'Cloud Architecture - Intermédio',
    consultant: 'João Silva',
    deadline: 'Tempo limite de resposta termina em 10 dias',
    avatar: 'CA',
    avatarTone: 'secondary',
    requirements: [
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
    ],
    documents: ['Evidência 1', 'Evidência 2', 'Evidência 3'],
  },
  {
    title: 'Agile Leadership - Júnior',
    consultant: 'Pedro Costa',
    deadline: 'Tempo limite de resposta termina em 10 dias',
    avatar: 'AL',
    avatarTone: 'dark',
    requirements: [
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
    ],
    documents: ['Evidência 1', 'Evidência 2', 'Evidência 3'],
  },
]

function RequestBadge({ tone, children }) {
  return <div className={`sll-pending-request-avatar is-${tone}`}>{children}</div>
}

function PendingRequestCard({ request }) {
  return (
    <article className="sll-pending-card">
      <div className="sll-pending-card-head">
        <RequestBadge tone={request.avatarTone}>{request.avatar}</RequestBadge>

        <div className="sll-pending-card-head-copy">
          <h3>{request.title}</h3>
          <p>{request.consultant}</p>
          <div className="sll-pending-deadline">
            <FaFileAlt aria-hidden="true" />
            <span>{request.deadline}</span>
          </div>
        </div>
      </div>

      <div className="sll-pending-card-body">
        <div className="sll-pending-requirements">
          {request.requirements.map((requirement, index) => (
            <div className="sll-pending-requirement-row" key={`${request.title}-${index}`}>
              <div className="sll-pending-requirement-copy">
                <strong>Requisito {index + 1}</strong>
                <span>{requirement}</span>
              </div>
              <div className="sll-pending-requirement-star" aria-hidden="true">
                <FaStar />
              </div>
            </div>
          ))}
        </div>

        <div className="sll-pending-documents">
          <h4>Documentos Anexados</h4>

          <div className="sll-pending-documents-list">
            {request.documents.map((documentName) => (
              <div className="sll-pending-document-item" key={`${request.title}-${documentName}`}>
                <div className="sll-pending-document-main">
                  <div className="sll-pending-document-icon" aria-hidden="true">
                    <FaFileAlt />
                  </div>
                  <div>
                    <strong>{documentName}</strong>
                    <span>2.5 MB</span>
                  </div>
                </div>
                <button type="button" className="sll-pending-document-download" aria-label={`Descarregar ${documentName}`}>
                  <FaDownload />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sll-pending-card-actions">
        <button type="button" className="sll-pending-action is-return">Devolver</button>
        <button type="button" className="sll-pending-action is-reject">Rejeitar</button>
        <button type="button" className="sll-pending-action is-accept">Aceitar</button>
      </div>
    </article>
  )
}

function SLLPendentesView() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterPopoverRef = useRef(null)

  useEffect(() => {
    function handleDocumentClick(event) {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)

    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  return (
    <div className="sll-pending-page">
      <SLLSidebar />

      <main className="sll-pending-main">
        <SLLTopbar />

        <div className="sll-pending-content">
          <section className="sll-pending-hero" aria-label="Pedidos pendentes">
            <div className="sll-pending-hero-art" aria-hidden="true">
              <img className="sll-pending-hero-circle sll-pending-hero-circle-5" src={heroCircle5} alt="" />
              <img className="sll-pending-hero-circle sll-pending-hero-circle-4" src={heroCircle4} alt="" />
              <img className="sll-pending-hero-circle sll-pending-hero-circle-3" src={heroCircle3} alt="" />
              <img className="sll-pending-hero-circle sll-pending-hero-circle-2" src={heroCircle2} alt="" />
              <img className="sll-pending-hero-circle sll-pending-hero-circle-1" src={heroCircle1} alt="" />
            </div>

            <div className="sll-pending-hero-copy">
              <h1>Pedidos pendentes</h1>
              <p>Dá resposta aos pedidos que aguardam resposta</p>
            </div>
          </section>

          <section className="sll-pending-toolbar" aria-label="Pesquisar pedidos">
            <label className="sll-pending-search">
              <FaSearch aria-hidden="true" />
              <input type="text" placeholder="Pesquisar por nome do consultor ou badge..." />
            </label>

            <div className="sll-pending-filter-popover-wrap" ref={filterPopoverRef}>
              <button
                type="button"
                className="sll-pending-filter-btn"
                onClick={() => setIsFilterOpen((previousValue) => !previousValue)}
                aria-expanded={isFilterOpen}
                aria-haspopup="dialog"
              >
                <FaFilter aria-hidden="true" />
                <span>Filtro</span>
              </button>

              {isFilterOpen ? (
                <div className="sll-pending-filter-popover" role="dialog" aria-label="FiltroPedidosPendentes">
                  <div className="sll-pending-filter-field">
                    <label>Área</label>
                    <button type="button" className="sll-pending-filter-select">
                      <span>Selecione a Área</span>
                      <span className="sll-pending-filter-select-arrow" aria-hidden="true" />
                    </button>
                  </div>

                  <button type="button" className="sll-pending-filter-apply" onClick={() => setIsFilterOpen(false)}>
                    Filtrar
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="sll-pending-list" aria-label="Lista de pedidos pendentes">
            {pendingRequests.map((request) => (
              <PendingRequestCard key={request.title} request={request} />
            ))}
          </section>

          <div className="sll-pending-pagination" aria-label="Paginação">
            <button type="button">«</button>
            <button type="button">‹</button>
            <button type="button" className="is-active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">›</button>
            <button type="button">»</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SLLPendentesView
