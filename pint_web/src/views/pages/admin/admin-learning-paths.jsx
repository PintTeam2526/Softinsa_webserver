import React, { memo, useEffect, useRef, useState } from "react";
import "./admin-learning-paths.css";

import { getLearningPaths, createLearningPath, updateLearningPath } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas } from '../../../controllers/areasController'
import { getBadges } from '../../../controllers/badgesController'

const statusOptions = ["Ativo", "Inativo"];

const getDefaultFilterDraft = () => ({
  status: "",
});

const getDefaultLearningPathForm = () => ({
  name: "",
  description: "",
  status: "",
  iconFileName: "",
  iconFile: "",
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const formatLPImage = (img) => {
  if (!img) return "";
  if (img.startsWith("data:")) return img;
  return `data:image/png;base64,${img}`;
};

const mapLearningPath = (row) => ({
  id: row.id_learning_path,
  name: row.nome_learning_path,
  description: row.descricao_learning_path ?? "",
  status: row.estado_a_i ? "Ativo" : "Inativo",
  serviceLines: row.service_lines ?? 0,
  areas: row.areas ?? 0,
  badges: row.badges ?? 0,
  iconFileName: row.imagem_learning_path ?? "",
  image: formatLPImage(row.imagem_learning_path),
});

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-learning-paths-icon" aria-hidden="true">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className="softinsa-learning-paths-icon" aria-hidden="true">
      <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-learning-paths-icon" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="softinsa-learning-paths-pencil-icon" aria-hidden="true">
      <path d="M0 20V15.2778L14.6667 0.638889C14.8889 0.435185 15.1344 0.277778 15.4033 0.166667C15.6722 0.0555557 15.9544 0 16.25 0C16.5455 0 16.8326 0.0555557 17.1111 0.166667C17.3896 0.277778 17.6304 0.444444 17.8333 0.666667L19.3611 2.22222C19.5833 2.42593 19.7455 2.66667 19.8478 2.94444C19.95 3.22222 20.0007 3.5 20 3.77778C20 4.07407 19.9493 4.35667 19.8478 4.62556C19.7463 4.89444 19.5841 5.13963 19.3611 5.36111L4.72222 20H0ZM16.2222 5.33333L17.7778 3.77778L16.2222 2.22222L14.6667 3.77778L16.2222 5.33333Z" fill="#00B8E0" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="softinsa-learning-paths-icon" aria-hidden="true">
      <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 10 12 5 7 10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SelectArrowIcon() {
  return (
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-learning-paths-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-learning-paths-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FileSelector({ fileName, onChange, ariaLabel }) {
  return (
    <label className="softinsa-learning-paths-file-field d-inline-flex w-100">
      <input
        type="file"
        accept="image/*"
        className="softinsa-learning-paths-file-input"
        onChange={onChange}
        onClick={(event) => { event.target.value = null; }}
        aria-label={ariaLabel}
      />
      <span className="softinsa-learning-paths-file-choose d-inline-flex align-items-center">Choose File</span>
      <span className="softinsa-learning-paths-file-name d-inline-flex align-items-center">{fileName || "No file chosen"}</span>
    </label>
  );
}

const SoftinsaLearningPaths = memo(() => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingLearningPathId, setEditingLearningPathId] = useState(null);
  const [formData, setFormData] = useState(getDefaultLearningPathForm());
  const filterWrapRef = useRef(null);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  function loadLearningPaths() {
    Promise.all([
      getLearningPaths(),
      getServiceLines(),
      getAreas(),
      getBadges(),
    ])
      .then(([lpData, slData, areasData, badgesData]) => {

        const slToLP = {};
        slData.forEach((sl) => { slToLP[sl.id_service_line] = sl.id_learning_path; });

        const areaToLP = {};
        areasData.forEach((a) => {
          const lpId = slToLP[a.id_service_line];
          if (lpId !== undefined) areaToLP[a.id_area] = lpId;
        });

        const slCountByLP = {};
        const areaCountByLP = {};
        const badgeCountByLP = {};

        slData.forEach((sl) => {
          slCountByLP[sl.id_learning_path] = (slCountByLP[sl.id_learning_path] ?? 0) + 1;
        });

        areasData.forEach((a) => {
          const lpId = slToLP[a.id_service_line];
          if (lpId !== undefined)
            areaCountByLP[lpId] = (areaCountByLP[lpId] ?? 0) + 1;
        });

        badgesData.forEach((b) => {
          const lpId = areaToLP[b.id_area];
          if (lpId !== undefined)
            badgeCountByLP[lpId] = (badgeCountByLP[lpId] ?? 0) + 1;
        });

        setLearningPaths(
          lpData.map((row) => ({
            ...mapLearningPath(row),
            serviceLines: slCountByLP[row.id_learning_path] ?? 0,
            areas: areaCountByLP[row.id_learning_path] ?? 0,
            badges: badgeCountByLP[row.id_learning_path] ?? 0,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredLearningPaths = learningPaths.filter((learningPathItem) => {
    const matchesStatus = !activeFilters.status || learningPathItem.status === activeFilters.status;
    const matchesSearch = !normalizedSearchTerm || normalizeSearchValue(learningPathItem.name).includes(normalizedSearchTerm);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLearningPaths.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedLearningPaths = filteredLearningPaths.slice(
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
        setEditingLearningPathId(null);
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
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleFieldChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleIconFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
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

  const handleOpenAddLearningPath = () => {
    setFormData(getDefaultLearningPathForm());
    setEditingLearningPathId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditLearningPath = (learningPathItem) => {
    setFormData({
      name: learningPathItem.name || "",
      description: learningPathItem.description || "",
      status: learningPathItem.status || "Ativo",
      iconFileName: learningPathItem.iconFileName || "",
      iconFile: null,
      image: learningPathItem.image || "",
    });
    setEditingLearningPathId(learningPathItem.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingLearningPathId(null);
  };

  const handleSubmitLearningPath = async (event) => {
    event.preventDefault();
    const sanitizedName = formData.name.trim();
    if (!sanitizedName) return;

    const rawBase64 = formData.image
      ? formData.image.replace(/^data:image\/[a-z+]+;base64,/, "")
      : "";

    const payload = {
      nome_learning_path: sanitizedName,
      descricao_learning_path: formData.description.trim(),
      estado_a_i: formData.status === "Ativo",
      imagem_learning_path: rawBase64 || null,
    };

    try {
      if (isEditMode && editingLearningPathId !== null) {
        const response = await updateLearningPath(editingLearningPathId, payload);
        const updated = response.dados;

        setLearningPaths((prev) =>
          prev.map((item) => {
            if (item.id !== editingLearningPathId) return item;
            return {
              ...item,
              name: updated.nome_learning_path,
              description: updated.descricao_learning_path ?? "",
              status: updated.estado_a_i ? "Ativo" : "Inativo",
              iconFileName: updated.imagem_learning_path ?? "",
              image: formatLPImage(updated.imagem_learning_path),
            };
          })
        );
      } else {
        await createLearningPath({ ...payload, data_insercao: new Date().toISOString() });
        loadLearningPaths();
        setCurrentPage(1);
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Ocorreu um erro ao guardar a Learning Path.");
    }
  };

  const handleToggleFilter = () => {
    setFilterDraft(activeFilters);
    setIsExportAlertOpen(false);
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilterDraftChange = (field, value) =>
    setFilterDraft((prev) => ({ ...prev, [field]: value }));

  const handleApplyFilters = () => {
    setActiveFilters(filterDraft);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const cleared = getDefaultFilterDraft();
    setFilterDraft(cleared);
    setActiveFilters(cleared);
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

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageSelect = (page) => setCurrentPage(page);

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
    if (!exportFormat) return;

    const rowsToExport = filteredLearningPaths.map((item) => ({
      Nome: item.name,
      "Service Lines": item.serviceLines,
      Áreas: item.areas,
      Badges: item.badges,
      Estado: item.status,
    }));

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);

    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Learning Paths");
        XLSX.writeFile(workbook, `learning-paths-${timestamp}.xlsx`);
      }

      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Learning Paths", 14, 14);
        autoTable(doc, {
          startY: 20,
          head: [["Nome", "Service Lines", "Áreas", "Badges", "Estado"]],
          body: rowsToExport.map((row) => [
            row.Nome, String(row["Service Lines"]), String(row.Áreas), String(row.Badges), row.Estado,
          ]),
          styles: { fontSize: 9, cellPadding: 2.4 },
          headStyles: { fillColor: [58, 87, 232] },
        });
        doc.save(`learning-paths-${timestamp}.pdf`);
      }

      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      console.error("Falha ao exportar learning paths", error);
    }
  };

  return (
    <section className="softinsa-learning-paths-page" data-node-id="3899:14482">
      <div className="softinsa-learning-paths-hero d-flex flex-column justify-content-center" data-node-id="3899:14488">
        <h1>Learning Paths</h1>
        <p>Criar e gerir as jornadas de formação da empresa</p>
      </div>

      <div className="softinsa-learning-paths-toolbar d-flex align-items-center flex-wrap gap-3">
        <label className="softinsa-learning-paths-search d-inline-flex align-items-center" aria-label="Pesquisar learning paths">
          <SearchIcon />
          <input
            type="text"
            className="w-100"
            placeholder="Pesquisar Learning Path..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-learning-paths-filter-wrap d-inline-flex" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-learning-paths-filter-btn d-inline-flex align-items-center"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-learning-paths-filter-panel d-flex flex-column" role="dialog" aria-label="Filtro de learning paths" data-node-id="4729:3275">
              <div className="softinsa-learning-paths-filter-field d-flex flex-column">
                <label htmlFor="softinsa-learning-paths-filter-status">Estado</label>
                <div className="softinsa-learning-paths-select-wrap">
                  <select
                    id="softinsa-learning-paths-filter-status"
                    className="w-100"
                    value={filterDraft.status}
                    onChange={(event) => handleFilterDraftChange("status", event.target.value)}
                  >
                    <option value="">Selecione o estado</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-learning-paths-filter-actions w-100 d-inline-flex align-items-center">
                <button type="button" className="softinsa-learning-paths-filter-submit w-100" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-learning-paths-export-btn d-inline-flex align-items-center" onClick={handleOpenExportAlert}>
          <ExportIcon />
          <span>Exportar</span>
        </button>

        <button type="button" className="softinsa-learning-paths-add-btn d-inline-flex align-items-center" onClick={handleOpenAddLearningPath}>
          <PlusIcon />
          <span>Adicionar</span>
        </button>
      </div>

      {hasActiveFilters ? (
        <button type="button" className="softinsa-learning-paths-clear-filter-inline" onClick={handleClearFilters}>
          Remover filtros
        </button>
      ) : null}

      <div className="softinsa-learning-paths-table-meta d-inline-flex align-items-center flex-wrap">
        <span>Mostrar</span>
        <div className="softinsa-learning-paths-entries-select-wrap">
          <select
            className="softinsa-learning-paths-entries-select"
            aria-label="Entradas por página"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            {[10, 50, 100].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="softinsa-learning-paths-entries-arrow">▼</span>
        </div>
        <span>Entradas</span>
      </div>

      <div className="softinsa-learning-paths-table-card">
        <div className="softinsa-learning-paths-table-scroll w-100">
          <table className="softinsa-learning-paths-table" aria-label="Tabela de learning paths">
            <thead>
              <tr>
                <th>NOME</th>
                <th>SERVICE LINES</th>
                <th>ÁREAS</th>
                <th>BADGES</th>
                <th>ESTADO</th>
                <th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedLearningPaths.length > 0 ? (
                paginatedLearningPaths.map((learningPathItem) => (
                  <tr key={learningPathItem.id}>
                    <td>{learningPathItem.name}</td>
                    <td>{learningPathItem.serviceLines}</td>
                    <td>{learningPathItem.areas}</td>
                    <td>{learningPathItem.badges}</td>
                    <td>{learningPathItem.status}</td>
                    <td>
                      <button
                        type="button"
                        className="softinsa-learning-paths-edit-btn d-inline-flex align-items-center justify-content-center"
                        aria-label={`Editar ${learningPathItem.name}`}
                        onClick={() => handleOpenEditLearningPath(learningPathItem)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-learning-paths-empty-row">
                  <td colSpan={6}>Sem resultados para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-learning-paths-table-footer d-flex align-items-center justify-content-end">
          <div className="softinsa-learning-paths-pagination d-inline-flex align-items-center" aria-label="Paginação">
            <button
              type="button"
              className={`softinsa-learning-paths-page-link${currentPage === 1 ? " is-disabled" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`softinsa-learning-paths-page-btn d-inline-flex align-items-center justify-content-center${currentPage === pageNumber ? " is-active" : ""}`}
                onClick={() => handlePageSelect(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className={`softinsa-learning-paths-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-learning-paths-modal-backdrop d-flex align-items-start justify-content-center" role="presentation" onClick={handleCloseExportAlert}>
          <div className="softinsa-learning-paths-export-alert d-flex flex-column" role="dialog" aria-label="Exportar learning paths" onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-learning-paths-export-alert-header d-flex align-items-center justify-content-between">
              <h3>Exportar</h3>
              <button type="button" className="softinsa-learning-paths-modal-close d-inline-flex align-items-center justify-content-center" aria-label="Fechar exportação" onClick={handleCloseExportAlert}>
                <CloseIcon />
              </button>
            </div>
            <div className="softinsa-learning-paths-export-alert-body d-flex flex-column">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>
              <button type="button" className="softinsa-learning-paths-export-option d-inline-flex align-items-center" aria-pressed={exportFormat === "xlsx"} onClick={() => setExportFormat("xlsx")}>
                <span className={`softinsa-learning-paths-export-radio d-inline-flex align-items-center justify-content-center rounded-circle${exportFormat === "xlsx" ? " is-active" : ""}`}></span>
                <span>Excel (.xlsx)</span>
              </button>
              <button type="button" className="softinsa-learning-paths-export-option d-inline-flex align-items-center" aria-pressed={exportFormat === "pdf"} onClick={() => setExportFormat("pdf")}>
                <span className={`softinsa-learning-paths-export-radio d-inline-flex align-items-center justify-content-center rounded-circle${exportFormat === "pdf" ? " is-active" : ""}`}></span>
                <span>PDF (.pdf)</span>
              </button>
            </div>
            <div className="softinsa-learning-paths-export-alert-actions d-inline-flex align-items-center justify-content-end">
              <button type="button" className="softinsa-learning-paths-export-cancel" onClick={handleCloseExportAlert}>Cancelar</button>
              <button type="button" className={`softinsa-learning-paths-export-confirm${!exportFormat ? " is-disabled" : ""}`} onClick={handleConfirmExport} disabled={!exportFormat}>
                Exportar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="softinsa-learning-paths-modal-backdrop d-flex align-items-start justify-content-center" role="presentation" onClick={handleCloseModal}>
          <div className="softinsa-learning-paths-modal" data-node-id="3986:5193" role="dialog" aria-label={isEditMode ? "Editar Learning Path" : "Adicionar Learning Path"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-learning-paths-modal-header d-flex align-items-center justify-content-between">
              <h2>{isEditMode ? "Editar Learning Path" : "Adicionar Learning Path"}</h2>
              <button type="button" className="softinsa-learning-paths-modal-close d-inline-flex align-items-center justify-content-center" aria-label="Fechar modal" onClick={handleCloseModal}>
                <CloseIcon />
              </button>
            </div>
            <form className="softinsa-learning-paths-modal-form d-flex flex-column" onSubmit={handleSubmitLearningPath}>
              <div className="softinsa-learning-paths-modal-field d-flex flex-column">
                <label htmlFor="softinsa-learning-path-name">Nome:</label>
                <input id="softinsa-learning-path-name" type="text" className="w-100" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} required />
              </div>
              <div className="softinsa-learning-paths-modal-field d-flex flex-column">
                <label htmlFor="softinsa-learning-path-description">Descrição:</label>
                <textarea id="softinsa-learning-path-description" className="w-100" value={formData.description} onChange={(e) => handleFieldChange("description", e.target.value)}></textarea>
              </div>
              <div className="softinsa-learning-paths-modal-row-bottom w-100">
                <div className="softinsa-learning-paths-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-learning-path-status">Estado</label>
                  <div className="softinsa-learning-paths-select-wrap">
                    <select id="softinsa-learning-path-status" className="w-100" value={formData.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                      <option value="" disabled>Ativo/Inativo</option>
                      {statusOptions.map((option) => {

                        const cannotDeactivate =
                          option === "Inativo" &&
                          isEditMode &&
                          (
                            formData.serviceLines > 0 ||
                            formData.areas > 0 ||
                            formData.badges > 0
                          );

                        return (
                          <option
                            key={option}
                            value={option}
                            disabled={cannotDeactivate}
                          >
                            {option}
                          </option>
                        );
                      })}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>
                <div className="softinsa-learning-paths-modal-field d-flex flex-column">
                  <label>Icon</label>
                  <FileSelector fileName={formData.iconFileName} onChange={handleIconFileChange} ariaLabel="Selecionar icon da learning path" />
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Pré-visualização"
                      style={{ marginTop: 8, maxHeight: 64, objectFit: "contain" }}
                    />
                  ) : null}
                </div>
                <button type="submit" className="softinsa-learning-paths-modal-submit">
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

export default SoftinsaLearningPaths;