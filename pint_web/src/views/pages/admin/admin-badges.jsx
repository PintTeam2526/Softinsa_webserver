import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./admin-badges.css";

import { getLearningPaths } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas } from '../../../controllers/areasController'
import { getBadges, createBadge, updateBadge } from '../../../controllers/badgesController'
import { getRequisitosByBadge, createRequisito, updateRequisito, deleteRequisito } from '../../../controllers/requisitosController'

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
const formatBadgeImage = (img) => {
  if (!img) return defaultBadgeImage;
  if (img.startsWith("data:")) return img;
  return `data:image/png;base64,${img}`;   
};

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
    image: formatBadgeImage(row.imagem_badge),      
    logoFileName: row.imagem_badge ?? "",
    validityDate: row.validade ? String(row.validade) : "",
    status: row.estado_a_i ? "Ativo" : "Inativo",
    area: area?.name ?? `ID ${row.id_area}`,
    serviceLine: sl?.name ?? "",
    learningPath: lp ?? "",
    requirements: [],
  };
};

const mapRequisito = (row) => ({
  id: `db-${row.id_requisito}`,
  realId: row.id_requisito,
  title: row.nome_requisito ?? "",
  description: row.descricao_requisito ?? "",
  level: rankByLevelLabel[row.nivel_requisito] ?? "1",
  fileName: row.imagem_requisito ?? "",
});

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
    <svg viewBox="0 0 512 512" fill="currentColor" className="softinsa-badges-icon" aria-hidden="true">
      <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
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
    <label className={`softinsa-badges-file-field d-inline-flex w-100 ${className}`.trim()}>
      <input type="file" accept="image/*" className="softinsa-badges-file-input" onChange={onChange} onClick={(e) => { e.target.value = null; }} aria-label={ariaLabel} />
      <span className="softinsa-badges-file-choose d-inline-flex align-items-center">Choose File</span>
      <span className="softinsa-badges-file-name d-inline-flex align-items-center">{fileName || "No file chosen"}</span>
    </label>
  );
}

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
  const [deletedRequirementIds, setDeletedRequirementIds] = useState([]);
  const [areasRaw, setAreasRaw] = useState([]);
  const [slRaw, setSlRaw] = useState([]);
  const filterWrapRef = useRef(null);

  const cardsPerPage = 8;
  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.learningPath || activeFilters.serviceLine || activeFilters.area);
  const isEditRequirementMode = requirementModalMode === "edit";
  const isEditingRequirementDraft = editingRequirementIndex !== null;
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [badgesData, areasData, slData, lpData] = await Promise.all([
        getBadges(),
        getAreas(),
        getServiceLines(),
        getLearningPaths(),
      ]);

      const lpMap = {};
      lpData.forEach((lp) => { lpMap[lp.id_learning_path] = lp.nome_learning_path; });

      const slMap = {};
      slData.forEach((sl) => { slMap[sl.id_service_line] = { name: sl.nome_service_line, id_learning_path: sl.id_learning_path }; });

      const areaMap = {};
      areasData.forEach((a) => { areaMap[a.id_area] = { name: a.nome_area, id_service_line: a.id_service_line }; });

      setAreasRaw(areasData);
      setSlRaw(slData);

      setLearningPathOptions(lpData.map((lp) => lp.nome_learning_path));
      setServiceLineOptions(slData.map((sl) => sl.nome_service_line));
      setAreaOptions(areasData.map((a) => a.nome_area));

      setBadges(badgesData.map((row) => mapBadge(row, areaMap, slMap, lpMap)));
    } catch (error) {
      console.error(error);
    }
  }

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
    setFormData({
      ...getDefaultBadgeForm(),
      learningPath: learningPathOptions[0] ?? "",
      serviceLine: serviceLineOptions[0] ?? "",
      area: areaOptions[0] ?? "",
      status: "Ativo",
    });
    setEditingBadgeId(null);
    setEditingRequirementIndex(null);
    setIsFilterOpen(false);
    setModalMode("add");
  };

  const handleOpenEditBadge = async (badge) => {
    setFormData({
      name: badge.name || "",
      description: badge.description || "",
      learningPath: badge.learningPath || learningPathOptions[0] || "",
      serviceLine: badge.serviceLine || serviceLineOptions[0] || "",
      area: badge.area || areaOptions[0] || "",
      validityDate: badge.validityDate || "",
      status: badge.status || "Ativo",
      badgeLevel: badge.badgeLevel || "1",
      points: String(badge.points ?? ""),
      isSpecial: Boolean(badge.isSpecial),
      logoFileName: badge.logoFileName || "",
      logoFile: null,
      image: badge.image || defaultBadgeImage,
      requirements: [],
    });

    setEditingBadgeId(badge.id);
    setEditingRequirementIndex(null);
    setDeletedRequirementIds([]);
    setIsFilterOpen(false);
    setModalMode("edit");

    try {
      const reqs = await getRequisitosByBadge(badge.id);
      setFormData((prev) => ({
        ...prev,
        requirements: reqs.map(mapRequisito),
      }));
    } catch (err) {
      console.error("Erro ao carregar requisitos", err);
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingBadgeId(null);
    setIsRequirementModalOpen(false);
    setRequirementModalMode("add");
    setRequirementFormData(getDefaultRequirementForm(false));
    setRequirementFormError("");
    setEditingRequirementIndex(null);
    setDeletedRequirementIds([]);
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
    const req = formData.requirements[idxToDelete];
    // Se o requisito já existe na BD, guardar o id para apagar no submit
    if (req?.realId) {
      setDeletedRequirementIds((prev) => [...prev, req.realId]);
    }

    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== idxToDelete),
    }));
    setEditingRequirementIndex((prev) => {
      if (prev === null || prev === idxToDelete) return null;
      return prev > idxToDelete ? prev - 1 : prev;
    });
    if (editingRequirementIndex === idxToDelete)
      setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    setRequirementFormError("");
  };
  const handleCancelRequirementEdit = () => { setEditingRequirementIndex(null); setRequirementFormError(""); setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode)); };
  const handleAddMoreRequirements = () => { if (appendRequirementFromDraft()) setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode)); };
  const handleConfirmRequirement = (e) => { e.preventDefault(); if (!appendRequirementFromDraft()) return; setIsRequirementModalOpen(false); setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode)); setEditingRequirementIndex(null); };

  const handleSubmitBadge = async (e) => {
    e.preventDefault();
    const sanitizedName = formData.name.trim();
    const parsedPoints = Number(formData.points);
    const badgeLevel = formData.badgeLevel || "1";
    if (!sanitizedName || Number.isNaN(parsedPoints)) return;

    const resolvedArea = areasRaw.find((a) => a.nome_area === formData.area);
    if (!resolvedArea) { console.error("Área não encontrada"); return; }

    const resolvedSL = slRaw.find((sl) => sl.nome_service_line === formData.serviceLine);
    if (!resolvedSL) { console.error("Service Line não encontrada"); return; }

    const rawBase64 =
      formData.image && !formData.image.startsWith("http")
        ? formData.image.replace(/^data:image\/[a-z+]+;base64,/, "")
        : null;

    const badgePayload = {
      nome_badge: sanitizedName,
      descricao_badge: formData.description.trim(),
      id_area: resolvedArea.id_area,
      pontos_badge: parsedPoints,
      pago: Boolean(formData.isSpecial),
      nivel_badge: levelLabelByRank[badgeLevel] || "Júnior",
      imagem_badge: rawBase64 || null,
      sla: resolvedSL.id_service_line,
      estado_a_i: formData.status === "Ativo",
      validade: formData.validityDate !== "" ? parseInt(formData.validityDate, 10) : null,
    };

    try {
      let savedBadgeId = editingBadgeId;

      if (isEditMode && editingBadgeId !== null) {
        await updateBadge(editingBadgeId, badgePayload);
      } else {
        await createBadge(badgePayload);

        const badgesActualizados = await getBadges();
        const badgeCriado = badgesActualizados
          .filter((b) => b.nome_badge === sanitizedName)
          .at(-1);

        if (!badgeCriado) {
          console.error("Badge criado mas não encontrado na lista");
          await loadData();
          handleCloseModal();
          return;
        }

        savedBadgeId = badgeCriado.id_badge;
      }

      // 1. apagar os removidos
      await Promise.all(
        deletedRequirementIds.map((rid) => deleteRequisito(rid))
      );

      // 2. criar / actualizar
      await Promise.all(
        formData.requirements.map((req) => {
          const reqPayload = {
            id_badge: savedBadgeId,
            nome_requisito: req.title,
            descricao_requisito: req.description,
            nivel_requisito: levelLabelByRank[req.level] ?? req.level ?? null,
            imagem_requisito: req.fileName || null,
          };

          if (req.realId) {
            // requisito já existe na BD → update
            return updateRequisito(req.realId, reqPayload);
          } else {
            // requisito novo → create
            return createRequisito(reqPayload);
          }
        })
      );

      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao guardar badge", err);
    }
  };

  const handlePreviousPage = () => setCurrentPage((p) => Math.max(Math.min(p, totalPages) - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(Math.min(p, totalPages) + 1, totalPages));
  const handlePageSelect = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <section className="softinsa-badges-page" data-node-id="3898:7004">
      <div className="softinsa-badges-hero d-flex flex-column justify-content-center" data-node-id="3898:7014">
        <h1>Badges</h1>
        <p>Administração central do catálogo de badges e conquistas especiais</p>
      </div>

      <div className="softinsa-badges-toolbar d-flex align-items-center flex-wrap gap-3" data-node-id="4123:15986">
        <label className="softinsa-badges-search d-inline-flex align-items-center" aria-label="Pesquisar badges">
          <SearchIcon />
          <input type="text" className="w-100" placeholder="Pesquisar por badge,area..." value={searchTerm} onChange={handleSearchChange} />
        </label>

        <div className="softinsa-badges-filter-wrap d-inline-flex" ref={filterWrapRef}>
          <button type="button" className="softinsa-badges-filter-btn d-inline-flex align-items-center" aria-label="Abrir filtro" aria-expanded={isFilterOpen} onClick={handleToggleFilter}>
            <FilterIcon /><span>Filtro</span>
          </button>
          {isFilterOpen ? (
            <div className="softinsa-badges-filter-panel d-flex flex-column" role="dialog" aria-label="Filtro de badges">
              <div className="softinsa-badges-filter-field d-flex flex-column">
                <label htmlFor="softinsa-badges-filter-learning-path">Learning Paths:</label>
                <div className="softinsa-badges-select-wrap">
                  <select id="softinsa-badges-filter-learning-path" className="w-100" value={filterDraft.learningPath} onChange={(e) => handleFilterDraftChange("learningPath", e.target.value)}>
                    <option value="">Selecione a Learning Path</option>
                    {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-badges-filter-field d-flex flex-column">
                <label htmlFor="softinsa-badges-filter-service-line">Service Line:</label>
                <div className="softinsa-badges-select-wrap">
                  <select id="softinsa-badges-filter-service-line" className="w-100" value={filterDraft.serviceLine} onChange={(e) => handleFilterDraftChange("serviceLine", e.target.value)}>
                    <option value="">Selecione a Service Line</option>
                    {serviceLineOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-badges-filter-field d-flex flex-column">
                <label htmlFor="softinsa-badges-filter-area">Área</label>
                <div className="softinsa-badges-select-wrap">
                  <select id="softinsa-badges-filter-area" className="w-100" value={filterDraft.area} onChange={(e) => handleFilterDraftChange("area", e.target.value)}>
                    <option value="">Selecione a Área</option>
                    {areaOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-badges-filter-actions w-100 d-inline-flex align-items-center">
                <button type="button" className="softinsa-badges-filter-submit" onClick={handleApplyFilters}>Filtrar</button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-badges-add-btn d-inline-flex align-items-center" onClick={handleOpenAddBadge}>
          <PlusIcon /><span>Adicionar</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-badges-clear-filter-inline" onClick={handleClearFilters}>Remover filtros</button>
      ) : null}

      {paginatedBadges.length > 0 ? (
        <Row xs={1} sm={2} lg={3} xxl={4} className="g-4" data-node-id="4154:3498">
          {paginatedBadges.map((badge) => (
            <Col key={badge.id}>
              <article className="softinsa-badge-card d-flex flex-column h-100" data-node-id="4194:6043">
                <div className="softinsa-badge-card-image-wrap w-100">
                  <img src={badge.image} alt={badge.name} className="softinsa-badge-card-image w-100 h-100" />
                </div>
                <div className="softinsa-badge-card-content d-flex flex-column align-items-center">
                  <div className="softinsa-badge-card-texts d-flex flex-column align-items-center">
                    <h3>{badge.name}</h3>
                    <p>Nível: {badge.level}</p>
                    <p>Estado: {badge.status}</p>
                    <p className="softinsa-badge-points d-inline-flex align-items-center">Pontos: {badge.points}<PointIcon /></p>
                  </div>
                  <button type="button" className="softinsa-badge-edit-btn" aria-label={`Editar ${badge.name}`} onClick={() => handleOpenEditBadge(badge)}>Editar</button>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="softinsa-badges-empty-state">Sem resultados para o filtro aplicado.</div>
      )}

      <div className="softinsa-badges-pagination-wrap w-100 d-flex justify-content-end" data-node-id="4110:4131">
        <div className="softinsa-badges-pagination d-inline-flex align-items-center" aria-label="Paginação">
          <button type="button" className={`softinsa-badges-page-link${currentPageClamped === 1 ? " is-disabled" : ""}`} onClick={handlePreviousPage} disabled={currentPageClamped === 1}>Anterior</button>
          {pageNumbers.map((n) => <button key={n} type="button" className={`softinsa-badges-page-btn d-inline-flex align-items-center justify-content-center${currentPageClamped === n ? " is-active" : ""}`} onClick={() => handlePageSelect(n)}>{n}</button>)}
          <button type="button" className={`softinsa-badges-page-link${currentPageClamped === totalPages ? " is-disabled" : ""}`} onClick={handleNextPage} disabled={currentPageClamped === totalPages}>Próximo</button>
        </div>
      </div>

      {isModalOpen ? (
        <div className="softinsa-badges-modal-backdrop d-flex align-items-center justify-content-center" role="presentation" onClick={handleCloseModal}>
          <div className="softinsa-badges-modal d-flex flex-column" data-node-id="4194:6030" role="dialog" aria-label={isEditMode ? "Editar Badge" : "Adicionar Badge"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-badges-modal-header d-flex align-items-center justify-content-between">
              <h2>{isEditMode ? "Editar Badge" : "Adicionar Badge"}</h2>
              <button type="button" className="softinsa-badges-modal-close d-inline-flex align-items-center justify-content-center" aria-label="Fechar modal" onClick={handleCloseModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-badges-modal-form d-flex flex-column" onSubmit={handleSubmitBadge}>
              <div className="softinsa-badges-modal-field d-flex flex-column">
                <label htmlFor="softinsa-badge-name">Nome:</label>
                <input id="softinsa-badge-name" type="text" className="w-100" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} required />
              </div>
              <div className="softinsa-badges-modal-field d-flex flex-column">
                <label htmlFor="softinsa-badge-description">Descrição:</label>
                <textarea id="softinsa-badge-description" className="w-100" value={formData.description} onChange={(e) => handleFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className="softinsa-badges-modal-top-grid">
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-learning-path">Learning Path:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-learning-path" className="w-100" value={formData.learningPath} onChange={(e) => handleFieldChange("learningPath", e.target.value)}>
                      {learningPathOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-service-line">Service Line:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-service-line" className="w-100" value={formData.serviceLine} onChange={(e) => handleFieldChange("serviceLine", e.target.value)}>
                      {serviceLineOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-area">Área:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-area" className="w-100" value={formData.area} onChange={(e) => handleFieldChange("area", e.target.value)}>
                      {areaOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-validity">Tempo de Validade:</label>
                  <input
                    id="softinsa-badge-validity"
                    type="number"
                    min={0}
                    className="w-100"
                    placeholder="Nº de dias"
                    value={formData.validityDate}
                    onChange={(e) => handleFieldChange("validityDate", e.target.value)}
                  />
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-status">Estado:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-status" className="w-100" value={formData.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                      <option value="" disabled>Ativo/Inativo</option>
                      {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
              </div>
              <div className="softinsa-badges-modal-bottom-grid">
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-level">Nível:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select id="softinsa-badge-level" className="w-100" value={formData.badgeLevel} onChange={(e) => handleFieldChange("badgeLevel", e.target.value)}>
                      {badgeLevelRankOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select><SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-badge-points">Pontos:</label>
                  <input id="softinsa-badge-points" type="number" min={0} className="w-100" value={formData.points} onChange={(e) => handleFieldChange("points", e.target.value)} required />
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label>Badge Especial?</label>
                  <div className="softinsa-badges-special-options d-inline-flex align-items-center" role="radiogroup" aria-label="Badge especial">
                    <label className="softinsa-badges-special-option d-inline-flex align-items-center"><input type="radio" name="softinsa-badge-special" checked={formData.isSpecial === true} onChange={() => handleFieldChange("isSpecial", true)} /><span>Sim</span></label>
                    <label className="softinsa-badges-special-option d-inline-flex align-items-center"><input type="radio" name="softinsa-badge-special" checked={formData.isSpecial === false} onChange={() => handleFieldChange("isSpecial", false)} /><span>Não</span></label>
                  </div>
                </div>
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label>Logotipo do Badge:</label>
                  <FileSelector fileName={formData.logoFileName} onChange={handleBadgeLogoFileChange} ariaLabel="Selecionar logotipo do badge" />
                  <div className="softinsa-badge-logo-preview-wrap w-100 d-flex align-items-center justify-content-center">
                    <img src={formData.image || defaultBadgeImage} alt="Pré-visualização do badge" className="softinsa-badge-logo-preview" />
                  </div>
                </div>
              </div>
              <div className="softinsa-badges-modal-actions-row d-flex align-items-center justify-content-between">
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
        <div className="softinsa-requirement-modal-backdrop d-flex align-items-center justify-content-center" role="presentation" onClick={handleCloseRequirementModal}>
          <div className="softinsa-requirement-modal d-flex flex-column" data-node-id={isEditRequirementMode ? "4194:6737" : "4194:6483"} role="dialog" aria-label={isEditRequirementMode ? "Editar Requisito" : "Adicionar Requisito"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-requirement-modal-header d-flex align-items-center justify-content-between">
              <h3>{isEditRequirementMode ? "Editar Requisito" : "Adicionar Requisito"}</h3>
              <button type="button" className="softinsa-badges-modal-close d-inline-flex align-items-center justify-content-center" aria-label="Fechar modal de requisito" onClick={handleCloseRequirementModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-requirement-modal-form d-flex flex-column" onSubmit={handleConfirmRequirement}>
              {formData.requirements.length > 0 ? (
                <div className="softinsa-requirement-list">
                  <p className="softinsa-requirement-list-title">Requisitos já adicionados</p>
                  <ul className="softinsa-requirement-list-items">
                    {formData.requirements.map((req, idx) => (
                      <li key={req.id || `${req.title}-${idx}`} className={`softinsa-requirement-list-item d-flex align-items-start justify-content-between${editingRequirementIndex === idx ? " is-editing" : ""}`}>
                        <div className="softinsa-requirement-list-item-text d-flex flex-column">
                          <strong>{req.title || `Requisito ${idx + 1}`}</strong>
                          {req.description ? <span>{req.description}</span> : null}
                        </div>
                        <div className="softinsa-requirement-list-item-actions d-inline-flex flex-wrap">
                          <button type="button" className="softinsa-requirement-item-edit-btn" onClick={() => handleEditRequirement(req, idx)}>Editar</button>
                          <button type="button" className="softinsa-requirement-item-delete-btn" onClick={() => handleDeleteRequirement(idx)}>Apagar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="softinsa-badges-modal-field d-flex flex-column">
                <label htmlFor="softinsa-requirement-title">Título:</label>
                <input id="softinsa-requirement-title" type="text" className="w-100" value={requirementFormData.title} onChange={(e) => handleRequirementFieldChange("title", e.target.value)} />
              </div>
              <div className="softinsa-badges-modal-field d-flex flex-column">
                <label htmlFor="softinsa-requirement-description">Descrição (opcional):</label>
                <textarea id="softinsa-requirement-description" className="w-100" value={requirementFormData.description} onChange={(e) => handleRequirementFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className={`softinsa-requirement-extra-row${isEditRequirementMode ? " is-edit" : " is-add"}`}>
                {isEditRequirementMode ? (
                  <div className="softinsa-badges-modal-field d-flex flex-column">
                    <label htmlFor="softinsa-requirement-level">Nível:</label>
                    <div className="softinsa-badges-select-wrap">
                      <select id="softinsa-requirement-level" className="w-100" value={requirementFormData.level} onChange={(e) => handleRequirementFieldChange("level", e.target.value)}>
                        {badgeLevelRankOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select><SelectArrowIcon />
                    </div>
                  </div>
                ) : null}
                <div className="softinsa-badges-modal-field d-flex flex-column">
                  <label>Logotipo do Requisito (opcional):</label>
                  <FileSelector fileName={requirementFormData.fileName} onChange={handleRequirementFileChange} ariaLabel="Selecionar logotipo do requisito" className="softinsa-requirement-file-field" />
                </div>
                <div className="softinsa-requirement-inline-actions d-flex flex-column">
                  <button type="button" className="softinsa-requirement-add-more-btn d-inline-flex align-items-center" onClick={handleAddMoreRequirements}>
                    {isEditingRequirementDraft ? <span>Guardar Alterações</span> : <><PlusIcon /><span>Adicionar Mais Requisitos</span></>}
                  </button>
                  {isEditingRequirementDraft ? <button type="button" className="softinsa-requirement-cancel-edit-btn" onClick={handleCancelRequirementEdit}>Cancelar edição</button> : null}
                </div>
              </div>
              {requirementFormError ? <p className="softinsa-requirement-error">{requirementFormError}</p> : null}
              {!isEditingRequirementDraft ? (
                <div className="softinsa-requirement-actions d-flex justify-content-end">
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