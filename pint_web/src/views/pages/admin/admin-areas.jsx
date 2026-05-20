import React, { memo, useEffect, useRef, useState } from "react";
import "./admin-areas.css";

import { getLearningPaths } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas, createArea, updateArea } from '../../../controllers/areasController'
import { getBadges } from '../../../controllers/badgesController'

const statusOptions = ["Ativo", "Inativo"];


const getDefaultFilterDraft = () => ({ serviceLine: "", learningPath: "", status: "" });

const getDefaultAreaForm = () => ({
  name: "", description: "", learningPath: "", serviceLine: "",
  status: "", iconFileName: "", iconFile: null, image: "",
});

const normalizeSearchValue = (value) =>
  String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const formatAreaImage = (img) => {
  if (!img || typeof img !== "string" || img.trim() === "") return "";
  if (img.startsWith("data:")) return img;
  return `data:image/png;base64,${img}`;
};

const mapArea = (row, slMap, lpMap) => {
  const sl = slMap[row.id_service_line];
  return {
    id: row.id_area,
    name: row.nome_area,
    description: row.descricao_area ?? "",
    iconFileName: row.imagem_area ?? "",
    image: formatAreaImage(row.imagem_area),
    status: row.estado_a_i ? "Ativo" : "Inativo",
    serviceLineId: row.id_service_line,
    serviceLine: sl?.name ?? `ID ${row.id_service_line}`,
    learningPath: lpMap[sl?.id_learning_path] ?? "",
    badges: 0,
  };
};

// ── icons (sem alterações) ────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
      <path d="M4 5H20L13 13V19L11 20V13L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="softinsa-areas-pencil-icon" aria-hidden="true">
      <path d="M0 20V15.2778L14.6667 0.638889C14.8889 0.435185 15.1344 0.277778 15.4033 0.166667C15.6722 0.0555557 15.9544 0 16.25 0C16.5455 0 16.8326 0.0555557 17.1111 0.166667C17.3896 0.277778 17.6304 0.444444 17.8333 0.666667L19.3611 2.22222C19.5833 2.42593 19.7455 2.66667 19.8478 2.94444C19.95 3.22222 20.0007 3.5 20 3.77778C20 4.07407 19.9493 4.35667 19.8478 4.62556C19.7463 4.89444 19.5841 5.13963 19.3611 5.36111L4.72222 20H0ZM16.2222 5.33333L17.7778 3.77778L16.2222 2.22222L14.6667 3.77778L16.2222 5.33333Z" fill="#00B8E0" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-areas-icon" aria-hidden="true">
      <path d="M12 15V5M12 5L8.5 8.5M12 5L15.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
      <input type="file" accept="image/*" className="softinsa-areas-file-input" onChange={onChange} onClick={(e) => { e.target.value = null; }} aria-label={ariaLabel} />
      <span className="softinsa-areas-file-choose">Choose File</span>
      <span className="softinsa-areas-file-name">{fileName || "No file chosen"}</span>
    </label>
  );
}

// ── componente principal ──────────────────────────────────────────────────────

const SoftinsaAreas = memo(() => {
  const [areas, setAreas] = useState([]);
  const [learningPathOptions, setLearningPathOptions] = useState([]);
  const [serviceLineOptions, setServiceLineOptions] = useState([]);
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
  const [slRaw, setSlRaw] = useState([]);
  const filterWrapRef = useRef(null);

  // ── fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [areasData, slData, lpData, badgesData] = await Promise.all([
        getAreas(),
        getServiceLines(),
        getLearningPaths(),
        getBadges(),
      ]);

      const lpMap = {};
      lpData.forEach((lp) => { lpMap[lp.id_learning_path] = lp.nome_learning_path; });

      const slMap = {};
      slData.forEach((sl) => { slMap[sl.id_service_line] = { name: sl.nome_service_line, id_learning_path: sl.id_learning_path }; });

      setSlRaw(slData);

      const badgeCountByArea = {};
      badgesData.forEach((b) => {
        badgeCountByArea[b.id_area] = (badgeCountByArea[b.id_area] ?? 0) + 1;
      });

      setLearningPathOptions(lpData.map((lp) => lp.nome_learning_path));
      setServiceLineOptions(slData.map((sl) => sl.nome_service_line));

      setAreas(
        areasData.map((row) => ({
          ...mapArea(row, slMap, lpMap),
          badges: badgeCountByArea[row.id_area] ?? 0,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }

  // ── estado derivado ───────────────────────────────────────────────────────

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.serviceLine || activeFilters.learningPath || activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredAreas = areas.filter((area) => {
    const matchesSL = !activeFilters.serviceLine || area.serviceLine === activeFilters.serviceLine;
    const matchesLP = !activeFilters.learningPath || area.learningPath === activeFilters.learningPath;
    const matchesStatus = !activeFilters.status || area.status === activeFilters.status;
    const matchesSearch = !normalizedSearchTerm || normalizeSearchValue(`${area.name} ${area.serviceLine} ${area.learningPath}`).includes(normalizedSearchTerm);
    return matchesSL && matchesLP && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAreas.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedAreas = filteredAreas.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // ── handlers ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isFilterOpen && filterWrapRef.current && !filterWrapRef.current.contains(e.target)) setIsFilterOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") { setIsFilterOpen(false); setIsExportAlertOpen(false); setModalMode(null); setEditingAreaId(null); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("keydown", handleEscape); };
  }, [isFilterOpen]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const handleFieldChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleIconFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setFormData((prev) => ({ ...prev, iconFile: null, iconFileName: "", image: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({
        ...prev,
        iconFile: file,
        iconFileName: file.name,
        image: typeof reader.result === "string" ? reader.result : prev.image,
      }));
    reader.readAsDataURL(file);
  };

  const handleOpenAddArea = () => {
    setFormData({
      ...getDefaultAreaForm(),
      learningPath: learningPathOptions[0] ?? "",
      serviceLine: serviceLineOptions[0] ?? "",
      status: "Ativo",
    });
    setEditingAreaId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditArea = (area) => {
    setFormData({
      name: area.name || "",
      description: area.description || "",
      learningPath: area.learningPath || learningPathOptions[0] || "",
      serviceLine: area.serviceLine || serviceLineOptions[0] || "",
      serviceLineId: area.serviceLineId,
      status: area.status || "Ativo",
      iconFileName: area.iconFileName || "",
      iconFile: null,
      image: area.image || "",
    });
    setEditingAreaId(area.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => { setModalMode(null); setEditingAreaId(null); };

  const handleSubmitArea = async (e) => {
    e.preventDefault();
    const sanitizedName = formData.name.trim();
    if (!sanitizedName) return;

    const resolvedSlId = formData.serviceLineId
      ? Number(formData.serviceLineId)
      : slRaw.find((sl) => sl.nome_service_line === formData.serviceLine)?.id_service_line ?? null;

    if (!resolvedSlId) {
      console.error("Service Line não encontrada");
      return;
    }

    const rawBase64 = formData.image
      ? formData.image.replace(/^data:image\/[a-z+]+;base64,/, "")
      : null;

    const payload = {
      nome_area: sanitizedName,
      descricao_area: formData.description.trim(),
      id_service_line: resolvedSlId,
      estado_a_i: formData.status === "Ativo",
      imagem_area: rawBase64 || null,
    };

    try {
      if (isEditMode && editingAreaId !== null) {
        await updateArea(editingAreaId, payload);
      } else {
        await createArea(payload);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao guardar área", err);
    }
  };

  const handleToggleFilter = () => { setFilterDraft(activeFilters); setIsExportAlertOpen(false); setIsFilterOpen((p) => !p); };
  const handleFilterDraftChange = (field, value) => setFilterDraft((prev) => ({ ...prev, [field]: value }));
  const handleApplyFilters = () => { setActiveFilters(filterDraft); setCurrentPage(1); setIsFilterOpen(false); };
  const handleClearFilters = () => { const c = getDefaultFilterDraft(); setFilterDraft(c); setActiveFilters(c); setCurrentPage(1); setIsFilterOpen(false); };
  const handleEntriesChange = (e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); };
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handlePreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePageSelect = (page) => setCurrentPage(page);
  const handleOpenExportAlert = () => { setIsFilterOpen(false); setExportFormat(""); setIsExportAlertOpen(true); };
  const handleCloseExportAlert = () => { setIsExportAlertOpen(false); setExportFormat(""); };

  const handleConfirmExport = async () => {
    if (!exportFormat) return;
    const rowsToExport = filteredAreas.map((area) => ({ Nome: area.name, "Service Line": area.serviceLine, "Learning Path": area.learningPath, Badges: area.badges, Estado: area.status }));
    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rowsToExport), "Áreas");
        XLSX.writeFile(wb, `areas-${timestamp}.xlsx`);
      }
      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Áreas", 14, 14);
        autoTable(doc, { startY: 20, head: [["Nome", "Service Line", "Learning Path", "Badges", "Estado"]], body: rowsToExport.map((r) => [r.Nome, r["Service Line"], r["Learning Path"], String(r.Badges), r.Estado]), styles: { fontSize: 9, cellPadding: 2.4 }, headStyles: { fillColor: [58, 87, 232] } });
        doc.save(`areas-${timestamp}.pdf`);
      }
      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      console.error("Falha ao exportar áreas", error);
    }
  };

  // ── render (sem alterações) ───────────────────────────────────────────────

  return (
    <section className="softinsa-areas-page" data-node-id="3899:9615">
      <div className="softinsa-areas-hero" data-node-id="3899:9621">
        <h1>Áreas</h1>
        <p>Configuração das áreas de cada Service Line</p>
      </div>

      <div className="softinsa-areas-toolbar">
        <label className="softinsa-areas-search" aria-label="Pesquisar áreas">
          <SearchIcon />
          <input type="text" placeholder="Pesquisar por area, Service Line..." value={searchTerm} onChange={handleSearchChange} />
        </label>

        <div className="softinsa-areas-filter-wrap" ref={filterWrapRef}>
          <button type="button" className="softinsa-areas-filter-btn" aria-label="Abrir filtro" aria-expanded={isFilterOpen} onClick={handleToggleFilter}>
            <FilterIcon /><span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-areas-filter-panel" role="dialog" aria-label="Filtro de áreas">
              <div className="softinsa-areas-filter-field">
                <label htmlFor="softinsa-areas-filter-learning-path">Learning Path</label>
                <div className="softinsa-areas-select-wrap">
                  <select id="softinsa-areas-filter-learning-path" value={filterDraft.learningPath} onChange={(e) => handleFilterDraftChange("learningPath", e.target.value)}>
                    <option value="">Selecione a Learning Path</option>
                    {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-areas-filter-field">
                <label htmlFor="softinsa-areas-filter-service-line">Service Line</label>
                <div className="softinsa-areas-select-wrap">
                  <select id="softinsa-areas-filter-service-line" value={filterDraft.serviceLine} onChange={(e) => handleFilterDraftChange("serviceLine", e.target.value)}>
                    <option value="">Selecione a Service Line</option>
                    {serviceLineOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-areas-filter-field">
                <label htmlFor="softinsa-areas-filter-status">Estado</label>
                <div className="softinsa-areas-select-wrap">
                  <select id="softinsa-areas-filter-status" value={filterDraft.status} onChange={(e) => handleFilterDraftChange("status", e.target.value)}>
                    <option value="">Selecione o estado</option>
                    {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-areas-filter-actions">
                <button type="button" className="softinsa-areas-filter-submit" onClick={handleApplyFilters}>Filtrar</button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-areas-add-btn" onClick={handleOpenAddArea}>
          <PlusIcon /><span>Adicionar Área</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-areas-clear-filter-inline" onClick={handleClearFilters}>Remover filtros</button>
      ) : null}

      <div className="softinsa-areas-table-meta">
        <span>Mostrar</span>
        <div className="softinsa-areas-entries-select-wrap">
          <select className="softinsa-areas-entries-select" aria-label="Entradas por página" value={entriesPerPage} onChange={handleEntriesChange}>
            {[10, 50, 100].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
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
                <th>NOME</th><th>LEARNING PATH</th><th>SERVICE LINE</th><th>BADGES</th><th>ESTADO</th><th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedAreas.length > 0 ? (
                paginatedAreas.map((area) => (
                  <tr key={area.id}>
                    <td>{area.name}</td>
                    <td>{area.learningPath}</td>
                    <td>{area.serviceLine}</td>
                    <td>{area.badges}</td>
                    <td>{area.status}</td>
                    <td>
                      <button type="button" className="softinsa-areas-edit-btn" aria-label={`Editar ${area.name}`} onClick={() => handleOpenEditArea(area)}>
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
            <ExportIcon /><span>Exportar</span>
          </button>
          <div className="softinsa-areas-pagination" aria-label="Paginação">
            <button type="button" className={`softinsa-areas-page-link${currentPage === 1 ? " is-disabled" : ""}`} onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
            {pageNumbers.map((n) => (
              <button key={n} type="button" className={`softinsa-areas-page-btn${currentPage === n ? " is-active" : ""}`} onClick={() => handlePageSelect(n)}>{n}</button>
            ))}
            <button type="button" className={`softinsa-areas-page-link${currentPage === totalPages ? " is-disabled" : ""}`} onClick={handleNextPage} disabled={currentPage === totalPages}>Próximo</button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-areas-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div className="softinsa-areas-export-alert" role="dialog" aria-label="Exportar áreas" onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-areas-export-alert-header">
              <h3>Exportar</h3>
              <button type="button" className="softinsa-areas-modal-close" aria-label="Fechar exportação" onClick={handleCloseExportAlert}><CloseIcon /></button>
            </div>
            <div className="softinsa-areas-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>
              <button type="button" className="softinsa-areas-export-option" aria-pressed={exportFormat === "xlsx"} onClick={() => setExportFormat("xlsx")}>
                <span className={`softinsa-areas-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span><span>Excel (.xlsx)</span>
              </button>
              <button type="button" className="softinsa-areas-export-option" aria-pressed={exportFormat === "pdf"} onClick={() => setExportFormat("pdf")}>
                <span className={`softinsa-areas-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span><span>PDF (.pdf)</span>
              </button>
            </div>
            <div className="softinsa-areas-export-alert-actions">
              <button type="button" className="softinsa-areas-export-cancel" onClick={handleCloseExportAlert}>Cancelar</button>
              <button type="button" className={`softinsa-areas-export-confirm${!exportFormat ? " is-disabled" : ""}`} onClick={handleConfirmExport} disabled={!exportFormat}>Exportar</button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="softinsa-areas-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div className="softinsa-areas-modal" data-node-id="3983:4909" role="dialog" aria-label={isEditMode ? "Editar Área" : "Adicionar Área"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-areas-modal-header">
              <h2>{isEditMode ? "Editar Área" : "Adicionar Área"}</h2>
              <button type="button" className="softinsa-areas-modal-close" aria-label="Fechar modal" onClick={handleCloseModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-areas-modal-form" onSubmit={handleSubmitArea}>
              <div className="softinsa-areas-modal-field">
                <label htmlFor="softinsa-area-name">Nome:</label>
                <input id="softinsa-area-name" type="text" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} required />
              </div>
              <div className="softinsa-areas-modal-field">
                <label htmlFor="softinsa-area-description">Descrição:</label>
                <textarea id="softinsa-area-description" value={formData.description} onChange={(e) => handleFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className="softinsa-areas-modal-row-top">
                <div className="softinsa-areas-modal-field">
                  <label htmlFor="softinsa-area-learning-path">Learning Path Associada</label>
                  <div className="softinsa-areas-select-wrap">
                    <select id="softinsa-area-learning-path" value={formData.learningPath} onChange={(e) => handleFieldChange("learningPath", e.target.value)}>
                      {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-areas-modal-field">
                  <label htmlFor="softinsa-area-service-line">Service Line Associada</label>
                  <div className="softinsa-areas-select-wrap">
                    <select id="softinsa-area-service-line" value={formData.serviceLine} onChange={(e) => handleFieldChange("serviceLine", e.target.value)}>
                      {serviceLineOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-areas-modal-field">
                  <label htmlFor="softinsa-area-status">Estado</label>
                  <div className="softinsa-areas-select-wrap">
                    <select id="softinsa-area-status" value={formData.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                      <option value="" disabled>Ativo/Inativo</option>
                      {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
              </div>
              <div className="softinsa-areas-modal-row-bottom">
                <div className="softinsa-areas-modal-field">
                  <label>Icon</label>
                  <FileSelector fileName={formData.iconFileName} onChange={handleIconFileChange} ariaLabel="Selecionar icon da área" />
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Pré-visualização"
                      style={{ display: "block", marginTop: 8, maxHeight: 64, maxWidth: 64, objectFit: "contain" }}
                    />
                  ) : null}
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