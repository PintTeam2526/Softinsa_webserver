import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import badgeJuniorCitizenDeveloper from "../../../assets/images/badges/outsystems_1.png";
import badgeOutsystemsAdvanced from "../../../assets/images/badges/outsystems_3.png";
import badgeOutsystemsSpecial from "../../../assets/images/badges/outsystems_special.png";
import badgeTmJunior from "../../../assets/images/badges/tm_1.png";
import badgeTmAdvanced from "../../../assets/images/badges/tm_3.png";
import badgeTmSpecial from "../../../assets/images/badges/tm_special.png";
import badgeDevopsIntermediate from "../../../assets/images/badges/devops_2.png";
import badgeDevopsAdvanced from "../../../assets/images/badges/devops_4.png";
import "./admin-badges.css";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const urlBadgesList = `${BASE_URL}/badges/get`;
const urlAreasList = `${BASE_URL}/areas/get`;
const urlServiceLinesList = `${BASE_URL}/serviceLines/get`;
const urlLearningPathsList = `${BASE_URL}/learningPaths/get`;

const defaultBadgeImage = "https://www.figma.com/api/mcp/asset/8ac1b8c7-eccc-423b-8373-e25bf82c55b4";

const statusOptions = ["Ativo", "Inativo"];
const badgeLevelRankOptions = ["1", "2", "3", "4", "5"];

const levelLabelByRank = {
  "1": "Júnior",
  "2": "Pleno",
  "3": "Sénior",
  "4": "Especialista",
  "5": "Master",
};

const rankByLevelLabel = Object.fromEntries(
  Object.entries(levelLabelByRank).map(([rank, label]) => [label, rank])
);

const getDefaultFilterDraft = () => ({ learningPath: "", serviceLine: "", area: "" });

const getDefaultBadgeForm = () => ({
  name: "", description: "", learningPath: "", serviceLine: "", area: "",
  validityDate: "", status: "", badgeLevel: "1", points: "",
  isSpecial: true, logoFileName: "", logoFile: null,
  image: defaultBadgeImage, requirements: [],
});

const getDefaultRequirementForm = (isEditMode = false) => ({
  title: "", description: "", level: isEditMode ? "1" : "", fileName: "", file: null,
});

const normalizeSearchValue = (value) =>
  String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

// Mapeia linha da BD → shape usado no componente
// nivel_badge guarda a label ("Júnior", "Pleno", …)
const mapBadge = (row, areaMap, slMap, lpMap) => {
  const area = areaMap[row.id_area];
  const sl = slMap[area?.id_service_line];
  const lp = lpMap[sl?.id_learning_path];
  const levelLabel = row.nivel_badge ?? "Júnior";
  return {
    id: row.id_badge,
    name: row.nome_badge,
    description: row.descricao_badge ?? "",
    points: row.pontos_badge ?? 0,
    isSpecial: row.pago ?? false,
    badgeLevel: rankByLevelLabel[levelLabel] ?? "1",
    level: levelLabel,
    image: row.imagem_badge || defaultBadgeImage,
    logoFileName: row.imagem_badge ?? "",
    validityDate: row.validade ? String(row.validade) : "",
    status: row.estado_a_i ? "Ativo" : "Inativo",
    area: area?.name ?? `ID ${row.id_area}`,
    serviceLine: sl?.name ?? "",
    learningPath: lp ?? "",
    requirements: [],
  };
};

// ── icons (sem alterações) ────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-icon" aria-hidden="true">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-icon" aria-hidden="true">
      <path d="M4 5H20L13 13V19L11 20V13L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-icon" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PointIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="softinsa-badges-point-icon" aria-hidden="true">
      <path d="M8 1.5L10 5.5L14.5 6.1L11.2 9.2L12 13.5L8 11.4L4 13.5L4.8 9.2L1.5 6.1L6 5.5L8 1.5Z" fill="currentColor" />
    </svg>
  );
}

function SelectArrowIcon() {
  return (
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-badges-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FileSelector({ fileName, onChange, ariaLabel, className = "" }) {
  return (
    <label className={`softinsa-badges-file-field ${className}`.trim()}>
      <input type="file" accept="image/*" className="softinsa-badges-file-input" onChange={onChange} onClick={(e) => { e.target.value = null; }} aria-label={ariaLabel} />
      <span className="softinsa-badges-file-choose">Choose File</span>
      <span className="softinsa-badges-file-name">{fileName || "No file chosen"}</span>
    </label>
  );
}

// ── componente principal ──────────────────────────────────────────────────────

const SoftinsaBadges = memo(() => {
  const [badges, setBadges] = useState([]);
  const [learningPathOptions, setLearningPathOptions] = useState([]);
  const [serviceLineOptions, setServiceLineOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingBadgeId, setEditingBadgeId] = useState(null);
  const [formData, setFormData] = useState(getDefaultBadgeForm());
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [requirementModalMode, setRequirementModalMode] = useState("add");
  const [requirementFormData, setRequirementFormData] = useState(getDefaultRequirementForm(false));
  const [requirementFormError, setRequirementFormError] = useState("");
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);
  const filterWrapRef = useRef(null);

  const cardsPerPage = 8;
  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.learningPath || activeFilters.serviceLine || activeFilters.area);
  const isEditRequirementMode = requirementModalMode === "edit";
  const isEditingRequirementDraft = editingRequirementIndex !== null;
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  // ── fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [badgesRes, areasRes, slRes, lpRes] = await Promise.all([
        axios.get(urlBadgesList),
        axios.get(urlAreasList),
        axios.get(urlServiceLinesList),
        axios.get(urlLearningPathsList),
      ]);

      // { id_learning_path: nome_learning_path }
      const lpMap = {};
      lpRes.data.forEach((lp) => { lpMap[lp.id_learning_path] = lp.nome_learning_path; });

      // { id_service_line: { name, id_learning_path } }
      const slMap = {};
      slRes.data.forEach((sl) => { slMap[sl.id_service_line] = { name: sl.nome_service_line, id_learning_path: sl.id_learning_path }; });

      // { id_area: { name, id_service_line } }
      const areaMap = {};
      areasRes.data.forEach((a) => { areaMap[a.id_area] = { name: a.nome_area, id_service_line: a.id_service_line }; });

      setLearningPathOptions(lpRes.data.map((lp) => lp.nome_learning_path));
      setServiceLineOptions(slRes.data.map((sl) => sl.nome_service_line));
      setAreaOptions(areasRes.data.map((a) => a.nome_area));

      setBadges(badgesRes.data.map((row) => mapBadge(row, areaMap, slMap, lpMap)));
    } catch (error) {
      console.error(error);
    }
  }

  // ── estado derivado ───────────────────────────────────────────────────────

  const filteredBadges = useMemo(
    () => badges.filter((badge) => {
      const matchesLP = !activeFilters.learningPath || badge.learningPath === activeFilters.learningPath;
      const matchesSL = !activeFilters.serviceLine || badge.serviceLine === activeFilters.serviceLine;
      const matchesArea = !activeFilters.area || badge.area === activeFilters.area;
      const matchesSearch = !normalizedSearchTerm || normalizeSearchValue(`${badge.name} ${badge.area}`).includes(normalizedSearchTerm);
      return matchesLP && matchesSL && matchesArea && matchesSearch;
    }),
    [activeFilters, badges, normalizedSearchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBadges.length / cardsPerPage));
  const currentPageClamped = Math.min(currentPage, totalPages);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedBadges = filteredBadges.slice((currentPageClamped - 1) * cardsPerPage, currentPageClamped * cardsPerPage);

  // ── handlers (sem alterações) ─────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isFilterOpen && filterWrapRef.current && !filterWrapRef.current.contains(e.target)) setIsFilterOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isRequirementModalOpen) { setIsRequirementModalOpen(false); return; }
        setIsFilterOpen(false); setModalMode(null); setEditingBadgeId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("keydown", handleEscape); };
  }, [isFilterOpen, isRequirementModalOpen]);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleToggleFilter = () => { setFilterDraft(activeFilters); setIsFilterOpen((p) => !p); };
  const handleFilterDraftChange = (field, value) => setFilterDraft((prev) => ({ ...prev, [field]: value }));
  const handleApplyFilters = () => { setActiveFilters(filterDraft); setCurrentPage(1); setIsFilterOpen(false); };
  const handleClearFilters = () => { const c = getDefaultFilterDraft(); setFilterDraft(c); setActiveFilters(c); setCurrentPage(1); setIsFilterOpen(false); };

  const handleOpenAddBadge = () => {
    setFormData({ ...getDefaultBadgeForm(), learningPath: learningPathOptions[0] ?? "", serviceLine: serviceLineOptions[0] ?? "", area: areaOptions[0] ?? "" });
    setEditingBadgeId(null); setEditingRequirementIndex(null); setIsFilterOpen(false); setModalMode("add");
  };

  const handleOpenEditBadge = (badge) => {
    setFormData({ name: badge.name || "", description: badge.description || "", learningPath: badge.learningPath || learningPathOptions[0] || "", serviceLine: badge.serviceLine || serviceLineOptions[0] || "", area: badge.area || areaOptions[0] || "", validityDate: badge.validityDate || "", status: badge.status || "Ativo", badgeLevel: badge.badgeLevel || "1", points: String(badge.points ?? ""), isSpecial: Boolean(badge.isSpecial), logoFileName: badge.logoFileName || "", logoFile: null, image: badge.image || defaultBadgeImage, requirements: Array.isArray(badge.requirements) ? badge.requirements : [] });
    setEditingBadgeId(badge.id); setEditingRequirementIndex(null); setIsFilterOpen(false); setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null); setEditingBadgeId(null); setIsRequirementModalOpen(false);
    setRequirementModalMode("add"); setRequirementFormData(getDefaultRequirementForm(false));
    setRequirementFormError(""); setEditingRequirementIndex(null);
  };

  const handleCloseRequirementModal = () => {
    setIsRequirementModalOpen(false); setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    setRequirementFormError(""); setEditingRequirementIndex(null);
  };

  const handleFieldChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleBadgeLogoFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setFormData((prev) => ({ ...prev, logoFile: null, logoFileName: "" })); return; }
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, logoFile: file, logoFileName: file.name, image: typeof reader.result === "string" ? reader.result : prev.image }));
    reader.onerror = () => setFormData((prev) => ({ ...prev, logoFile: file, logoFileName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleRequirementFieldChange = (field, value) => { setRequirementFormError(""); setRequirementFormData((prev) => ({ ...prev, [field]: value })); };
  const handleRequirementFileChange = (e) => { const file = e.target.files?.[0] ?? null; setRequirementFormError(""); setRequirementFormData((prev) => ({ ...prev, file, fileName: file ? file.name : "" })); };

  const buildRequirementPayload = () => {
    const title = requirementFormData.title.trim();
    if (!title) return null;
    return { title, description: requirementFormData.description.trim(), level: isEditRequirementMode ? requirementFormData.level || "1" : "", fileName: requirementFormData.fileName || "" };
  };

  const appendRequirementFromDraft = () => {
    const payload = buildRequirementPayload();
    if (!payload) { setRequirementFormError("Preencha o título do requisito para continuar."); return false; }
    setRequirementFormError("");
    setFormData((prev) => {
      if (editingRequirementIndex === null) return { ...prev, requirements: [...prev.requirements, { id: `${Date.now()}-${Math.random()}`, ...payload }] };
      let updated = false;
      const reqs = prev.requirements.map((r, i) => { if (i === editingRequirementIndex) { updated = true; return { ...r, ...payload }; } return r; });
      return { ...prev, requirements: updated ? reqs : [...prev.requirements, { id: `${Date.now()}-${Math.random()}`, ...payload }] };
    });
    setEditingRequirementIndex(null);
    return true;
  };

  const handleOpenRequirementModal = () => {
    const nextMode = isEditMode ? "edit" : "add";
    setRequirementModalMode(nextMode); setRequirementFormError(""); setEditingRequirementIndex(null);
    setRequirementFormData(getDefaultRequirementForm(nextMode === "edit")); setIsRequirementModalOpen(true);
  };

  const handleEditRequirement = (req, idx) => { setRequirementFormError(""); setEditingRequirementIndex(idx); setRequirementFormData({ title: req.title || "", description: req.description || "", level: isEditRequirementMode ? req.level || "1" : "", fileName: req.fileName || "", file: null }); };
  const handleDeleteRequirement = (idxToDelete) => {
    setFormData((prev) => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== idxToDelete) }));
    setEditingRequirementIndex((prev) => { if (prev === null || prev === idxToDelete) return null; return prev > idxToDelete ? prev - 1 : prev; });
    if (editingRequirementIndex === idxToDelete) setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    setRequirementFormError("");
  };
  const handleCancelRequirementEdit = () => { setEditingRequirementIndex(null); setRequirementFormError(""); setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode)); };
  const handleAddMoreRequirements = () => { if (appendRequirementFromDraft()) setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode)); };
  const handleConfirmRequirement = (e) => { e.preventDefault(); if (!appendRequirementFromDraft()) return; setIsRequirementModalOpen(false); setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode)); setEditingRequirementIndex(null); };

  const handleSubmitBadge = (e) => {
    e.preventDefault();
    const sanitizedName = formData.name.trim();
    const parsedPoints = Number(formData.points);
    const badgeLevel = formData.badgeLevel || "1";
    if (!sanitizedName || Number.isNaN(parsedPoints)) return;
    const payload = { name: sanitizedName, description: formData.description.trim(), learningPath: formData.learningPath, serviceLine: formData.serviceLine, area: formData.area, validityDate: formData.validityDate, status: formData.status || "Ativo", badgeLevel, level: levelLabelByRank[badgeLevel] || "Júnior", points: parsedPoints, isSpecial: Boolean(formData.isSpecial), logoFileName: formData.logoFileName, image: formData.image || defaultBadgeImage, requirements: formData.requirements };
    if (isEditMode && editingBadgeId !== null) {
      setBadges((prev) => prev.map((b) => b.id === editingBadgeId ? { ...b, ...payload } : b));
    } else {
      setBadges((prev) => { const nextId = prev.reduce((max, b) => Math.max(max, Number(b.id) || 0), 0) + 1; return [{ id: nextId, ...payload }, ...prev]; });
      setCurrentPage(1);
    }
    handleCloseModal();
  };

  const handlePreviousPage = () => setCurrentPage((p) => Math.max(Math.min(p, totalPages) - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(Math.min(p, totalPages) + 1, totalPages));
  const handlePageSelect = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // ── render (sem alterações) ───────────────────────────────────────────────

  return (
    <section className="softinsa-badges-page" data-node-id="3898:7004">
      <div className="softinsa-badges-hero" data-node-id="3898:7014">
        <h1>Badges</h1>
        <p>Administração central do catálogo de badges e conquistas especiais</p>
      </div>

      <div className="softinsa-badges-toolbar" data-node-id="4123:15986">
        <label className="softinsa-badges-search" aria-label="Pesquisar badges">
          <SearchIcon />
          <input type="text" placeholder="Pesquisar por badge,area..." value={searchTerm} onChange={handleSearchChange} />
        </label>

        <div className="softinsa-badges-filter-wrap" ref={filterWrapRef}>
          <button type="button" className="softinsa-badges-filter-btn" aria-label="Abrir filtro" aria-expanded={isFilterOpen} onClick={handleToggleFilter}>
            <FilterIcon /><span>Filtro</span>
          </button>
          {isFilterOpen ? (
            <div className="softinsa-badges-filter-panel" role="dialog" aria-label="Filtro de badges">
              <div className="softinsa-badges-filter-field">
                <label htmlFor="softinsa-badges-filter-learning-path">Learning Paths:</label>
                <div className="softinsa-badges-select-wrap">
                  <select id="softinsa-badges-filter-learning-path" value={filterDraft.learningPath} onChange={(e) => handleFilterDraftChange("learningPath", e.target.value)}>
                    <option value="">Selecione a Learning Path</option>
                    {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-badges-filter-field">
                <label htmlFor="softinsa-badges-filter-service-line">Service Line:</label>
                <div className="softinsa-badges-select-wrap">
                  <select id="softinsa-badges-filter-service-line" value={filterDraft.serviceLine} onChange={(e) => handleFilterDraftChange("serviceLine", e.target.value)}>
                    <option value="">Selecione a Service Line</option>
                    {serviceLineOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-badges-filter-field">
                <label htmlFor="softinsa-badges-filter-area">Área</label>
                <div className="softinsa-badges-select-wrap">
                  <select id="softinsa-badges-filter-area" value={filterDraft.area} onChange={(e) => handleFilterDraftChange("area", e.target.value)}>
                    <option value="">Selecione a Área</option>
                    {areaOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-badges-filter-actions">
                <button type="button" className="softinsa-badges-filter-submit" onClick={handleApplyFilters}>Filtrar</button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-badges-add-btn" onClick={handleOpenAddBadge}>
          <PlusIcon /><span>Adicionar Badge</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-badges-clear-filter-inline" onClick={handleClearFilters}>Remover filtros</button>
      ) : null}

      <div className="softinsa-badges-grid" data-node-id="4154:3498">
        {paginatedBadges.length > 0 ? (
          paginatedBadges.map((badge) => (
            <article key={badge.id} className="softinsa-badge-card" data-node-id="4194:6043">
              <div className="softinsa-badge-card-image-wrap">
                <img src={badge.image} alt={badge.name} className="softinsa-badge-card-image" />
              </div>
              <div className="softinsa-badge-card-content">
                <div className="softinsa-badge-card-texts">
                  <h3>{badge.name}</h3>
                  <p>Nível: {badge.level}</p>
                  <p>Estado: {badge.status}</p>
                  <p className="softinsa-badge-points">Pontos: {badge.points}<PointIcon /></p>
                </div>
                <button type="button" className="softinsa-badge-edit-btn" aria-label={`Editar ${badge.name}`} onClick={() => handleOpenEditBadge(badge)}>Editar</button>
              </div>
            </article>
          ))
        ) : (
          <div className="softinsa-badges-empty-state">Sem resultados para o filtro aplicado.</div>
        )}
      </div>

      <div className="softinsa-badges-pagination-wrap" data-node-id="4110:4131">
        <div className="softinsa-badges-pagination" aria-label="Paginação">
          <button type="button" className={`softinsa-badges-page-link${currentPageClamped === 1 ? " is-disabled" : ""}`} onClick={handlePreviousPage} disabled={currentPageClamped === 1}>Anterior</button>
          {pageNumbers.map((n) => <button key={n} type="button" className={`softinsa-badges-page-btn${currentPageClamped === n ? " is-active" : ""}`} onClick={() => handlePageSelect(n)}>{n}</button>)}
          <button type="button" className={`softinsa-badges-page-link${currentPageClamped === totalPages ? " is-disabled" : ""}`} onClick={handleNextPage} disabled={currentPageClamped === totalPages}>Próximo</button>
        </div>
      </div>

      {isModalOpen ? (
        <div className="softinsa-badges-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div className="softinsa-badges-modal" data-node-id="4194:6030" role="dialog" aria-label={isEditMode ? "Editar Badge" : "Adicionar Badge"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-badges-modal-header">
              <h2>{isEditMode ? "Editar Badge" : "Adicionar Badge"}</h2>
              <button type="button" className="softinsa-badges-modal-close" aria-label="Fechar modal" onClick={handleCloseModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-badges-modal-form" onSubmit={handleSubmitBadge}>
              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-badge-name">Nome:</label>
                <input id="softinsa-badge-name" type="text" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} required />
              </div>
              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-badge-description">Descrição:</label>
                <textarea id="softinsa-badge-description" value={formData.description} onChange={(e) => handleFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className="softinsa-badges-modal-top-grid">
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-learning-path">Learning Path:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-learning-path" value={formData.learningPath} onChange={(e) => handleFieldChange("learningPath", e.target.value)}>
                      {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-service-line">Service Line:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-service-line" value={formData.serviceLine} onChange={(e) => handleFieldChange("serviceLine", e.target.value)}>
                      {serviceLineOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-area">Área:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-area" value={formData.area} onChange={(e) => handleFieldChange("area", e.target.value)}>
                      {areaOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-validity">Tempo de Validade:</label>
                  <input id="softinsa-badge-validity" type="date" value={formData.validityDate} onChange={(e) => handleFieldChange("validityDate", e.target.value)} />
                </div>
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-status">Estado:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-status" value={formData.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                      <option value="" disabled>Ativo/Inativo</option>
                      {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
              </div>
              <div className="softinsa-badges-modal-bottom-grid">
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-level">Nível:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-level" value={formData.badgeLevel} onChange={(e) => handleFieldChange("badgeLevel", e.target.value)}>
                      {badgeLevelRankOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-points">Pontos:</label>
                  <input id="softinsa-badge-points" type="number" min={0} value={formData.points} onChange={(e) => handleFieldChange("points", e.target.value)} required />
                </div>
                <div className="softinsa-badges-modal-field">
                  <label>Badge Especial?</label>
                  <div className="softinsa-badges-special-options" role="radiogroup" aria-label="Badge especial">
                    <label className="softinsa-badges-special-option"><input type="radio" name="softinsa-badge-special" checked={formData.isSpecial === true} onChange={() => handleFieldChange("isSpecial", true)} /><span>Sim</span></label>
                    <label className="softinsa-badges-special-option"><input type="radio" name="softinsa-badge-special" checked={formData.isSpecial === false} onChange={() => handleFieldChange("isSpecial", false)} /><span>Não</span></label>
                  </div>
                </div>
                <div className="softinsa-badges-modal-field">
                  <label>Logotipo do Badge:</label>
                  <FileSelector fileName={formData.logoFileName} onChange={handleBadgeLogoFileChange} ariaLabel="Selecionar logotipo do badge" />
                  <div className="softinsa-badge-logo-preview-wrap">
                    <img src={formData.image || defaultBadgeImage} alt="Pré-visualização do badge" className="softinsa-badge-logo-preview" />
                  </div>
                </div>
              </div>
              <div className="softinsa-badges-modal-actions-row">
                <button type="button" className="softinsa-badges-requirements-btn" onClick={handleOpenRequirementModal}>
                  {isEditMode ? "Editar Requisitos" : "Adicionar Requisitos"}
                </button>
                <button type="submit" className="softinsa-badges-modal-submit-primary">
                  {isEditMode ? "Editar" : "Adicionar"}
                </button>
              </div>
              {formData.requirements.length > 0 ? <p className="softinsa-badges-requirements-count">Requisitos adicionados: {formData.requirements.length}</p> : null}
            </form>
          </div>
        </div>
      ) : null}

      {isRequirementModalOpen ? (
        <div className="softinsa-requirement-modal-backdrop" role="presentation" onClick={handleCloseRequirementModal}>
          <div className="softinsa-requirement-modal" data-node-id={isEditRequirementMode ? "4194:6737" : "4194:6483"} role="dialog" aria-label={isEditRequirementMode ? "Editar Requisito" : "Adicionar Requisito"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-requirement-modal-header">
              <h3>{isEditRequirementMode ? "Editar Requisito" : "Adicionar Requisito"}</h3>
              <button type="button" className="softinsa-badges-modal-close" aria-label="Fechar modal de requisito" onClick={handleCloseRequirementModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-requirement-modal-form" onSubmit={handleConfirmRequirement}>
              {formData.requirements.length > 0 ? (
                <div className="softinsa-requirement-list">
                  <p className="softinsa-requirement-list-title">Requisitos já adicionados</p>
                  <ul className="softinsa-requirement-list-items">
                    {formData.requirements.map((req, idx) => (
                      <li key={req.id || `${req.title}-${idx}`} className={`softinsa-requirement-list-item${editingRequirementIndex === idx ? " is-editing" : ""}`}>
                        <div className="softinsa-requirement-list-item-text">
                          <strong>{req.title || `Requisito ${idx + 1}`}</strong>
                          {req.description ? <span>{req.description}</span> : null}
                        </div>
                        <div className="softinsa-requirement-list-item-actions">
                          <button type="button" className="softinsa-requirement-item-edit-btn" onClick={() => handleEditRequirement(req, idx)}>Editar</button>
                          <button type="button" className="softinsa-requirement-item-delete-btn" onClick={() => handleDeleteRequirement(idx)}>Apagar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-requirement-title">Título:</label>
                <input id="softinsa-requirement-title" type="text" value={requirementFormData.title} onChange={(e) => handleRequirementFieldChange("title", e.target.value)} />
              </div>
              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-requirement-description">Descrição (opcional):</label>
                <textarea id="softinsa-requirement-description" value={requirementFormData.description} onChange={(e) => handleRequirementFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className={`softinsa-requirement-extra-row${isEditRequirementMode ? " is-edit" : " is-add"}`}>
                {isEditRequirementMode ? (
                  <div className="softinsa-badges-modal-field">
                    <label htmlFor="softinsa-requirement-level">Nível:</label>
                    <div className="softinsa-badges-select-wrap">
                      <select id="softinsa-requirement-level" value={requirementFormData.level} onChange={(e) => handleRequirementFieldChange("level", e.target.value)}>
                        {badgeLevelRankOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select><SelectArrowIcon />
                    </div>
                  </div>
                ) : null}
                <div className="softinsa-badges-modal-field">
                  <label>Logotipo do Requisito (opcional):</label>
                  <FileSelector fileName={requirementFormData.fileName} onChange={handleRequirementFileChange} ariaLabel="Selecionar logotipo do requisito" className="softinsa-requirement-file-field" />
                </div>
                <div className="softinsa-requirement-inline-actions">
                  <button type="button" className="softinsa-requirement-add-more-btn" onClick={handleAddMoreRequirements}>
                    {isEditingRequirementDraft ? <span>Guardar Alterações</span> : <><PlusIcon /><span>Adicionar Mais Requisitos</span></>}
                  </button>
                  {isEditingRequirementDraft ? <button type="button" className="softinsa-requirement-cancel-edit-btn" onClick={handleCancelRequirementEdit}>Cancelar edição</button> : null}
                </div>
              </div>
              {requirementFormError ? <p className="softinsa-requirement-error">{requirementFormError}</p> : null}
              {!isEditingRequirementDraft ? (
                <div className="softinsa-requirement-actions">
                  <button type="submit" className="softinsa-requirement-submit-btn">{isEditRequirementMode ? "Editar" : "Adicionar"}</button>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default SoftinsaBadges;