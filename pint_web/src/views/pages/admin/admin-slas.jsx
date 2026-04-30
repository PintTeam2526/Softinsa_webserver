import React, { memo, useEffect, useRef, useState } from "react";
import "./softinsa-slas.css";

// TODO: Replace all mock data and local options with API data (SLAs, statuses, and responsible teams).
const slasRows = [
  {
    id: 1,
    sla: "Validação TM",
    description: "Validar Documentos",
    responsible: "Talent Manager",
    status: "Ativo",
  },
  {
    id: 2,
    sla: "Aprovação SLL",
    description: "Validar TM",
    responsible: "Service Line Lider",
    status: "Não Ativo",
  },
  {
    id: 3,
    sla: "Retificação",
    description: "Corrigir Submissão",
    responsible: "Consultor",
    status: "Ativo",
  },
  {
    id: 4,
    sla: "Resolução Total",
    description: "Emissão de Badge",
    responsible: "Service Line Lider",
    status: "Ativo",
  },
  {
    id: 5,
    sla: "SendBack",
    description: "Pedido Devolvido",
    responsible: "Service Line Lider",
    status: "Ativo",
  },
  {
    id: 6,
    sla: "Suporte",
    description: "Resposta a Questões",
    responsible: "Talent Manager",
    status: "Ativo",
  },
];

const responsibleOptions = ["Talent Manager", "Service Line Lider", "Consultor"];
const statusOptions = ["Ativo", "Não Ativo"];

const getDefaultFilterDraft = () => ({
  status: "",
  responsible: "",
});

const getDefaultSlaForm = () => ({
  sla: "",
  description: "",
  responsible: "Talent Manager",
  deadline: "",
  status: "",
  emailNotification: true,
  pushNotification: true,
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-icon" aria-hidden="true">
      <path
        d="M4 5H20L13 13V19L11 20V13L4 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-icon" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="softinsa-slas-pencil-icon"
      aria-hidden="true"
    >
      <path
        d="M0 20V15.2778L14.6667 0.638889C14.8889 0.435185 15.1344 0.277778 15.4033 0.166667C15.6722 0.0555557 15.9544 0 16.25 0C16.5455 0 16.8326 0.0555557 17.1111 0.166667C17.3896 0.277778 17.6304 0.444444 17.8333 0.666667L19.3611 2.22222C19.5833 2.42593 19.7455 2.66667 19.8478 2.94444C19.95 3.22222 20.0007 3.5 20 3.77778C20 4.07407 19.9493 4.35667 19.8478 4.62556C19.7463 4.89444 19.5841 5.13963 19.3611 5.36111L4.72222 20H0ZM16.2222 5.33333L17.7778 3.77778L16.2222 2.22222L14.6667 3.77778L16.2222 5.33333Z"
        fill="#00B8E0"
      />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-icon" aria-hidden="true">
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

function SelectArrowIcon() {
  return (
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-slas-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-notify-icon-svg" aria-hidden="true">
      <path
        d="M20 6L13.03 10.425C12.7187 10.6204 12.3585 10.724 11.991 10.724C11.6235 10.724 11.2633 10.6204 10.952 10.425L4 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 6H20V18H4V6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-slas-notify-icon-svg" aria-hidden="true">
      <path
        d="M14.5 18C14.5 19.3807 13.3807 20.5 12 20.5C10.6193 20.5 9.5 19.3807 9.5 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 15.5H19L17.5 13.5V10C17.5 6.96243 15.0376 4.5 12 4.5C8.96243 4.5 6.5 6.96243 6.5 10V13.5L5 15.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SoftinsaSlas = memo(() => {
  const [slas, setSlas] = useState(slasRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingSlaId, setEditingSlaId] = useState(null);
  const [formData, setFormData] = useState(getDefaultSlaForm());
  const filterWrapRef = useRef(null);

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.status || activeFilters.responsible);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredSlas = slas.filter((item) => {
    const matchesStatus = !activeFilters.status || item.status === activeFilters.status;
    const matchesResponsible = !activeFilters.responsible || item.responsible === activeFilters.responsible;
    const searchableSla = normalizeSearchValue(`${item.sla} ${item.description}`);
    const matchesSearch = !normalizedSearchTerm || searchableSla.includes(normalizedSearchTerm);
    return matchesStatus && matchesResponsible && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSlas.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedSlas = filteredSlas.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

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
        setModalMode(null);
        setEditingSlaId(null);
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

  const handleFieldChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleOpenAddSla = () => {
    setFormData(getDefaultSlaForm());
    setEditingSlaId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditSla = (item) => {
    setFormData({
      sla: item.sla,
      description: item.description,
      responsible: item.responsible,
      deadline: item.deadline || "",
      status: item.status,
      emailNotification: item.emailNotification ?? true,
      pushNotification: item.pushNotification ?? true,
    });
    setEditingSlaId(item.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingSlaId(null);
  };

  const handleSubmitSla = (event) => {
    event.preventDefault();
    const nextStatus = formData.status || "Ativo";
    const formPayload = {
      ...formData,
      status: nextStatus,
    };

    if (isEditMode && editingSlaId !== null) {
      setSlas((previousSlas) =>
        previousSlas.map((item) => (item.id === editingSlaId ? { ...item, ...formPayload } : item))
      );
    } else {
      setSlas((previousSlas) => {
        const nextId = previousSlas.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
        return [{ id: nextId, ...formPayload }, ...previousSlas];
      });
      setCurrentPage(1);
    }

    handleCloseModal();
  };

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

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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

    const rowsToExport = filteredSlas.map((item) => ({
      SLA: item.sla,
      Descrição: item.description,
      Responsável: item.responsible,
      Estado: item.status,
    }));

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);

    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);

        XLSX.utils.book_append_sheet(workbook, worksheet, "SLAs");
        XLSX.writeFile(workbook, `slas-${timestamp}.xlsx`);
      }

      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de SLAs", 14, 14);

        autoTable(doc, {
          startY: 20,
          head: [["SLA", "Descrição", "Responsável", "Estado"]],
          body: rowsToExport.map((row) => [row.SLA, row.Descrição, row.Responsável, row.Estado]),
          styles: { fontSize: 9, cellPadding: 2.4 },
          headStyles: { fillColor: [58, 87, 232] },
        });

        doc.save(`slas-${timestamp}.pdf`);
      }

      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      console.error("Erro ao exportar listagem de SLAs:", error);
    }
  };

  return (
    <section className="softinsa-slas-page" data-node-id="3889:4757">
      <div className="softinsa-slas-hero" data-node-id="3889:4763">
        <h1>SLAs</h1>
        <p>Estabelecimento de prazos limite para as equipas e monitorizar incumprimentos</p>
      </div>

      <div className="softinsa-slas-toolbar" data-node-id="4100:9618">
        <label className="softinsa-slas-search" aria-label="Pesquisar SLA">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por nome da SLA..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-slas-filter-wrap" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-slas-filter-btn"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-slas-filter-panel" role="dialog" aria-label="Filtro de SLAs">
              <div className="softinsa-slas-filter-field">
                <label htmlFor="softinsa-slas-filter-status">Estado</label>
                <div className="softinsa-slas-select-wrap softinsa-slas-filter-select-wrap">
                  <select
                    id="softinsa-slas-filter-status"
                    value={filterDraft.status}
                    onChange={(event) => handleFilterDraftChange("status", event.target.value)}
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

              <div className="softinsa-slas-filter-field">
                <label htmlFor="softinsa-slas-filter-responsible">Responsável</label>
                <div className="softinsa-slas-select-wrap softinsa-slas-filter-select-wrap">
                  <select
                    id="softinsa-slas-filter-responsible"
                    value={filterDraft.responsible}
                    onChange={(event) => handleFilterDraftChange("responsible", event.target.value)}
                  >
                    <option value="">Selecione o responsável</option>
                    {responsibleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-slas-filter-actions">
                <button type="button" className="softinsa-slas-filter-clear" onClick={handleClearFilters}>
                  Limpar
                </button>
                <button type="button" className="softinsa-slas-filter-submit" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-slas-add-btn" aria-label="Adicionar SLA" onClick={handleOpenAddSla}>
          <PlusIcon />
          <span>Adicionar SLA</span>
        </button>
      </div>

      <div className="softinsa-slas-table-meta" data-node-id="4138:12750">
        <span>Mostrar</span>
        <div className="softinsa-slas-entries-select-wrap">
          <select
            className="softinsa-slas-entries-select"
            value={entriesPerPage}
            onChange={handleEntriesChange}
            aria-label="Quantidade de entradas por página"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="softinsa-slas-entries-arrow" aria-hidden="true">
            ▾
          </span>
        </div>
        <span>Entradas</span>
        {hasActiveFilters ? (
          <button type="button" className="softinsa-slas-clear-filter-inline" onClick={handleClearFilters}>
            Remover filtros
          </button>
        ) : null}
      </div>

      <div className="softinsa-slas-table-card" data-node-id="4438:3057">
        <div className="softinsa-slas-table-scroll">
          <table className="softinsa-slas-table" role="table" aria-label="Tabela de SLAs">
            <thead>
              <tr>
                <th>SLA</th>
                <th>DESCRIÇÃO</th>
                <th>RESPONSÁVEL</th>
                <th>ESTADO</th>
                <th>EDITAR</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSlas.length > 0 ? (
                paginatedSlas.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sla}</td>
                    <td>{item.description}</td>
                    <td>{item.responsible}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        type="button"
                        className="softinsa-slas-edit-btn"
                        aria-label={`Editar ${item.sla}`}
                        onClick={() => handleOpenEditSla(item)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-slas-empty-row">
                  <td colSpan={5}>Sem resultados para o filtro aplicado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-slas-table-footer" data-node-id="4438:3200">
          <button
            type="button"
            className="softinsa-slas-export-btn"
            aria-label="Exportar SLAs"
            onClick={handleOpenExportAlert}
          >
            <ExportIcon />
            <span>Exportar</span>
          </button>

          <div className="softinsa-slas-pagination" aria-label="Paginação">
            <button
              type="button"
              className={`softinsa-slas-page-link${currentPage === 1 ? " is-disabled" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`softinsa-slas-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
                onClick={() => handlePageSelect(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className={`softinsa-slas-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-slas-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div
            className="softinsa-slas-export-alert"
            role="dialog"
            aria-label="Alerta Exportar"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-slas-export-alert-header">
              <h3>Alerta</h3>
              <button
                type="button"
                className="softinsa-slas-modal-close"
                aria-label="Fechar alerta"
                onClick={handleCloseExportAlert}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="softinsa-slas-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>

              <button
                type="button"
                className="softinsa-slas-export-option"
                aria-pressed={exportFormat === "xlsx"}
                onClick={() => setExportFormat("xlsx")}
              >
                <span className={`softinsa-slas-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span>
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                className="softinsa-slas-export-option"
                aria-pressed={exportFormat === "pdf"}
                onClick={() => setExportFormat("pdf")}
              >
                <span className={`softinsa-slas-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span>
                <span>PDF (.pdf)</span>
              </button>
            </div>

            <div className="softinsa-slas-export-alert-actions">
              <button type="button" className="softinsa-slas-export-cancel" onClick={handleCloseExportAlert}>
                Cancelar
              </button>
              <button
                type="button"
                className={`softinsa-slas-export-confirm${!exportFormat ? " is-disabled" : ""}`}
                onClick={handleConfirmExport}
                disabled={!exportFormat}
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="softinsa-slas-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div
            className="softinsa-slas-modal"
            data-node-id="3974:8168"
            role="dialog"
            aria-label={isEditMode ? "Editar SLA" : "Adicionar SLA"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-slas-modal-header">
              <h2>{isEditMode ? "Editar SLA" : "Adicionar SLA"}</h2>
              <button
                type="button"
                className="softinsa-slas-modal-close"
                aria-label="Fechar modal"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-slas-modal-form" onSubmit={handleSubmitSla}>
              <div className="softinsa-slas-modal-field">
                <label htmlFor="softinsa-sla-name">Nome:</label>
                <input
                  id="softinsa-sla-name"
                  type="text"
                  value={formData.sla}
                  onChange={(event) => handleFieldChange("sla", event.target.value)}
                />
              </div>

              <div className="softinsa-slas-modal-field">
                <label htmlFor="softinsa-sla-description">Descrição:</label>
                <textarea
                  id="softinsa-sla-description"
                  value={formData.description}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                ></textarea>
              </div>

              <div className="softinsa-slas-modal-row softinsa-slas-modal-row-top">
                <div className="softinsa-slas-modal-field">
                  <label htmlFor="softinsa-sla-responsible">Equipa Responsável:</label>
                  <div className="softinsa-slas-select-wrap softinsa-slas-select-wrap-small">
                    <select
                      id="softinsa-sla-responsible"
                      value={formData.responsible}
                      onChange={(event) => handleFieldChange("responsible", event.target.value)}
                    >
                      {responsibleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

                <div className="softinsa-slas-modal-field">
                  <label htmlFor="softinsa-sla-deadline">Prazo:</label>
                  <input
                    id="softinsa-sla-deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(event) => handleFieldChange("deadline", event.target.value)}
                    required
                  />
                </div>

                <div className="softinsa-slas-modal-field">
                  <label>Estado:</label>
                  <div className="softinsa-slas-select-wrap softinsa-slas-select-wrap-small">
                    <select
                      id="softinsa-sla-status"
                      value={formData.status}
                      onChange={(event) => handleFieldChange("status", event.target.value)}
                    >
                      <option value="" disabled>
                        Ativo / Não Ativo
                      </option>
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
              </div>

              <div className="softinsa-slas-modal-row softinsa-slas-modal-row-bottom">
                <div className="softinsa-slas-notify-card">
                  <span className="softinsa-slas-notify-icon" aria-hidden="true">
                    <EmailIcon />
                  </span>
                  <span className="softinsa-slas-notify-text">Notificação por email</span>
                  <button
                    type="button"
                    className={`softinsa-slas-switch${formData.emailNotification ? " is-active" : ""}`}
                    aria-label="Ativar notificação por email"
                    aria-pressed={formData.emailNotification}
                    onClick={() => handleFieldChange("emailNotification", !formData.emailNotification)}
                  >
                    <span className="softinsa-slas-switch-thumb" />
                  </button>
                </div>

                <div className="softinsa-slas-notify-card">
                  <span className="softinsa-slas-notify-icon" aria-hidden="true">
                    <BellIcon />
                  </span>
                  <span className="softinsa-slas-notify-text">Notificação Push</span>
                  <button
                    type="button"
                    className={`softinsa-slas-switch${formData.pushNotification ? " is-active" : ""}`}
                    aria-label="Ativar notificação push"
                    aria-pressed={formData.pushNotification}
                    onClick={() => handleFieldChange("pushNotification", !formData.pushNotification)}
                  >
                    <span className="softinsa-slas-switch-thumb" />
                  </button>
                </div>

                <button type="submit" className="softinsa-slas-modal-submit">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default SoftinsaSlas;