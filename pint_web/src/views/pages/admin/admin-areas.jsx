import React, { memo, useEffect, useRef, useState } from "react";
import "./admin-areas.css";

// TODO: Replace all mock data and local options with API data (areas, service lines, learning paths, and statuses).
const areasRows = [
  {
    id: 1,
    name: "DevOps (OutSystems)",
    description: "",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    badges: 5,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 2,
    name: "LowCode",
    description: "",
    serviceLine: "Applications Operations",
    learningPath: "Jornada Técnica",
    badges: 4,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 3,
    name: "Talent Management",
    description: "",
    serviceLine: "Sourcing & Talent Management",
    learningPath: "Jornada Técnica",
    badges: 3,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 4,
    name: "Cloud Architecture",
    description: "",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    badges: 2,
    status: "Ativo",
    iconFileName: "",
  },
  {
    id: 5,
    name: "Data Engineering",
    description: "",
    serviceLine: "Applications Operations",
    learningPath: "Jornada Técnica",
    badges: 1,
    status: "Ativo",
    iconFileName: "",
  },
];

const learningPathOptions = ["Jornada Técnica", "Power Skills"];
const serviceLineOptions = [
  "Hybrid Cloud",
  "Applications Operations",
  "Sourcing & Talent Management",
  "Data & AI",
  "Security",
];
const statusOptions = ["Ativo", "Inativo"];

const getDefaultFilterDraft = () => ({
  serviceLine: "",
  learningPath: "",
  status: "",
});

const getDefaultAreaForm = () => ({
  name: "",
  description: "",
  learningPath: "Jornada Técnica",
  serviceLine: "Hybrid Cloud",
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
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
      className="softinsa-areas-pencil-icon"
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
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
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-areas-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FileSelector({ fileName, onChange, ariaLabel }) {
  return (
    <label className="softinsa-areas-file-field">
      <input
        type="file"
        accept="image/*"
        className="softinsa-areas-file-input"
        onChange={onChange}
        onClick={(event) => {
          event.target.value = null;
        }}
        aria-label={ariaLabel}
      />
      <span className="softinsa-areas-file-choose">Choose File</span>
      <span className="softinsa-areas-file-name">{fileName || "No file chosen"}</span>
    </label>
  );
}

const SoftinsaAreas = memo(() => {
  const [areas, setAreas] = useState(areasRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [formData, setFormData] = useState(getDefaultAreaForm());
  const filterWrapRef = useRef(null);

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.serviceLine || activeFilters.learningPath || activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredAreas = areas.filter((area) => {
    const matchesServiceLine = !activeFilters.serviceLine || area.serviceLine === activeFilters.serviceLine;
    const matchesLearningPath = !activeFilters.learningPath || area.learningPath === activeFilters.learningPath;
    const matchesStatus = !activeFilters.status || area.status === activeFilters.status;
    const searchableArea = normalizeSearchValue(`${area.name} ${area.serviceLine} ${area.learningPath}`);
    const matchesSearch = !normalizedSearchTerm || searchableArea.includes(normalizedSearchTerm);
    return matchesServiceLine && matchesLearningPath && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAreas.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedAreas = filteredAreas.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

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
        setEditingAreaId(null);
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

  const handleOpenAddArea = () => {
    setFormData(getDefaultAreaForm());
    setEditingAreaId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditArea = (area) => {
    setFormData({
      name: area.name || "",
      description: area.description || "",
      learningPath: area.learningPath || "Jornada Técnica",
      serviceLine: area.serviceLine || "Hybrid Cloud",
      status: area.status || "Ativo",
      iconFileName: area.iconFileName || "",
      iconFile: null,
    });
    setEditingAreaId(area.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingAreaId(null);
  };

  const handleSubmitArea = (event) => {
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
      serviceLine: formData.serviceLine,
      status: formData.status || "Ativo",
      iconFileName: formData.iconFileName,
    };

    if (isEditMode && editingAreaId !== null) {
      setAreas((previousAreas) =>
        previousAreas.map((item) => (item.id === editingAreaId ? { ...item, ...payload } : item))
      );
    } else {
      setAreas((previousAreas) => {
        const nextId = previousAreas.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
        return [{ id: nextId, badges: 0, ...payload }, ...previousAreas];
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

    const rowsToExport = filteredAreas.map((area) => ({
      Nome: area.name,
      "Service Line": area.serviceLine,
      "Learning Path": area.learningPath,
      Badges: area.badges,
      Estado: area.status,
    }));

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);

    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Áreas");
        XLSX.writeFile(workbook, `areas-${timestamp}.xlsx`);
      }

      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Áreas", 14, 14);

        autoTable(doc, {
          startY: 20,
          head: [["Nome", "Service Line", "Learning Path", "Badges", "Estado"]],
          body: rowsToExport.map((row) => [
            row.Nome,
            row["Service Line"],
            row["Learning Path"],
            String(row.Badges),
            row.Estado,
          ]),
          styles: { fontSize: 9, cellPadding: 2.4 },
          headStyles: { fillColor: [58, 87, 232] },
        });

        doc.save(`areas-${timestamp}.pdf`);
      }

      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      // Keep behavior simple in this iteration; replace with toast/notification when global feedback is available.
      console.error("Falha ao exportar áreas", error);
    }
  };

  return (
    <section className="softinsa-areas-page" data-node-id="3899:9615">
      <div className="softinsa-areas-hero" data-node-id="3899:9621">
        <h1>Áreas</h1>
        <p>Configuração das áreas de cada Service Line</p>
      </div>

      <div className="softinsa-areas-toolbar">
        <label className="softinsa-areas-search" aria-label="Pesquisar áreas">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por area, Service Line..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-areas-filter-wrap" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-areas-filter-btn"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-areas-filter-panel" role="dialog" aria-label="Filtro de áreas">
              <div className="softinsa-areas-filter-field">
                <label htmlFor="softinsa-areas-filter-learning-path">Learning Path</label>
                <div className="softinsa-areas-select-wrap">
                  <select
                    id="softinsa-areas-filter-learning-path"
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

              <div className="softinsa-areas-filter-field">
                <label htmlFor="softinsa-areas-filter-service-line">Service Line</label>
                <div className="softinsa-areas-select-wrap">
                  <select
                    id="softinsa-areas-filter-service-line"
                    value={filterDraft.serviceLine}
                    onChange={(event) => handleFilterDraftChange("serviceLine", event.target.value)}
                  >
                    <option value="">Selecione a Service Line</option>
                    {serviceLineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-areas-filter-field">
                <label htmlFor="softinsa-areas-filter-status">Estado</label>
                <div className="softinsa-areas-select-wrap">
                  <select
                    id="softinsa-areas-filter-status"
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

              <div className="softinsa-areas-filter-actions">
                <button type="button" className="softinsa-areas-filter-submit" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-areas-add-btn" onClick={handleOpenAddArea}>
          <PlusIcon />
          <span>Adicionar Área</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-areas-clear-filter-inline" onClick={handleClearFilters}>
          Remover filtros
        </button>
      ) : null}

      <div className="softinsa-areas-table-meta">
        <span>Mostrar</span>
        <div className="softinsa-areas-entries-select-wrap">
          <select
            className="softinsa-areas-entries-select"
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
          <span className="softinsa-areas-entries-arrow">▼</span>
        </div>
        <span>Entradas</span>
      </div>

      <div className="softinsa-areas-table-card">
        <div className="softinsa-areas-table-scroll">
          <table className="softinsa-areas-table" aria-label="Tabela de áreas">
            <thead>
              <tr>
                <th>NOME</th>
                <th>SERVICE LINE</th>
                <th>LEARNING PATH</th>
                <th>BADGES</th>
                <th>ESTADO</th>
                <th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedAreas.length > 0 ? (
                paginatedAreas.map((area) => (
                  <tr key={area.id}>
                    <td>{area.name}</td>
                    <td>{area.serviceLine}</td>
                    <td>{area.learningPath}</td>
                    <td>{area.badges}</td>
                    <td>{area.status}</td>
                    <td>
                      <button
                        type="button"
                        className="softinsa-areas-edit-btn"
                        aria-label={`Editar ${area.name}`}
                        onClick={() => handleOpenEditArea(area)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-areas-empty-row">
                  <td colSpan={6}>Sem resultados para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-areas-table-footer">
          <button type="button" className="softinsa-areas-export-btn" onClick={handleOpenExportAlert}>
            <ExportIcon />
            <span>Exportar</span>
          </button>

          <div className="softinsa-areas-pagination" aria-label="Paginação">
            <button
              type="button"
              className={`softinsa-areas-page-link${currentPage === 1 ? " is-disabled" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`softinsa-areas-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
                onClick={() => handlePageSelect(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className={`softinsa-areas-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-areas-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div
            className="softinsa-areas-export-alert"
            role="dialog"
            aria-label="Exportar áreas"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-areas-export-alert-header">
              <h3>Exportar</h3>
              <button
                type="button"
                className="softinsa-areas-modal-close"
                aria-label="Fechar exportação"
                onClick={handleCloseExportAlert}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="softinsa-areas-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>

              <button
                type="button"
                className="softinsa-areas-export-option"
                aria-pressed={exportFormat === "xlsx"}
                onClick={() => setExportFormat("xlsx")}
              >
                <span className={`softinsa-areas-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span>
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                className="softinsa-areas-export-option"
                aria-pressed={exportFormat === "pdf"}
                onClick={() => setExportFormat("pdf")}
              >
                <span className={`softinsa-areas-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span>
                <span>PDF (.pdf)</span>
              </button>
            </div>

            <div className="softinsa-areas-export-alert-actions">
              <button type="button" className="softinsa-areas-export-cancel" onClick={handleCloseExportAlert}>
                Cancelar
              </button>
              <button
                type="button"
                className={`softinsa-areas-export-confirm${!exportFormat ? " is-disabled" : ""}`}
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
        <div className="softinsa-areas-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div
            className="softinsa-areas-modal"
            data-node-id="3983:4909"
            role="dialog"
            aria-label={isEditMode ? "Editar Área" : "Adicionar Área"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-areas-modal-header">
              <h2>{isEditMode ? "Editar Área" : "Adicionar Área"}</h2>
              <button
                type="button"
                className="softinsa-areas-modal-close"
                aria-label="Fechar modal"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-areas-modal-form" onSubmit={handleSubmitArea}>
              <div className="softinsa-areas-modal-field">
                <label htmlFor="softinsa-area-name">Nome:</label>
                <input
                  id="softinsa-area-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  required
                />
              </div>

              <div className="softinsa-areas-modal-field">
                <label htmlFor="softinsa-area-description">Descrição:</label>
                <textarea
                  id="softinsa-area-description"
                  value={formData.description}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                ></textarea>
              </div>

              <div className="softinsa-areas-modal-row-top">
                <div className="softinsa-areas-modal-field">
                  <label htmlFor="softinsa-area-learning-path">Learning Path Associada</label>
                  <div className="softinsa-areas-select-wrap">
                    <select
                      id="softinsa-area-learning-path"
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

                <div className="softinsa-areas-modal-field">
                  <label htmlFor="softinsa-area-service-line">Service Line Associada</label>
                  <div className="softinsa-areas-select-wrap">
                    <select
                      id="softinsa-area-service-line"
                      value={formData.serviceLine}
                      onChange={(event) => handleFieldChange("serviceLine", event.target.value)}
                    >
                      {serviceLineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

                <div className="softinsa-areas-modal-field">
                  <label htmlFor="softinsa-area-status">Estado</label>
                  <div className="softinsa-areas-select-wrap">
                    <select
                      id="softinsa-area-status"
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

              <div className="softinsa-areas-modal-row-bottom">
                <div className="softinsa-areas-modal-field">
                  <label>Icon</label>
                  <FileSelector
                    fileName={formData.iconFileName}
                    onChange={handleIconFileChange}
                    ariaLabel="Selecionar icon da área"
                  />
                </div>

                <button type="submit" className="softinsa-areas-modal-submit">
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

export default SoftinsaAreas;
