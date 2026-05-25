import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import "./admin-pedidos.css";

import { getPedidos, slReview } from '../../../controllers/pedidosController'


const ESTADO_LABEL = {
  1: 'Pendente', 2: 'Pendente',
  3: 'Devolvido', 4: 'Aprovado',
  5: 'Rejeitado', 6: 'Devolvido',
}

function resolveImage(raw) {
  if (!raw) return null
  if (raw.startsWith('data:') || raw.startsWith('http')) return raw
  return `data:image/png;base64,${raw}`
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '-- / -- / --'
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function normalizePedidoAdmin(row) {
  const estado = row.estado_atual ?? 1
  const badge = row.Badge ?? {}
  const utilizador = row.Consultore?.Utilizadore ?? {}
  return {
    id: row.id_pedido_badge,
    consultor: utilizador.nome_utilizador ?? `Consultor ${row.id_consultor}`,
    badgeName: badge.nome_badge ?? `Badge ${row.id_badge}`,
    badgeImage: resolveImage(badge.imagem_badge),
    dataAquisicao: estado === 4 ? formatDisplayDate(row.updatedAt) : '-- / -- / --',
    estado: ESTADO_LABEL[estado] ?? 'Pendente',
    avatar: resolveImage(utilizador.imagem_utilizador),
    estado_atual: estado,
  }
}



const getDefaultFilterDraft = () => ({
  estado: "",
  badge: "",
  dataAquisicaoInicio: "",
  dataAquisicaoFim: "",
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getTodayDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDisplayDate = (value) => {
  if (!value || value.includes("--")) {
    return null;
  }

  const [day, month, year] = value
    .split("/")
    .map((piece) => Number(String(piece).replace(/\D/g, "")));

  if (!day || !month || !year) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const parseInputDate = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!day || !month || !year) {
    return null;
  }

  return new Date(year, month - 1, day);
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-pedidos-icon" aria-hidden="true">
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-pedidos-icon" aria-hidden="true">
      <path
        d="M4 5H20L13 13V19L11 20V13L4 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-pedidos-icon" aria-hidden="true">
      <path
        d="M12 15V5M12 5L8.5 8.5M12 5L15.5 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-pedidos-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SelectArrowIcon() {
  return (
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-pedidos-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="softinsa-pedidos-action-icon" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#08A045" />
      <path d="M5.2 8.15L7.05 10L10.8 6.25" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RejectIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="softinsa-pedidos-action-icon" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#E74C3C" />
      <path d="M5.4 5.4L10.6 10.6M10.6 5.4L5.4 10.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const SoftinsaPedidos = memo(() => {
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingReject, setPendingReject] = useState(null)
  const [rejectMotivo, setRejectMotivo] = useState('')
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [exportFormat, setExportFormat] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const filterWrapRef = useRef(null);

  const hasActiveFilters = Boolean(
    activeFilters.estado ||
    activeFilters.badge ||
    activeFilters.dataAquisicaoInicio ||
    activeFilters.dataAquisicaoFim
  );
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesStatus = !activeFilters.estado || pedido.estado === activeFilters.estado;
    const matchesBadge = !activeFilters.badge || pedido.badgeName === activeFilters.badge;
    const pedidoDate = parseDisplayDate(pedido.dataAquisicao);
    const startDate = parseInputDate(activeFilters.dataAquisicaoInicio);
    const endDate = parseInputDate(activeFilters.dataAquisicaoFim);
    const matchesDate =
      (!startDate && !endDate) ||
      (pedidoDate && (!startDate || pedidoDate >= startDate) && (!endDate || pedidoDate <= endDate));
    const searchableValue = normalizeSearchValue(`${pedido.consultor} ${pedido.badgeName}`);
    const matchesSearch = !normalizedSearchTerm || searchableValue.includes(normalizedSearchTerm);
    return matchesStatus && matchesBadge && matchesDate && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPedidos.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedPedidos = filteredPedidos.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const statusOptions = useMemo(() => [...new Set(pedidos.map(p => p.estado))], [pedidos])
  const badgeOptions = useMemo(() => [...new Set(pedidos.map(p => p.badgeName))], [pedidos])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await getPedidos()
        const rows = Array.isArray(data) ? data : []
        setPedidos(rows.map(normalizePedidoAdmin))
      } catch (err) {
        console.error('Erro ao carregar pedidos admin', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && filterWrapRef.current && !filterWrapRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
        setIsExportAlertOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleToggleFilter = () => {
    setFilterDraft(activeFilters);
    setIsExportAlertOpen(false);
    setIsFilterOpen((previous) => !previous);
  };

  const handleFilterDraftChange = (field, value) => {
    setFilterDraft((previous) => ({ ...previous, [field]: value }));
  };

  const handleApplyFilters = () => {
    setActiveFilters(filterDraft);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = getDefaultFilterDraft();
    setFilterDraft(clearedFilters);
    setActiveFilters(clearedFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleOpenExportAlert = () => {
    setIsFilterOpen(false);
    setExportFormat("");
    setIsExportAlertOpen(true);
  };

  const handleCloseExportAlert = () => {
    setIsExportAlertOpen(false);
    setExportFormat("");
  };

  const handleConfirmExport = async () => {
    if (!exportFormat) {
      return;
    }

    const rowsToExport = filteredPedidos.map((pedido) => ({
      Consultor: pedido.consultor,
      Badge: pedido.badgeName,
      "Data de Aquisição": pedido.dataAquisicao,
      Estado: pedido.estado,
    }));

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);

    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
        XLSX.writeFile(workbook, `pedidos-badges-${timestamp}.xlsx`);
      }

      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Pedidos de Badges", 14, 14);

        autoTable(doc, {
          startY: 20,
          head: [["Consultor", "Badge", "Data de Aquisição", "Estado"]],
          body: rowsToExport.map((row) => [row.Consultor, row.Badge, row["Data de Aquisição"], row.Estado]),
          styles: { fontSize: 9, cellPadding: 2.4 },
          headStyles: { fillColor: [58, 87, 232] },
        });

        doc.save(`pedidos-badges-${timestamp}.pdf`);
      }

      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      console.error("Erro ao exportar listagem de pedidos:", error);
    }
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) => Math.max(previousPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previousPage) => Math.min(previousPage + 1, totalPages));
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
  };

  async function handleDecision(id, nextStatus, motivo) {
    const acao = nextStatus === 'Aprovado' ? 'aprovar' : 'rejeitar'
    try {
      await slReview(id, { acao, ...(motivo ? { motivo } : {}) })
      setPedidos(prev => prev.map(p => {
        if (p.id !== id) return p
        return {
          ...p,
          estado: nextStatus,
          dataAquisicao: nextStatus === 'Aprovado' ? getTodayDate() : p.dataAquisicao,
        }
      }))
    } catch (err) {
      console.error('Erro ao processar pedido', err)
    }
  }

  return (
    <section className="softinsa-pedidos-page" data-node-id="3969:6401">
      <div className="softinsa-pedidos-hero" data-node-id="3969:6407">
        <h1>Pedidos de Badges</h1>
        <p>Visão global do estado de todos os pedidos de badges.</p>
      </div>

      <div className="softinsa-pedidos-toolbar" data-node-id="4104:9711">
        <label className="softinsa-pedidos-search" aria-label="Pesquisar pedidos">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por nome do consultor ,badge..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-pedidos-filter-wrap" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-pedidos-filter-btn"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-pedidos-filter-panel" role="dialog" aria-label="Filtro de pedidos">
              <div className="softinsa-pedidos-filter-field">
                <label htmlFor="softinsa-pedidos-filter-status">Estado</label>
                <div className="softinsa-pedidos-select-wrap softinsa-pedidos-filter-select-wrap">
                  <select
                    id="softinsa-pedidos-filter-status"
                    value={filterDraft.estado}
                    onChange={(event) => handleFilterDraftChange("estado", event.target.value)}
                  >
                    <option value="">Selecione o estado</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-pedidos-filter-field">
                <label htmlFor="softinsa-pedidos-filter-badge">Badge</label>
                <div className="softinsa-pedidos-select-wrap softinsa-pedidos-filter-select-wrap">
                  <select
                    id="softinsa-pedidos-filter-badge"
                    value={filterDraft.badge}
                    onChange={(event) => handleFilterDraftChange("badge", event.target.value)}
                  >
                    <option value="">Selecione o badge</option>
                    {badgeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-pedidos-filter-field">
                <label>Data Aquisição</label>
                <div className="softinsa-pedidos-date-range-wrap" data-node-id="4438:3212">
                  <input
                    type="date"
                    className="softinsa-pedidos-date-input"
                    aria-label="Data de aquisição início"
                    value={filterDraft.dataAquisicaoInicio}
                    onChange={(event) => handleFilterDraftChange("dataAquisicaoInicio", event.target.value)}
                  />
                  <span className="softinsa-pedidos-date-range-separator">até</span>
                  <input
                    type="date"
                    className="softinsa-pedidos-date-input"
                    aria-label="Data de aquisição fim"
                    value={filterDraft.dataAquisicaoFim}
                    onChange={(event) => handleFilterDraftChange("dataAquisicaoFim", event.target.value)}
                  />
                </div>
              </div>

              <div className="softinsa-pedidos-filter-actions">
                <button type="button" className="softinsa-pedidos-filter-clear" onClick={handleClearFilters}>
                  Limpar
                </button>
                <button type="button" className="softinsa-pedidos-filter-submit" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="softinsa-pedidos-table-meta" data-node-id="4123:15751">
        <span>Mostrar</span>
        <div className="softinsa-pedidos-entries-select-wrap">
          <select
            className="softinsa-pedidos-entries-select"
            value={entriesPerPage}
            onChange={handleEntriesChange}
            aria-label="Quantidade de entradas por página"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="softinsa-pedidos-entries-arrow" aria-hidden="true">
            ▾
          </span>
        </div>
        <span>Entradas</span>
        {hasActiveFilters ? (
          <button type="button" className="softinsa-pedidos-clear-filter-inline" onClick={handleClearFilters}>
            Remover filtros
          </button>
        ) : null}
      </div>

      <div className="softinsa-pedidos-table-card" data-node-id="4433:4647">
        <div className="softinsa-pedidos-table-scroll">
          <table className="softinsa-pedidos-table" role="table" aria-label="Tabela de pedidos de badges">
            <thead>
              <tr>
                <th>CONSULTOR</th>
                <th>BADGE</th>
                <th>DATA DE AQUISIÇÃO</th>
                <th>ESTADO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPedidos.length > 0 ? (
                paginatedPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <div className="softinsa-pedidos-name-cell">
                        <img
                          src={pedido.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(pedido.consultor)}&size=32`}
                          alt={pedido.consultor}
                          className="softinsa-pedidos-avatar"
                        />
                        <span className="softinsa-pedidos-name">{pedido.consultor}</span>
                      </div>
                    </td>
                    <td>
                      {pedido.badgeImage
                        ? <img src={pedido.badgeImage} alt={pedido.badgeName} className="softinsa-pedidos-badge" />
                        : <span>{pedido.badgeName}</span>
                      }
                    </td>
                    <td className="softinsa-pedidos-date">{pedido.dataAquisicao}</td>
                    <td>
                      <span className={`softinsa-pedidos-status softinsa-pedidos-status-${pedido.estado.toLowerCase()}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>
                      {pedido.estado !== 'Aprovado' && pedido.estado !== 'Rejeitado' ? (
                        <div className="softinsa-pedidos-actions">
                          <button type="button" className="softinsa-pedidos-action-btn is-approve"
                            aria-label={`Aprovar pedido de ${pedido.consultor}`}
                            onClick={() => handleDecision(pedido.id, 'Aprovado', null)}>
                            <ApproveIcon />
                          </button>
                          <button type="button" className="softinsa-pedidos-action-btn is-reject"
                            aria-label={`Rejeitar pedido de ${pedido.consultor}`}
                            onClick={() => setPendingReject({ id: pedido.id })}>
                            <RejectIcon />
                          </button>
                        </div>
                      ) : (
                        <span className="softinsa-pedidos-actions-empty">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-pedidos-empty-row">
                  <td colSpan={5}>Sem pedidos para o filtro aplicado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pendingReject ? (
          <div className="softinsa-pedidos-modal-backdrop" role="presentation"
            onClick={() => { setPendingReject(null); setRejectMotivo('') }}>
            <div className="softinsa-pedidos-export-alert" role="dialog"
              aria-label="Rejeitar pedido"
              onClick={e => e.stopPropagation()}>
              <div className="softinsa-pedidos-export-alert-header">
                <h3>Rejeitar Pedido</h3>
                <button type="button" className="softinsa-pedidos-modal-close"
                  aria-label="Fechar"
                  onClick={() => { setPendingReject(null); setRejectMotivo('') }}>
                  <CloseIcon />
                </button>
              </div>
              <div className="softinsa-pedidos-export-alert-body">
                <h4>Indicar motivo</h4>
                <p>O motivo é obrigatório para rejeitar um pedido.</p>
                <textarea
                  style={{
                    width: '100%', minHeight: 80, marginTop: 12, padding: '8px 12px',
                    borderRadius: 6, border: '1px solid #dee2e6', fontSize: 14, resize: 'vertical'
                  }}
                  placeholder="Insira o motivo da rejeição..."
                  value={rejectMotivo}
                  onChange={e => setRejectMotivo(e.target.value)}
                />
              </div>
              <div className="softinsa-pedidos-export-alert-actions">
                <button type="button" className="softinsa-pedidos-export-cancel"
                  onClick={() => { setPendingReject(null); setRejectMotivo('') }}>
                  Cancelar
                </button>
                <button type="button"
                  className={`softinsa-pedidos-export-confirm${!rejectMotivo.trim() ? ' is-disabled' : ''}`}
                  disabled={!rejectMotivo.trim()}
                  onClick={async () => {
                    await handleDecision(pendingReject.id, 'Rejeitado', rejectMotivo.trim())
                    setPendingReject(null)
                    setRejectMotivo('')
                  }}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="softinsa-pedidos-table-footer">
          <button
            type="button"
            className="softinsa-pedidos-export-btn"
            aria-label="Exportar pedidos"
            onClick={handleOpenExportAlert}
          >
            <ExportIcon />
            <span>Exportar</span>
          </button>

          {totalPages > 1 ? (
            <div className="softinsa-pedidos-pagination" aria-label="Paginação">
              <button
                type="button"
                className={`softinsa-pedidos-page-link${currentPage === 1 ? " is-disabled" : ""}`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`softinsa-pedidos-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
                  onClick={() => handlePageSelect(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className={`softinsa-pedidos-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Próximo
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-pedidos-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div
            className="softinsa-pedidos-export-alert"
            role="dialog"
            aria-label="Alerta Exportar"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-pedidos-export-alert-header">
              <h3>Alerta</h3>
              <button
                type="button"
                className="softinsa-pedidos-modal-close"
                aria-label="Fechar alerta"
                onClick={handleCloseExportAlert}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="softinsa-pedidos-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>

              <button
                type="button"
                className="softinsa-pedidos-export-option"
                aria-pressed={exportFormat === "xlsx"}
                onClick={() => setExportFormat("xlsx")}
              >
                <span className={`softinsa-pedidos-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span>
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                className="softinsa-pedidos-export-option"
                aria-pressed={exportFormat === "pdf"}
                onClick={() => setExportFormat("pdf")}
              >
                <span className={`softinsa-pedidos-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span>
                <span>PDF (.pdf)</span>
              </button>
            </div>

            <div className="softinsa-pedidos-export-alert-actions">
              <button type="button" className="softinsa-pedidos-export-cancel" onClick={handleCloseExportAlert}>
                Cancelar
              </button>
              <button
                type="button"
                className={`softinsa-pedidos-export-confirm${!exportFormat ? " is-disabled" : ""}`}
                onClick={handleConfirmExport}
                disabled={!exportFormat}
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default SoftinsaPedidos;