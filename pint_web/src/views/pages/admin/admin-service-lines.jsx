import React, { memo, useEffect, useRef, useState } from "react";
import "./admin-service-lines.css";

// TODO: Replace all mock data and local options with API data (service lines, learning paths, badges, and statuses).
const serviceLinesRows = [
  {
    id: 1,
    name: "Hybrid Cloud",
    description: "",
    learningPath: "Jornada Técnica",
    areas: 3,
    badges: 15,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 2,
    name: "Application Operations",
    description: "",
    learningPath: "Jornada Técnica",
    areas: 3,
    badges: 15,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 3,
    name: "Sourcing & Talent Management",
    description: "",
    learningPath: "Jornada Técnica",
    areas: 3,
    badges: 15,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 4,
    name: "Cybersecurity & Compliance",
    description: "",
    learningPath: "Jornada Técnica",
    areas: 3,
    badges: 15,
    status: "Ativo",
    iconFileName: "",
  },
];

const learningPathOptions = ["Jornada Técnica", "Power Skills"];
const statusOptions = ["Ativo", "Inativo"];

const getDefaultFilterDraft = () => ({
  learningPath: "",
  status: "",
});

const getDefaultServiceLineForm = () => ({
  name: "",
  description: "",
  learningPath: "Jornada Técnica",
  status: "",
  iconFileName: "",
  iconFile: null,
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
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
      className="softinsa-service-lines-pencil-icon"
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
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
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-service-lines-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FileSelector({ fileName, onChange, ariaLabel }) {
  return (
    <label className="softinsa-service-lines-file-field">
      <input
        type="file"
        accept="image/*"
        className="softinsa-service-lines-file-input"
        onChange={onChange}
        onClick={(event) => {
          event.target.value = null;
        }}
        aria-label={ariaLabel}
      />
      <span className="softinsa-service-lines-file-choose">Choose File</span>
      <span className="softinsa-service-lines-file-name">{fileName || "No file chosen"}</span>
    </label>
  );
}

const SoftinsaServiceLines = memo(() => {
  const [serviceLines, setServiceLines] = useState(serviceLinesRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingServiceLineId, setEditingServiceLineId] = useState(null);
  const [formData, setFormData] = useState(getDefaultServiceLineForm());
  const filterWrapRef = useRef(null);

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.learningPath || activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredServiceLines = serviceLines.filter((serviceLineItem) => {
    const matchesLearningPath =
      !activeFilters.learningPath || serviceLineItem.learningPath === activeFilters.learningPath;
    const matchesStatus = !activeFilters.status || serviceLineItem.status === activeFilters.status;
    const searchableServiceLine = normalizeSearchValue(`${serviceLineItem.name} ${serviceLineItem.learningPath}`);
    const matchesSearch = !normalizedSearchTerm || searchableServiceLine.includes(normalizedSearchTerm);
    return matchesLearningPath && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredServiceLines.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedServiceLines = filteredServiceLines.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

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
        setEditingServiceLineId(null);
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
    setFormData((previousData) => ({ ...previousData, [field]: value }));
  };

  const handleIconFileChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setFormData((previousData) => ({
      ...previousData,
      iconFile: file,
      iconFileName: file ? file.name : "",
    }));
  };

  const handleOpenAddServiceLine = () => {
    setFormData(getDefaultServiceLineForm());
    setEditingServiceLineId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditServiceLine = (serviceLineItem) => {
    setFormData({
      name: serviceLineItem.name || "",
      description: serviceLineItem.description || "",
      learningPath: serviceLineItem.learningPath || "Jornada Técnica",
      status: serviceLineItem.status || "Ativo",
      iconFileName: serviceLineItem.iconFileName || "",
      iconFile: null,
    });
    setEditingServiceLineId(serviceLineItem.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingServiceLineId(null);
  };

  const handleSubmitServiceLine = (event) => {
    event.preventDefault();

    const sanitizedName = formData.name.trim();
    const sanitizedDescription = formData.description.trim();

    if (!sanitizedName) {
      return;
    }

    const payload = {
      name: sanitizedName,
      description: sanitizedDescription,
      learningPath: formData.learningPath,
      status: formData.status || "Ativo",
      iconFileName: formData.iconFileName,
    };

    if (isEditMode && editingServiceLineId !== null) {
      setServiceLines((previousServiceLines) =>
        previousServiceLines.map((item) =>
          item.id === editingServiceLineId
            ? {
                ...item,
                ...payload,
              }
            : item
        )
      );
    } else {
      setServiceLines((previousServiceLines) => {
        const nextId =
          previousServiceLines.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
        return [{ id: nextId, areas: 0, badges: 0, ...payload }, ...previousServiceLines];
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
    setFilterDraft((previousData) => ({ ...previousData, [field]: value }));
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

    const rowsToExport = filteredServiceLines.map((serviceLineItem) => ({
      Nome: serviceLineItem.name,
      "Learning Path": serviceLineItem.learningPath,
      Áreas: serviceLineItem.areas,
      Badges: serviceLineItem.badges,
      Estado: serviceLineItem.status,
    }));

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);

    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Service Lines");
        XLSX.writeFile(workbook, `service-lines-${timestamp}.xlsx`);
      }

      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Service Lines", 14, 14);

        autoTable(doc, {
          startY: 20,
          head: [["Nome", "Learning Path", "Áreas", "Badges", "Estado"]],
          body: rowsToExport.map((row) => [
            row.Nome,
            row["Learning Path"],
            String(row.Áreas),
            String(row.Badges),
            row.Estado,
          ]),
          styles: { fontSize: 9, cellPadding: 2.4 },
          headStyles: { fillColor: [58, 87, 232] },
        });

        doc.save(`service-lines-${timestamp}.pdf`);
      }

      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      // Keep behavior simple in this iteration; replace with toast/notification when global feedback is available.
      console.error("Falha ao exportar service lines", error);
    }
  };

  return (
    <section className="softinsa-service-lines-page" data-node-id="3899:14449">
      <div className="softinsa-service-lines-hero" data-node-id="3899:14450">
        <h1>Service Lines</h1>
        <p>Configuração das Service Lines de cada Learning Path</p>
      </div>

      <div className="softinsa-service-lines-toolbar">
        <label className="softinsa-service-lines-search" aria-label="Pesquisar service lines">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por Service Line..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-service-lines-filter-wrap" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-service-lines-filter-btn"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-service-lines-filter-panel" role="dialog" aria-label="Filtro de service lines">
              <div className="softinsa-service-lines-filter-field">
                <label htmlFor="softinsa-service-lines-filter-learning-path">Learning Path</label>
                <div className="softinsa-service-lines-select-wrap">
                  <select
                    id="softinsa-service-lines-filter-learning-path"
                    value={filterDraft.learningPath}
                    onChange={(event) => handleFilterDraftChange("learningPath", event.target.value)}
                  >
                    <option value="">Selecione a Learning Path</option>
                    {learningPathOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-service-lines-filter-field">
                <label htmlFor="softinsa-service-lines-filter-status">Estado</label>
                <div className="softinsa-service-lines-select-wrap">
                  <select
                    id="softinsa-service-lines-filter-status"
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

              <div className="softinsa-service-lines-filter-actions">
                <button type="button" className="softinsa-service-lines-filter-submit" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-service-lines-add-btn" onClick={handleOpenAddServiceLine}>
          <PlusIcon />
          <span>Adicionar Service Line</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-service-lines-clear-filter-inline" onClick={handleClearFilters}>
          Remover filtros
        </button>
      ) : null}

      <div className="softinsa-service-lines-table-meta">
        <span>Mostrar</span>
        <div className="softinsa-service-lines-entries-select-wrap">
          <select
            className="softinsa-service-lines-entries-select"
            aria-label="Entradas por página"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            {[10, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="softinsa-service-lines-entries-arrow">▼</span>
        </div>
        <span>Entradas</span>
      </div>

      <div className="softinsa-service-lines-table-card">
        <div className="softinsa-service-lines-table-scroll">
          <table className="softinsa-service-lines-table" aria-label="Tabela de service lines">
            <thead>
              <tr>
                <th>NOME</th>
                <th>LEARNING PATH</th>
                <th>ÁREAS</th>
                <th>BADGES</th>
                <th>ESTADO</th>
                <th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedServiceLines.length > 0 ? (
                paginatedServiceLines.map((serviceLineItem) => (
                  <tr key={serviceLineItem.id}>
                    <td>{serviceLineItem.name}</td>
                    <td>{serviceLineItem.learningPath}</td>
                    <td>{serviceLineItem.areas}</td>
                    <td>{serviceLineItem.badges}</td>
                    <td>{serviceLineItem.status}</td>
                    <td>
                      <button
                        type="button"
                        className="softinsa-service-lines-edit-btn"
                        aria-label={`Editar ${serviceLineItem.name}`}
                        onClick={() => handleOpenEditServiceLine(serviceLineItem)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-service-lines-empty-row">
                  <td colSpan={6}>Sem resultados para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-service-lines-table-footer">
          <button type="button" className="softinsa-service-lines-export-btn" onClick={handleOpenExportAlert}>
            <ExportIcon />
            <span>Exportar</span>
          </button>

          <div className="softinsa-service-lines-pagination" aria-label="Paginação">
            <button
              type="button"
              className={`softinsa-service-lines-page-link${currentPage === 1 ? " is-disabled" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`softinsa-service-lines-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
                onClick={() => handlePageSelect(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className={`softinsa-service-lines-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-service-lines-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div
            className="softinsa-service-lines-export-alert"
            role="dialog"
            aria-label="Exportar service lines"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-service-lines-export-alert-header">
              <h3>Exportar</h3>
              <button
                type="button"
                className="softinsa-service-lines-modal-close"
                aria-label="Fechar exportação"
                onClick={handleCloseExportAlert}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="softinsa-service-lines-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>

              <button
                type="button"
                className="softinsa-service-lines-export-option"
                aria-pressed={exportFormat === "xlsx"}
                onClick={() => setExportFormat("xlsx")}
              >
                <span
                  className={`softinsa-service-lines-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}
                ></span>
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                className="softinsa-service-lines-export-option"
                aria-pressed={exportFormat === "pdf"}
                onClick={() => setExportFormat("pdf")}
              >
                <span
                  className={`softinsa-service-lines-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}
                ></span>
                <span>PDF (.pdf)</span>
              </button>
            </div>

            <div className="softinsa-service-lines-export-alert-actions">
              <button
                type="button"
                className="softinsa-service-lines-export-cancel"
                onClick={handleCloseExportAlert}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`softinsa-service-lines-export-confirm${!exportFormat ? " is-disabled" : ""}`}
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
        <div className="softinsa-service-lines-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div
            className="softinsa-service-lines-modal"
            data-node-id="3986:16526"
            role="dialog"
            aria-label={isEditMode ? "Editar Service Line" : "Adicionar Service Line"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-service-lines-modal-header">
              <h2>{isEditMode ? "Editar Service Line" : "Adicionar Service Line"}</h2>
              <button
                type="button"
                className="softinsa-service-lines-modal-close"
                aria-label="Fechar modal"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-service-lines-modal-form" onSubmit={handleSubmitServiceLine}>
              <div className="softinsa-service-lines-modal-field">
                <label htmlFor="softinsa-service-line-name">Nome:</label>
                <input
                  id="softinsa-service-line-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  required
                />
              </div>

              <div className="softinsa-service-lines-modal-field">
                <label htmlFor="softinsa-service-line-description">Descrição:</label>
                <textarea
                  id="softinsa-service-line-description"
                  value={formData.description}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                ></textarea>
              </div>

              <div className="softinsa-service-lines-modal-row-top">
                <div className="softinsa-service-lines-modal-field">
                  <label htmlFor="softinsa-service-line-learning-path">Learning Path Associada</label>
                  <div className="softinsa-service-lines-select-wrap">
                    <select
                      id="softinsa-service-line-learning-path"
                      value={formData.learningPath}
                      onChange={(event) => handleFieldChange("learningPath", event.target.value)}
                    >
                      {learningPathOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

                <div className="softinsa-service-lines-modal-field">
                  <label htmlFor="softinsa-service-line-status">Estado</label>
                  <div className="softinsa-service-lines-select-wrap">
                    <select
                      id="softinsa-service-line-status"
                      value={formData.status}
                      onChange={(event) => handleFieldChange("status", event.target.value)}
                    >
                      <option value="" disabled>
                        Ativo/Inativo
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

              <div className="softinsa-service-lines-modal-row-bottom">
                <div className="softinsa-service-lines-modal-field">
                  <label>Icon</label>
                  <FileSelector
                    fileName={formData.iconFileName}
                    onChange={handleIconFileChange}
                    ariaLabel="Selecionar icon da service line"
                  />
                </div>

                <button type="submit" className="softinsa-service-lines-modal-submit">
                  {isEditMode ? "Editar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default SoftinsaServiceLines;
