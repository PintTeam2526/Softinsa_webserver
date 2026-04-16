import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import "./softinsa-badges.css";

const badgeJuniorCitizenDeveloper = "https://www.figma.com/api/mcp/asset/8ac1b8c7-eccc-423b-8373-e25bf82c55b4";

const learningPathOptions = ["Jornada Técnica", "Power Skills"];
const serviceLineOptions = ["Hybrid Cloud", "Data & AI", "Security"];
const areaOptions = ["LowCode (Outsystems)", "Frontend", "Backend", "Data & AI"];
const statusOptions = ["Ativo", "Inativo"];
const badgeLevelRankOptions = ["1", "2", "3", "4", "5"];

const levelLabelByRank = {
  "1": "Júnior",
  "2": "Pleno",
  "3": "Sénior",
  "4": "Especialista",
  "5": "Master",
};

// TODO: Replace all mock data and local options with API data (badges, levels, areas, and statuses).
const badgesRows = Array.from({ length: 40 }, (_, index) => {
  const badgeLevel = String((index % 5) + 1);
  const level = levelLabelByRank[badgeLevel] || "Júnior";
  const area = areaOptions[index % areaOptions.length];
  const status = index % 7 === 0 ? "Inativo" : "Ativo";

  return {
    id: index + 1,
    name: index % 5 === 0 ? "Citizen Architect" : "Citizen Developer",
    description: "",
    learningPath: learningPathOptions[index % learningPathOptions.length],
    serviceLine: serviceLineOptions[index % serviceLineOptions.length],
    area,
    validityDate: "",
    status,
    badgeLevel,
    level,
    points: 100 + (index % 4) * 25,
    isSpecial: index % 6 === 0,
    logoFileName: "",
    image: badgeJuniorCitizenDeveloper,
    requirements: [],
  };
});

const getDefaultFilterDraft = () => ({
  learningPath: "",
  serviceLine: "",
  area: "",
});

const getDefaultBadgeForm = () => ({
  name: "",
  description: "",
  learningPath: "Jornada Técnica",
  serviceLine: "Hybrid Cloud",
  area: "LowCode (Outsystems)",
  validityDate: "",
  status: "",
  badgeLevel: "1",
  points: "",
  isSpecial: true,
  logoFileName: "",
  logoFile: null,
  image: badgeJuniorCitizenDeveloper,
  requirements: [],
});

const getDefaultRequirementForm = (isEditMode = false) => ({
  title: "",
  description: "",
  level: isEditMode ? "1" : "",
  fileName: "",
  file: null,
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-badges-icon" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PointIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="softinsa-badges-point-icon" aria-hidden="true">
      <path
        d="M8 1.5L10 5.5L14.5 6.1L11.2 9.2L12 13.5L8 11.4L4 13.5L4.8 9.2L1.5 6.1L6 5.5L8 1.5Z"
        fill="currentColor"
      />
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
      <input
        type="file"
        accept="image/*"
        className="softinsa-badges-file-input"
        onChange={onChange}
        onClick={(event) => {
          event.target.value = null;
        }}
        aria-label={ariaLabel}
      />
      <span className="softinsa-badges-file-choose">Choose File</span>
      <span className="softinsa-badges-file-name">{fileName || "No file chosen"}</span>
    </label>
  );
}

const SoftinsaBadges = memo(() => {
  const [badges, setBadges] = useState(badgesRows);
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

  const filteredBadges = useMemo(
    () =>
      badges.filter((badge) => {
        const matchesLearningPath = !activeFilters.learningPath || badge.learningPath === activeFilters.learningPath;
        const matchesServiceLine = !activeFilters.serviceLine || badge.serviceLine === activeFilters.serviceLine;
        const matchesArea = !activeFilters.area || badge.area === activeFilters.area;
        const searchableBadge = normalizeSearchValue(`${badge.name} ${badge.area}`);
        const matchesSearch = !normalizedSearchTerm || searchableBadge.includes(normalizedSearchTerm);

        return matchesLearningPath && matchesServiceLine && matchesArea && matchesSearch;
      }),
    [activeFilters.area, activeFilters.learningPath, activeFilters.serviceLine, badges, normalizedSearchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBadges.length / cardsPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedBadges = filteredBadges.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && filterWrapRef.current && !filterWrapRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (isRequirementModalOpen) {
          setIsRequirementModalOpen(false);
          return;
        }

        setIsFilterOpen(false);
        setModalMode(null);
        setEditingBadgeId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFilterOpen, isRequirementModalOpen]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleToggleFilter = () => {
    setFilterDraft(activeFilters);
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

  const handleOpenAddBadge = () => {
    setFormData(getDefaultBadgeForm());
    setEditingBadgeId(null);
    setEditingRequirementIndex(null);
    setIsFilterOpen(false);
    setModalMode("add");
  };

  const handleOpenEditBadge = (badge) => {
    setFormData({
      name: badge.name || "",
      description: badge.description || "",
      learningPath: badge.learningPath || "Jornada Técnica",
      serviceLine: badge.serviceLine || "Hybrid Cloud",
      area: badge.area || "LowCode (Outsystems)",
      validityDate: badge.validityDate || "",
      status: badge.status || "Ativo",
      badgeLevel: badge.badgeLevel || "1",
      points: String(badge.points ?? ""),
      isSpecial: Boolean(badge.isSpecial),
      logoFileName: badge.logoFileName || "",
      logoFile: null,
      image: badge.image || badgeJuniorCitizenDeveloper,
      requirements: Array.isArray(badge.requirements) ? badge.requirements : [],
    });
    setEditingBadgeId(badge.id);
    setEditingRequirementIndex(null);
    setIsFilterOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingBadgeId(null);
    setIsRequirementModalOpen(false);
    setRequirementModalMode("add");
    setRequirementFormData(getDefaultRequirementForm(false));
    setRequirementFormError("");
    setEditingRequirementIndex(null);
  };

  const handleCloseRequirementModal = () => {
    setIsRequirementModalOpen(false);
    setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    setRequirementFormError("");
    setEditingRequirementIndex(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData((previousData) => ({ ...previousData, [field]: value }));
  };

  const handleBadgeLogoFileChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    if (!file) {
      setFormData((previousData) => ({
        ...previousData,
        logoFile: null,
        logoFileName: "",
      }));
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const nextImage = typeof fileReader.result === "string" ? fileReader.result : "";
      setFormData((previousData) => ({
        ...previousData,
        logoFile: file,
        logoFileName: file.name,
        image: nextImage || previousData.image || badgeJuniorCitizenDeveloper,
      }));
    };

    fileReader.onerror = () => {
      setFormData((previousData) => ({
        ...previousData,
        logoFile: file,
        logoFileName: file.name,
      }));
    };

    fileReader.readAsDataURL(file);
  };

  const handleRequirementFieldChange = (field, value) => {
    setRequirementFormError("");
    setRequirementFormData((previousData) => ({ ...previousData, [field]: value }));
  };

  const handleRequirementFileChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setRequirementFormError("");
    setRequirementFormData((previousData) => ({
      ...previousData,
      file,
      fileName: file ? file.name : "",
    }));
  };

  const buildRequirementPayload = () => {
    const title = requirementFormData.title.trim();
    const description = requirementFormData.description.trim();
    const level = isEditRequirementMode ? requirementFormData.level || "1" : "";
    const fileName = requirementFormData.fileName || "";

    if (!title) {
      return null;
    }

    return {
      title,
      description,
      level,
      fileName,
    };
  };

  const appendRequirementFromDraft = () => {
    const payload = buildRequirementPayload();
    if (!payload) {
      setRequirementFormError("Preencha o título do requisito para continuar.");
      return false;
    }

    setRequirementFormError("");

    setFormData((previousData) => {
      if (editingRequirementIndex === null) {
        return {
          ...previousData,
          requirements: [...previousData.requirements, { id: `${Date.now()}-${Math.random()}`, ...payload }],
        };
      }

      let didUpdateRequirement = false;
      const updatedRequirements = previousData.requirements.map((requirement, requirementIndex) => {
        if (requirementIndex === editingRequirementIndex) {
          didUpdateRequirement = true;
          return {
            ...requirement,
            ...payload,
          };
        }

        return requirement;
      });

      if (didUpdateRequirement) {
        return {
          ...previousData,
          requirements: updatedRequirements,
        };
      }

      return {
        ...previousData,
        requirements: [...previousData.requirements, { id: `${Date.now()}-${Math.random()}`, ...payload }],
      };
    });

    setEditingRequirementIndex(null);

    return true;
  };

  const handleOpenRequirementModal = () => {
    const nextMode = isEditMode ? "edit" : "add";
    const isEditRequirement = nextMode === "edit";

    setRequirementModalMode(nextMode);
    setRequirementFormError("");
    setEditingRequirementIndex(null);
    setRequirementFormData(getDefaultRequirementForm(isEditRequirement));
    setIsRequirementModalOpen(true);
  };

  const handleEditRequirement = (requirement, requirementIndex) => {
    setRequirementFormError("");
    setEditingRequirementIndex(requirementIndex);
    setRequirementFormData({
      title: requirement.title || "",
      description: requirement.description || "",
      level: isEditRequirementMode ? requirement.level || "1" : "",
      fileName: requirement.fileName || "",
      file: null,
    });
  };

  const handleDeleteRequirement = (requirementIndexToDelete) => {
    setFormData((previousData) => ({
      ...previousData,
      requirements: previousData.requirements.filter((_, requirementIndex) => requirementIndex !== requirementIndexToDelete),
    }));

    setEditingRequirementIndex((previousIndex) => {
      if (previousIndex === null) {
        return null;
      }

      if (previousIndex === requirementIndexToDelete) {
        return null;
      }

      if (previousIndex > requirementIndexToDelete) {
        return previousIndex - 1;
      }

      return previousIndex;
    });

    if (editingRequirementIndex === requirementIndexToDelete) {
      setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    }

    setRequirementFormError("");
  };

  const handleCancelRequirementEdit = () => {
    setEditingRequirementIndex(null);
    setRequirementFormError("");
    setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
  };

  const handleAddMoreRequirements = () => {
    const didAppend = appendRequirementFromDraft();
    if (didAppend) {
      setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    }
  };

  const handleConfirmRequirement = (event) => {
    event.preventDefault();
    const didAppend = appendRequirementFromDraft();
    if (!didAppend) {
      return;
    }

    setIsRequirementModalOpen(false);
    setRequirementFormData(getDefaultRequirementForm(isEditRequirementMode));
    setEditingRequirementIndex(null);
  };

  const handleSubmitBadge = (event) => {
    event.preventDefault();

    const sanitizedName = formData.name.trim();
    const sanitizedDescription = formData.description.trim();
    const parsedPoints = Number(formData.points);
    const badgeLevel = formData.badgeLevel || "1";
    const level = levelLabelByRank[badgeLevel] || "Júnior";

    if (!sanitizedName || Number.isNaN(parsedPoints)) {
      return;
    }

    const payload = {
      name: sanitizedName,
      description: sanitizedDescription,
      learningPath: formData.learningPath,
      serviceLine: formData.serviceLine,
      area: formData.area,
      validityDate: formData.validityDate,
      status: formData.status || "Ativo",
      badgeLevel,
      level,
      points: parsedPoints,
      isSpecial: Boolean(formData.isSpecial),
      logoFileName: formData.logoFileName,
      image: formData.image || badgeJuniorCitizenDeveloper,
      requirements: formData.requirements,
    };

    if (isEditMode && editingBadgeId !== null) {
      setBadges((previousBadges) =>
        previousBadges.map((badge) => (badge.id === editingBadgeId ? { ...badge, ...payload } : badge))
      );
    } else {
      setBadges((previousBadges) => {
        const nextId = previousBadges.reduce((maxId, badge) => Math.max(maxId, Number(badge.id) || 0), 0) + 1;
        return [{ id: nextId, ...payload }, ...previousBadges];
      });
      setCurrentPage(1);
    }

    handleCloseModal();
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

  return (
    <section className="softinsa-badges-page" data-node-id="3898:7004">
      <div className="softinsa-badges-hero" data-node-id="3898:7014">
        <h1>Badges</h1>
        <p>Administração central do catálogo de badges e conquistas especiais</p>
      </div>

      <div className="softinsa-badges-toolbar" data-node-id="4123:15986">
        <label className="softinsa-badges-search" aria-label="Pesquisar badges">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por badge,area..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-badges-filter-wrap" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-badges-filter-btn"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-badges-filter-panel" role="dialog" aria-label="Filtro de badges">
              <div className="softinsa-badges-filter-field">
                <label htmlFor="softinsa-badges-filter-learning-path">Learning Paths:</label>
                <div className="softinsa-badges-select-wrap">
                  <select
                    id="softinsa-badges-filter-learning-path"
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

              <div className="softinsa-badges-filter-field">
                <label htmlFor="softinsa-badges-filter-service-line">Service Line:</label>
                <div className="softinsa-badges-select-wrap">
                  <select
                    id="softinsa-badges-filter-service-line"
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

              <div className="softinsa-badges-filter-field">
                <label htmlFor="softinsa-badges-filter-area">Área</label>
                <div className="softinsa-badges-select-wrap">
                  <select
                    id="softinsa-badges-filter-area"
                    value={filterDraft.area}
                    onChange={(event) => handleFilterDraftChange("area", event.target.value)}
                  >
                    <option value="">Selecione a Área</option>
                    {areaOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-badges-filter-actions">
                <button type="button" className="softinsa-badges-filter-submit" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-badges-add-btn" onClick={handleOpenAddBadge}>
          <PlusIcon />
          <span>Adicionar Badge</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-badges-clear-filter-inline" onClick={handleClearFilters}>
          Remover filtros
        </button>
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
                  <p className="softinsa-badge-points">
                    Pontos: {badge.points}
                    <PointIcon />
                  </p>
                </div>

                <button
                  type="button"
                  className="softinsa-badge-edit-btn"
                  aria-label={`Editar ${badge.name}`}
                  onClick={() => handleOpenEditBadge(badge)}
                >
                  Editar
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="softinsa-badges-empty-state">Sem resultados para o filtro aplicado.</div>
        )}
      </div>

      <div className="softinsa-badges-pagination-wrap" data-node-id="4110:4131">
        <div className="softinsa-badges-pagination" aria-label="Paginação">
          <button
            type="button"
            className={`softinsa-badges-page-link${currentPage === 1 ? " is-disabled" : ""}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`softinsa-badges-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
              onClick={() => handlePageSelect(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className={`softinsa-badges-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </div>

      {isModalOpen ? (
        <div className="softinsa-badges-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div
            className="softinsa-badges-modal"
            data-node-id="4194:6030"
            role="dialog"
            aria-label={isEditMode ? "Editar Badge" : "Adicionar Badge"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-badges-modal-header">
              <h2>{isEditMode ? "Editar Badge" : "Adicionar Badge"}</h2>
              <button
                type="button"
                className="softinsa-badges-modal-close"
                aria-label="Fechar modal"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-badges-modal-form" onSubmit={handleSubmitBadge}>
              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-badge-name">Nome:</label>
                <input
                  id="softinsa-badge-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  required
                />
              </div>

              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-badge-description">Descrição:</label>
                <textarea
                  id="softinsa-badge-description"
                  value={formData.description}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                ></textarea>
              </div>

              <div className="softinsa-badges-modal-top-grid">
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-learning-path">Learning Path:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select
                      id="softinsa-badge-learning-path"
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

                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-service-line">Service Line:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select
                      id="softinsa-badge-service-line"
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

                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-area">Área:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select
                      id="softinsa-badge-area"
                      value={formData.area}
                      onChange={(event) => handleFieldChange("area", event.target.value)}
                    >
                      {areaOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-validity">Tempo de Validade:</label>
                  <input
                    id="softinsa-badge-validity"
                    type="date"
                    value={formData.validityDate}
                    onChange={(event) => handleFieldChange("validityDate", event.target.value)}
                  />
                </div>

                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-status">Estado:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select
                      id="softinsa-badge-status"
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

              <div className="softinsa-badges-modal-bottom-grid">
                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-level">Nível:</label>
                  <div className="softinsa-badges-select-wrap">
                    <select
                      id="softinsa-badge-level"
                      value={formData.badgeLevel}
                      onChange={(event) => handleFieldChange("badgeLevel", event.target.value)}
                    >
                      {badgeLevelRankOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

                <div className="softinsa-badges-modal-field">
                  <label htmlFor="softinsa-badge-points">Pontos:</label>
                  <input
                    id="softinsa-badge-points"
                    type="number"
                    min={0}
                    value={formData.points}
                    onChange={(event) => handleFieldChange("points", event.target.value)}
                    required
                  />
                </div>

                <div className="softinsa-badges-modal-field">
                  <label>Badge Especial?</label>
                  <div className="softinsa-badges-special-options" role="radiogroup" aria-label="Badge especial">
                    <label className="softinsa-badges-special-option">
                      <input
                        type="radio"
                        name="softinsa-badge-special"
                        checked={formData.isSpecial === true}
                        onChange={() => handleFieldChange("isSpecial", true)}
                      />
                      <span>Sim</span>
                    </label>
                    <label className="softinsa-badges-special-option">
                      <input
                        type="radio"
                        name="softinsa-badge-special"
                        checked={formData.isSpecial === false}
                        onChange={() => handleFieldChange("isSpecial", false)}
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                <div className="softinsa-badges-modal-field">
                  <label>Logotipo do Badge:</label>
                  <FileSelector
                    fileName={formData.logoFileName}
                    onChange={handleBadgeLogoFileChange}
                    ariaLabel="Selecionar logotipo do badge"
                  />
                  <div className="softinsa-badge-logo-preview-wrap">
                    <img
                      src={formData.image || badgeJuniorCitizenDeveloper}
                      alt="Pré-visualização do badge"
                      className="softinsa-badge-logo-preview"
                    />
                  </div>
                </div>
              </div>

              <div className="softinsa-badges-modal-actions-row">
                <button
                  type="button"
                  className="softinsa-badges-requirements-btn"
                  onClick={handleOpenRequirementModal}
                >
                  {isEditMode ? "Editar Requisitos" : "Adicionar Requisitos"}
                </button>

                <button type="submit" className="softinsa-badges-modal-submit-primary">
                  {isEditMode ? "Editar" : "Adicionar"}
                </button>
              </div>

              {formData.requirements.length > 0 ? (
                <p className="softinsa-badges-requirements-count">
                  Requisitos adicionados: {formData.requirements.length}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}

      {isRequirementModalOpen ? (
        <div className="softinsa-requirement-modal-backdrop" role="presentation" onClick={handleCloseRequirementModal}>
          <div
            className="softinsa-requirement-modal"
            data-node-id={isEditRequirementMode ? "4194:6737" : "4194:6483"}
            role="dialog"
            aria-label={isEditRequirementMode ? "Editar Requisito" : "Adicionar Requisito"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-requirement-modal-header">
              <h3>{isEditRequirementMode ? "Editar Requisito" : "Adicionar Requisito"}</h3>
              <button
                type="button"
                className="softinsa-badges-modal-close"
                aria-label="Fechar modal de requisito"
                onClick={handleCloseRequirementModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-requirement-modal-form" onSubmit={handleConfirmRequirement}>
              {formData.requirements.length > 0 ? (
                <div className="softinsa-requirement-list">
                  <p className="softinsa-requirement-list-title">Requisitos já adicionados</p>
                  <ul className="softinsa-requirement-list-items">
                    {formData.requirements.map((requirement, index) => (
                      <li
                        key={requirement.id || `${requirement.title}-${index}`}
                        className={`softinsa-requirement-list-item${editingRequirementIndex === index ? " is-editing" : ""}`}
                      >
                        <div className="softinsa-requirement-list-item-text">
                          <strong>{requirement.title || `Requisito ${index + 1}`}</strong>
                          {requirement.description ? <span>{requirement.description}</span> : null}
                        </div>

                        <div className="softinsa-requirement-list-item-actions">
                          <button
                            type="button"
                            className="softinsa-requirement-item-edit-btn"
                            onClick={() => handleEditRequirement(requirement, index)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="softinsa-requirement-item-delete-btn"
                            onClick={() => handleDeleteRequirement(index)}
                          >
                            Apagar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-requirement-title">Título:</label>
                <input
                  id="softinsa-requirement-title"
                  type="text"
                  value={requirementFormData.title}
                  onChange={(event) => handleRequirementFieldChange("title", event.target.value)}
                />
              </div>

              <div className="softinsa-badges-modal-field">
                <label htmlFor="softinsa-requirement-description">Descrição (opcional):</label>
                <textarea
                  id="softinsa-requirement-description"
                  value={requirementFormData.description}
                  onChange={(event) => handleRequirementFieldChange("description", event.target.value)}
                ></textarea>
              </div>

              <div
                className={`softinsa-requirement-extra-row${isEditRequirementMode ? " is-edit" : " is-add"}`}
              >
                {isEditRequirementMode ? (
                  <div className="softinsa-badges-modal-field">
                    <label htmlFor="softinsa-requirement-level">Nível:</label>
                    <div className="softinsa-badges-select-wrap">
                      <select
                        id="softinsa-requirement-level"
                        value={requirementFormData.level}
                        onChange={(event) => handleRequirementFieldChange("level", event.target.value)}
                      >
                        {badgeLevelRankOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <SelectArrowIcon />
                    </div>
                  </div>
                ) : null}

                <div className="softinsa-badges-modal-field">
                  <label>Logotipo do Requisito (opcional):</label>
                  <FileSelector
                    fileName={requirementFormData.fileName}
                    onChange={handleRequirementFileChange}
                    ariaLabel="Selecionar logotipo do requisito"
                    className="softinsa-requirement-file-field"
                  />
                </div>

                <div className="softinsa-requirement-inline-actions">
                  <button
                    type="button"
                    className="softinsa-requirement-add-more-btn"
                    onClick={handleAddMoreRequirements}
                  >
                    {isEditingRequirementDraft ? (
                      <span>Guardar Alterações</span>
                    ) : (
                      <>
                        <PlusIcon />
                        <span>Adicionar Mais Requisitos</span>
                      </>
                    )}
                  </button>

                  {isEditingRequirementDraft ? (
                    <button
                      type="button"
                      className="softinsa-requirement-cancel-edit-btn"
                      onClick={handleCancelRequirementEdit}
                    >
                      Cancelar edição
                    </button>
                  ) : null}
                </div>
              </div>

              {requirementFormError ? <p className="softinsa-requirement-error">{requirementFormError}</p> : null}

              {!isEditingRequirementDraft ? (
                <div className="softinsa-requirement-actions">
                  <button type="submit" className="softinsa-requirement-submit-btn">
                    {isEditRequirementMode ? "Editar" : "Adicionar"}
                  </button>
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
