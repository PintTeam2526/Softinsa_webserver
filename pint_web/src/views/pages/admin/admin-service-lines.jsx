import React, { memo, useEffect, useRef, useState } from "react";
import "./admin-service-lines.css";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const urlServiceLinesList   = `${BASE_URL}/serviceLines/get`;
const urlLearningPathsList  = `${BASE_URL}/learningPaths/get`;
// const urlCreate = `${BASE_URL}/serviceLines/create`;
// const urlUpdate = (id) => `${BASE_URL}/serviceLines/${id}/update`;

const statusOptions = ["Ativo", "Inativo"];

const getDefaultFilterDraft = () => ({
  learningPath: "",
  status: "",
});

const getDefaultServiceLineForm = () => ({
  name: "",
  description: "",
  learningPath: "",
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

// Mapeia linha da BD → shape usado no componente
const mapServiceLine = (row, learningPathsMap) => ({
  id:           row.id_service_line,
  name:         row.nome_service_line,
  description:  row.descricao_service_line   ?? "",
  iconFileName: row.imagem_service_line       ?? "",
  status:       row.estado_a_i ? "Ativo" : "Inativo",
  learningPath: learningPathsMap[row.id_learning_path] ?? `ID ${row.id_learning_path}`,
  areas:        0,
  badges:       0,
});

// ── icons (sem alterações) ────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
      <path d="M4 5H20L13 13V19L11 20V13L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="softinsa-service-lines-pencil-icon" aria-hidden="true">
      <path d="M0 20V15.2778L14.6667 0.638889C14.8889 0.435185 15.1344 0.277778 15.4033 0.166667C15.6722 0.0555557 15.9544 0 16.25 0C16.5455 0 16.8326 0.0555557 17.1111 0.166667C17.3896 0.277778 17.6304 0.444444 17.8333 0.666667L19.3611 2.22222C19.5833 2.42593 19.7455 2.66667 19.8478 2.94444C19.95 3.22222 20.0007 3.5 20 3.77778C20 4.07407 19.9493 4.35667 19.8478 4.62556C19.7463 4.89444 19.5841 5.13963 19.3611 5.36111L4.72222 20H0ZM16.2222 5.33333L17.7778 3.77778L16.2222 2.22222L14.6667 3.77778L16.2222 5.33333Z" fill="#00B8E0" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-service-lines-icon" aria-hidden="true">
      <path d="M12 15V5M12 5L8.5 8.5M12 5L15.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
      <input type="file" accept="image/*" className="softinsa-service-lines-file-input" onChange={onChange} onClick={(e) => { e.target.value = null; }} aria-label={ariaLabel} />
      <span className="softinsa-service-lines-file-choose">Choose File</span>
      <span className="softinsa-service-lines-file-name">{fileName || "No file chosen"}</span>
    </label>
  );
}

// ── componente principal ──────────────────────────────────────────────────────

const SoftinsaServiceLines = memo(() => {
  const [serviceLines, setServiceLines]       = useState([]);
  const [learningPathOptions, setLearningPathOptions] = useState([]); // nomes para o filtro/modal
  const [searchTerm, setSearchTerm]           = useState("");
  const [isFilterOpen, setIsFilterOpen]       = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [exportFormat, setExportFormat]       = useState("");
  const [filterDraft, setFilterDraft]         = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters]     = useState(getDefaultFilterDraft());
  const [entriesPerPage, setEntriesPerPage]   = useState(10);
  const [currentPage, setCurrentPage]         = useState(1);
  const [modalMode, setModalMode]             = useState(null);
  const [editingServiceLineId, setEditingServiceLineId] = useState(null);
  const [formData, setFormData]               = useState(getDefaultServiceLineForm());
  const filterWrapRef = useRef(null);

  // ── fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Busca as duas listas em paralelo
      const [slRes, lpRes] = await Promise.all([
        axios.get(urlServiceLinesList),
        axios.get(urlLearningPathsList),
      ]);

      // Mapa { id_learning_path: nome_learning_path }
      const lpMap = {};
      lpRes.data.forEach((lp) => {
        lpMap[lp.id_learning_path] = lp.nome_learning_path;
      });

      // Lista de nomes para filtro e modal
      const lpNames = lpRes.data.map((lp) => lp.nome_learning_path);
      setLearningPathOptions(lpNames);

      setServiceLines(slRes.data.map((row) => mapServiceLine(row, lpMap)));
    } catch (error) {
      console.error(error);
    }
  }

  // ── estado derivado (sem alterações) ──────────────────────────────────────

  const isModalOpen  = modalMode !== null;
  const isEditMode   = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.learningPath || activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredServiceLines = serviceLines.filter((item) => {
    const matchesLP     = !activeFilters.learningPath || item.learningPath === activeFilters.learningPath;
    const matchesStatus = !activeFilters.status       || item.status       === activeFilters.status;
    const matchesSearch = !normalizedSearchTerm       || normalizeSearchValue(`${item.name} ${item.learningPath}`).includes(normalizedSearchTerm);
    return matchesLP && matchesStatus && matchesSearch;
  });

  const totalPages          = Math.max(1, Math.ceil(filteredServiceLines.length / entriesPerPage));
  const pageNumbers         = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedServiceLines = filteredServiceLines.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // ── handlers (sem alterações) ─────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isFilterOpen && filterWrapRef.current && !filterWrapRef.current.contains(e.target))
        setIsFilterOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") { setIsFilterOpen(false); setIsExportAlertOpen(false); setModalMode(null); setEditingServiceLineId(null); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("keydown", handleEscape); };
  }, [isFilterOpen]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const handleFieldChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleIconFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, iconFile: file, iconFileName: file ? file.name : "" }));
  };

  const handleOpenAddServiceLine = () => {
    setFormData({ ...getDefaultServiceLineForm(), learningPath: learningPathOptions[0] ?? "" });
    setEditingServiceLineId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditServiceLine = (item) => {
    setFormData({ name: item.name || "", description: item.description || "", learningPath: item.learningPath || learningPathOptions[0] || "", status: item.status || "Ativo", iconFileName: item.iconFileName || "", iconFile: null });
    setEditingServiceLineId(item.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => { setModalMode(null); setEditingServiceLineId(null); };

  const handleSubmitServiceLine = (e) => {
    e.preventDefault();
    const sanitizedName = formData.name.trim();
    if (!sanitizedName) return;
    const payload = { name: sanitizedName, description: formData.description.trim(), learningPath: formData.learningPath, status: formData.status || "Ativo", iconFileName: formData.iconFileName };
    if (isEditMode && editingServiceLineId !== null) {
      setServiceLines((prev) => prev.map((item) => item.id === editingServiceLineId ? { ...item, ...payload } : item));
    } else {
      setServiceLines((prev) => {
        const nextId = prev.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
        return [{ id: nextId, areas: 0, badges: 0, ...payload }, ...prev];
      });
      setCurrentPage(1);
    }
    handleCloseModal();
  };

  const handleToggleFilter    = () => { setFilterDraft(activeFilters); setIsExportAlertOpen(false); setIsFilterOpen((prev) => !prev); };
  const handleFilterDraftChange = (field, value) => setFilterDraft((prev) => ({ ...prev, [field]: value }));
  const handleApplyFilters    = () => { setActiveFilters(filterDraft); setCurrentPage(1); setIsFilterOpen(false); };
  const handleClearFilters    = () => { const c = getDefaultFilterDraft(); setFilterDraft(c); setActiveFilters(c); setCurrentPage(1); setIsFilterOpen(false); };
  const handleEntriesChange   = (e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); };
  const handleSearchChange    = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handlePreviousPage    = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage        = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePageSelect      = (page) => setCurrentPage(page);
  const handleOpenExportAlert = () => { setIsFilterOpen(false); setExportFormat(""); setIsExportAlertOpen(true); };
  const handleCloseExportAlert= () => { setIsExportAlertOpen(false); setExportFormat(""); };

  const handleConfirmExport = async () => {
    if (!exportFormat) return;
    const rowsToExport = filteredServiceLines.map((item) => ({ Nome: item.name, "Learning Path": item.learningPath, Áreas: item.areas, Badges: item.badges, Estado: item.status }));
    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rowsToExport), "Service Lines");
        XLSX.writeFile(wb, `service-lines-${timestamp}.xlsx`);
      }
      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Service Lines", 14, 14);
        autoTable(doc, { startY: 20, head: [["Nome", "Learning Path", "Áreas", "Badges", "Estado"]], body: rowsToExport.map((r) => [r.Nome, r["Learning Path"], String(r.Áreas), String(r.Badges), r.Estado]), styles: { fontSize: 9, cellPadding: 2.4 }, headStyles: { fillColor: [58, 87, 232] } });
        doc.save(`service-lines-${timestamp}.pdf`);
      }
      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      console.error("Falha ao exportar service lines", error);
    }
  };

  // ── render (sem alterações) ───────────────────────────────────────────────

  return (
    <section className="softinsa-service-lines-page" data-node-id="3899:14449">
      <div className="softinsa-service-lines-hero" data-node-id="3899:14450">
        <h1>Service Lines</h1>
        <p>Configuração das Service Lines de cada Learning Path</p>
      </div>

      <div className="softinsa-service-lines-toolbar">
        <label className="softinsa-service-lines-search" aria-label="Pesquisar service lines">
          <SearchIcon />
          <input type="text" placeholder="Pesquisar por Service Line..." value={searchTerm} onChange={handleSearchChange} />
        </label>

        <div className="softinsa-service-lines-filter-wrap" ref={filterWrapRef}>
          <button type="button" className="softinsa-service-lines-filter-btn" aria-label="Abrir filtro" aria-expanded={isFilterOpen} onClick={handleToggleFilter}>
            <FilterIcon /><span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-service-lines-filter-panel" role="dialog" aria-label="Filtro de service lines">
              <div className="softinsa-service-lines-filter-field">
                <label htmlFor="softinsa-service-lines-filter-learning-path">Learning Path</label>
                <div className="softinsa-service-lines-select-wrap">
                  <select id="softinsa-service-lines-filter-learning-path" value={filterDraft.learningPath} onChange={(e) => handleFilterDraftChange("learningPath", e.target.value)}>
                    <option value="">Selecione a Learning Path</option>
                    {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-service-lines-filter-field">
                <label htmlFor="softinsa-service-lines-filter-status">Estado</label>
                <div className="softinsa-service-lines-select-wrap">
                  <select id="softinsa-service-lines-filter-status" value={filterDraft.status} onChange={(e) => handleFilterDraftChange("status", e.target.value)}>
                    <option value="">Selecione o estado</option>
                    {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-service-lines-filter-actions">
                <button type="button" className="softinsa-service-lines-filter-submit" onClick={handleApplyFilters}>Filtrar</button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-service-lines-add-btn" onClick={handleOpenAddServiceLine}>
          <PlusIcon /><span>Adicionar Service Line</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-service-lines-clear-filter-inline" onClick={handleClearFilters}>Remover filtros</button>
      ) : null}

      <div className="softinsa-service-lines-table-meta">
        <span>Mostrar</span>
        <div className="softinsa-service-lines-entries-select-wrap">
          <select className="softinsa-service-lines-entries-select" aria-label="Entradas por página" value={entriesPerPage} onChange={handleEntriesChange}>
            {[10, 50, 100].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
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
                <th>NOME</th><th>LEARNING PATH</th><th>ÁREAS</th><th>BADGES</th><th>ESTADO</th><th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedServiceLines.length > 0 ? (
                paginatedServiceLines.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.learningPath}</td>
                    <td>{item.areas}</td>
                    <td>{item.badges}</td>
                    <td>{item.status}</td>
                    <td>
                      <button type="button" className="softinsa-service-lines-edit-btn" aria-label={`Editar ${item.name}`} onClick={() => handleOpenEditServiceLine(item)}>
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
            <ExportIcon /><span>Exportar</span>
          </button>
          <div className="softinsa-service-lines-pagination" aria-label="Paginação">
            <button type="button" className={`softinsa-service-lines-page-link${currentPage === 1 ? " is-disabled" : ""}`} onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
            {pageNumbers.map((n) => (
              <button key={n} type="button" className={`softinsa-service-lines-page-btn${currentPage === n ? " is-active" : ""}`} onClick={() => handlePageSelect(n)}>{n}</button>
            ))}
            <button type="button" className={`softinsa-service-lines-page-link${currentPage === totalPages ? " is-disabled" : ""}`} onClick={handleNextPage} disabled={currentPage === totalPages}>Próximo</button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-service-lines-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div className="softinsa-service-lines-export-alert" role="dialog" aria-label="Exportar service lines" onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-service-lines-export-alert-header">
              <h3>Exportar</h3>
              <button type="button" className="softinsa-service-lines-modal-close" aria-label="Fechar exportação" onClick={handleCloseExportAlert}><CloseIcon /></button>
            </div>
            <div className="softinsa-service-lines-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>
              <button type="button" className="softinsa-service-lines-export-option" aria-pressed={exportFormat === "xlsx"} onClick={() => setExportFormat("xlsx")}>
                <span className={`softinsa-service-lines-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span><span>Excel (.xlsx)</span>
              </button>
              <button type="button" className="softinsa-service-lines-export-option" aria-pressed={exportFormat === "pdf"} onClick={() => setExportFormat("pdf")}>
                <span className={`softinsa-service-lines-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span><span>PDF (.pdf)</span>
              </button>
            </div>
            <div className="softinsa-service-lines-export-alert-actions">
              <button type="button" className="softinsa-service-lines-export-cancel" onClick={handleCloseExportAlert}>Cancelar</button>
              <button type="button" className={`softinsa-service-lines-export-confirm${!exportFormat ? " is-disabled" : ""}`} onClick={handleConfirmExport} disabled={!exportFormat}>Exportar</button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="softinsa-service-lines-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div className="softinsa-service-lines-modal" data-node-id="3986:16526" role="dialog" aria-label={isEditMode ? "Editar Service Line" : "Adicionar Service Line"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-service-lines-modal-header">
              <h2>{isEditMode ? "Editar Service Line" : "Adicionar Service Line"}</h2>
              <button type="button" className="softinsa-service-lines-modal-close" aria-label="Fechar modal" onClick={handleCloseModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-service-lines-modal-form" onSubmit={handleSubmitServiceLine}>
              <div className="softinsa-service-lines-modal-field">
                <label htmlFor="softinsa-service-line-name">Nome:</label>
                <input id="softinsa-service-line-name" type="text" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} required />
              </div>
              <div className="softinsa-service-lines-modal-field">
                <label htmlFor="softinsa-service-line-description">Descrição:</label>
                <textarea id="softinsa-service-line-description" value={formData.description} onChange={(e) => handleFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className="softinsa-service-lines-modal-row-top">
                <div className="softinsa-service-lines-modal-field">
                  <label htmlFor="softinsa-service-line-learning-path">Learning Path Associada</label>
                  <div className="softinsa-service-lines-select-wrap">
                    <select id="softinsa-service-line-learning-path" value={formData.learningPath} onChange={(e) => handleFieldChange("learningPath", e.target.value)}>
                      {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-service-lines-modal-field">
                  <label htmlFor="softinsa-service-line-status">Estado</label>
                  <div className="softinsa-service-lines-select-wrap">
                    <select id="softinsa-service-line-status" value={formData.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                      <option value="" disabled>Ativo/Inativo</option>
                      {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
              </div>
              <div className="softinsa-service-lines-modal-row-bottom">
                <div className="softinsa-service-lines-modal-field">
                  <label>Icon</label>
                  <FileSelector fileName={formData.iconFileName} onChange={handleIconFileChange} ariaLabel="Selecionar icon da service line" />
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