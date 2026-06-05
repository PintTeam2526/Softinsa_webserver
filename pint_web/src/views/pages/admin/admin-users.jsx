import React, { memo, useEffect, useRef, useState } from "react";
import "./admin-users.css";

import { getUtilizadores, createUtilizador, updateUtilizador, tipoByProfile } from '../../../controllers/utilizadoresController'
import { getLearningPaths } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas } from '../../../controllers/areasController'

// Mapeamento tipo_utilizador (BD) → label legível
const profileByTipo = {
  c: "Consultor",
  s: "Service Line Lider",
  t: "Talent Manager",
};

const profileOptions = Object.values(profileByTipo);
const statusOptions = ["Ativo", "Inativo"];

const defaultAvatar = "https://www.figma.com/api/mcp/asset/54902fd0-73ae-42f2-b5e5-a9d96163e1e2";

const formatAvatar = (img) => {
  if (!img) return defaultAvatar;
  if (img.startsWith("data:")) return img;
  return `data:image/jpeg;base64,${img}`;
};

const mapUtilizador = (row) => ({
  id: row.id_utilizador,
  name: row.nome_utilizador,
  email: row.email_utilizador,
  profile: profileByTipo[row.tipo_utilizador] ?? row.tipo_utilizador,
  status: row.estado_a_i ? "Ativo" : "Inativo",
  avatar: formatAvatar(row.imagem_utilizador),
});

const getDefaultUserForm = () => ({
  name: "",
  email: "",
  password: "",
  profile: "Consultor",
  status: "Ativo",

  learningPath: "",
  serviceLine: "",
  area: "",
});

const getDefaultFilterDraft = () => ({ profile: "", status: "" });

const normalizeSearchValue = (value) =>
  String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-icon" aria-hidden="true">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className="softinsa-users-icon" aria-hidden="true">
      <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-icon" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="softinsa-users-pencil-icon" aria-hidden="true">
      <path d="M0 20V15.2778L14.6667 0.638889C14.8889 0.435185 15.1344 0.277778 15.4033 0.166667C15.6722 0.0555557 15.9544 0 16.25 0C16.5455 0 16.8326 0.0555557 17.1111 0.166667C17.3896 0.277778 17.6304 0.444444 17.8333 0.666667L19.3611 2.22222C19.5833 2.42593 19.7455 2.66667 19.8478 2.94444C19.95 3.22222 20.0007 3.5 20 3.77778C20 4.07407 19.9493 4.35667 19.8478 4.62556C19.7463 4.89444 19.5841 5.13963 19.3611 5.36111L4.72222 20H0ZM16.2222 5.33333L17.7778 3.77778L16.2222 2.22222L14.6667 3.77778L16.2222 5.33333Z" fill="#00B8E0" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="softinsa-users-icon" aria-hidden="true">
      <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 10 12 5 7 10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SelectArrowIcon() {
  return (
    <svg viewBox="0 0 18 10" fill="none" className="softinsa-users-select-arrow" aria-hidden="true">
      <path d="M3 2L9 8L15 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const SoftinsaUsers = memo(() => {
  const [users, setUsers] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState(getDefaultFilterDraft());
  const [activeFilters, setActiveFilters] = useState(getDefaultFilterDraft());
  const [searchTerm, setSearchTerm] = useState("");
  const [exportFormat, setExportFormat] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(getDefaultUserForm());
  const [learningPaths, setLearningPaths] = useState([]);
  const [serviceLines, setServiceLines] = useState([]);
  const [areas, setAreas] = useState([]);
  const filterWrapRef = useRef(null);

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {

    loadLearningPaths();
    loadServiceLines();
    loadAreas();

  }, []);

  async function loadLearningPaths() {
    try {
      const data = await getLearningPaths();
      setLearningPaths(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadServiceLines() {
    try {
      const data = await getServiceLines();
      setServiceLines(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAreas() {
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (error) {
      console.error(error);
    }
  }

  function loadUsers() {
    getUtilizadores()
      .then((data) => { setUsers(data.map(mapUtilizador)); })
      .catch((error) => { console.error(error); });
  }

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.profile || activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredUsers = users.filter((user) => {
    const matchesProfile = !activeFilters.profile || user.profile === activeFilters.profile;
    const matchesStatus = !activeFilters.status || user.status === activeFilters.status;
    const matchesSearch = !normalizedSearchTerm || normalizeSearchValue(`${user.name} ${user.email}`).includes(normalizedSearchTerm);
    return matchesProfile && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  useEffect(() => {
    const handleClickOutside = (e) => { if (isFilterOpen && filterWrapRef.current && !filterWrapRef.current.contains(e.target)) setIsFilterOpen(false); };
    const handleEscape = (e) => { if (e.key === "Escape") { setIsFilterOpen(false); setIsExportAlertOpen(false); setModalMode(null); setEditingUserId(null); } };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("keydown", handleEscape); };
  }, [isFilterOpen]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Mudou LP -> limpa SL e Área
      if (field === "learningPath") {
        updated.serviceLine = "";
        updated.area = "";
      }

      // Mudou SL -> limpa Área
      if (field === "serviceLine") {
        updated.area = "";
      }

      return updated;
    });
  };

  const handleOpenAddUser = () => { setFormData(getDefaultUserForm()); setEditingUserId(null); setIsFilterOpen(false); setIsExportAlertOpen(false); setModalMode("add"); };

  const handleOpenEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      profile: user.profile,
      status: user.status,
    });

    setEditingUserId(user.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => { setModalMode(null); setEditingUserId(null); };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (isEditMode && editingUserId !== null) {

      const payload = {
        nome_utilizador: formData.name.trim(),
        email_utilizador: formData.email.trim(),
        estado_a_i: formData.status === "Ativo",
      };

      try {

        await updateUtilizador(editingUserId, payload);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUserId
              ? {
                ...u,
                name: formData.name,
                email: formData.email,
                status: formData.status,
              }
              : u
          )
        );

      } catch (error) {
        console.error(error);
      }

    } else {
      const sanitizedName = formData.name.trim();
      const sanitizedEmail = formData.email.trim();
      if (!sanitizedName || !sanitizedEmail || !formData.password) return;

      if (
        formData.profile === "Consultor" &&
        (
          !formData.learningPath ||
          !formData.serviceLine ||
          !formData.area
        )
      ) {
        return;
      }

      if (
        formData.profile === "Service Line Lider" &&
        (
          !formData.learningPath ||
          !formData.serviceLine
        )
      ) {
        return;
      }

      const payload = {
        nome_utilizador: sanitizedName,
        email_utilizador: sanitizedEmail,
        password_utilizador: formData.password,
        username_utilizador: sanitizedEmail.split("@")[0],
        tipo_utilizador: tipoByProfile[formData.profile] ?? "c",
        imagem_utilizador: "",
        estado_a_i: formData.status === "Ativo",

        id_learning_path:
          formData.profile === "Consultor" ||
            formData.profile === "Service Line Lider"
            ? Number(formData.learningPath)
            : null,

        id_service_line:
          formData.profile === "Consultor" ||
            formData.profile === "Service Line Lider"
            ? Number(formData.serviceLine)
            : null,

        id_area:
          formData.profile === "Consultor"
            ? Number(formData.area)
            : null,
      };

      try {
        await createUtilizador(payload);
        await loadUsers();
        setCurrentPage(1);
      } catch (error) {
        console.error(error);
      }
    }

    handleCloseModal();
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
    const rowsToExport = filteredUsers.map((u) => ({ Nome: u.name, Email: u.email, Perfil: u.profile, Estado: u.status }));
    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rowsToExport), "Utilizadores");
        XLSX.writeFile(wb, `utilizadores-${timestamp}.xlsx`);
      }
      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Utilizadores", 14, 14);
        autoTable(doc, { startY: 20, head: [["Nome", "Email", "Perfil", "Estado"]], body: rowsToExport.map((r) => [r.Nome, r.Email, r.Perfil, r.Estado]), styles: { fontSize: 9, cellPadding: 2.4 }, headStyles: { fillColor: [58, 87, 232] } });
        doc.save(`utilizadores-${timestamp}.pdf`);
      }
      setIsExportAlertOpen(false); setExportFormat("");
    } catch (error) { console.error("Erro ao exportar listagem:", error); }
  };

  const filteredServiceLines = serviceLines.filter(
    (sl) =>
      !formData.learningPath ||
      Number(sl.id_learning_path) === Number(formData.learningPath)
  );

  const filteredAreas = areas.filter(
    (area) =>
      !formData.serviceLine ||
      Number(area.id_service_line) === Number(formData.serviceLine)
  );

  return (
    <section className="softinsa-users-page" data-node-id="3882:8944">
      <div className="softinsa-users-hero d-flex flex-column justify-content-center" data-node-id="3882:8950">
        <h1>Utilizadores</h1>
        <p>Controlo de contas, atribuição de permissões e acessos ao sistema</p>
      </div>

      <div className="softinsa-users-toolbar d-flex align-items-center flex-wrap" data-node-id="4111:9084">
        <label className="softinsa-users-search d-flex align-items-center flex-grow-1" aria-label="Pesquisar utilizador">
          <SearchIcon />
          <input type="text" className="flex-grow-1" placeholder="Pesquisar por nome do consultor ou email..." value={searchTerm} onChange={handleSearchChange} />
        </label>

        <div className="softinsa-users-filter-wrap" ref={filterWrapRef}>
          <button type="button" className="softinsa-users-filter-btn d-inline-flex align-items-center justify-content-center" aria-label="Abrir filtro" aria-expanded={isFilterOpen} onClick={handleToggleFilter}>
            <FilterIcon /><span>Filtro</span>
          </button>
          {isFilterOpen ? (
            <div className="softinsa-users-filter-panel d-flex flex-column" data-node-id="4153:12021" role="dialog" aria-label="Filtro de utilizadores">
              <div className="softinsa-users-filter-field d-flex flex-column">
                <label htmlFor="softinsa-filter-profile">Tipo de perfil</label>
                <div className="softinsa-users-select-wrap softinsa-users-filter-select-wrap">
                  <select id="softinsa-filter-profile" value={filterDraft.profile} onChange={(e) => handleFilterDraftChange("profile", e.target.value)}>
                    <option value="">Selecione o perfil</option>
                    {profileOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-users-filter-field d-flex flex-column">
                <label htmlFor="softinsa-filter-status">Estado</label>
                <div className="softinsa-users-select-wrap softinsa-users-filter-select-wrap">
                  <select id="softinsa-filter-status" value={filterDraft.status} onChange={(e) => handleFilterDraftChange("status", e.target.value)}>
                    <option value="">Selecione o estado</option>
                    {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>
              <div className="softinsa-users-filter-actions d-flex align-items-center">
                <button type="button" className="softinsa-users-filter-clear" onClick={handleClearFilters}>Limpar</button>
                <button type="button" className="softinsa-users-filter-submit" onClick={handleApplyFilters}>Filtrar</button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="softinsa-users-export-btn d-inline-flex align-items-center" aria-label="Exportar utilizadores" onClick={handleOpenExportAlert}>
          <ExportIcon /><span>Exportar</span>
        </button>

        <button type="button" className="softinsa-users-add-btn d-inline-flex align-items-center justify-content-center" aria-label="Adicionar utilizador" onClick={handleOpenAddUser}>
          <PlusIcon /><span>Adicionar</span>
        </button>
      </div>

      <div className="softinsa-users-table-meta d-flex align-items-center" data-node-id="4123:15417">
        <span>Mostrar</span>
        <div className="softinsa-users-entries-select-wrap">
          <select className="softinsa-users-entries-select" value={entriesPerPage} onChange={handleEntriesChange} aria-label="Quantidade de entradas por página">
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="softinsa-users-entries-arrow" aria-hidden="true">▾</span>
        </div>
        <span>Entradas</span>
        {hasActiveFilters ? (
          <button type="button" className="softinsa-users-clear-filter-inline" onClick={handleClearFilters}>Remover filtros</button>
        ) : null}
      </div>

      <div className="softinsa-users-table-card" data-node-id="4436:2811">
        <div className="softinsa-users-table-scroll">
          <table className="softinsa-users-table" role="table" aria-label="Tabela de utilizadores">
            <thead>
              <tr><th>UTILIZADOR</th><th>EMAIL</th><th>PERFIL</th><th>ESTADO</th><th>EDITAR</th></tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="softinsa-users-name-cell d-flex align-items-center">
                        <img src={user.avatar} alt={user.name} className="softinsa-users-avatar rounded-circle" />
                        <span className="softinsa-users-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="softinsa-users-email">{user.email}</td>
                    <td>{user.profile}</td>
                    <td>{user.status}</td>
                    <td>
                      <button type="button" className="softinsa-users-edit-btn" aria-label={`Editar ${user.name}`} onClick={() => handleOpenEditUser(user)}>
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-users-empty-row"><td colSpan={5}>Sem resultados para o filtro aplicado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-users-table-footer d-flex align-items-center justify-content-end" data-node-id="4436:2951">
          <div className="softinsa-users-pagination d-inline-flex align-items-center" aria-label="Paginação">
            <button type="button" className={`softinsa-users-page-link${currentPage === 1 ? " is-disabled" : ""}`} onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
            {pageNumbers.map((n) => <button key={n} type="button" className={`softinsa-users-page-btn d-inline-flex align-items-center justify-content-center${currentPage === n ? " is-active" : ""}`} onClick={() => handlePageSelect(n)}>{n}</button>)}
            <button type="button" className={`softinsa-users-page-link${currentPage === totalPages ? " is-disabled" : ""}`} onClick={handleNextPage} disabled={currentPage === totalPages}>Próximo</button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-users-modal-backdrop d-flex align-items-start justify-content-center" role="presentation" onClick={handleCloseExportAlert}>
          <div className="softinsa-users-export-alert d-flex flex-column" data-node-id="4123:15715" role="dialog" aria-label="Alerta Exportar" onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-users-export-alert-header d-flex align-items-center justify-content-between">
              <h3>Alerta</h3>
              <button type="button" className="softinsa-users-modal-close" aria-label="Fechar alerta" onClick={handleCloseExportAlert}><CloseIcon /></button>
            </div>
            <div className="softinsa-users-export-alert-body d-flex flex-column">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>
              <button type="button" className="softinsa-users-export-option" aria-pressed={exportFormat === "xlsx"} onClick={() => setExportFormat("xlsx")}>
                <span className={`softinsa-users-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span><span>Excel (.xlsx)</span>
              </button>
              <button type="button" className="softinsa-users-export-option" aria-pressed={exportFormat === "pdf"} onClick={() => setExportFormat("pdf")}>
                <span className={`softinsa-users-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span><span>PDF (.pdf)</span>
              </button>
            </div>
            <div className="softinsa-users-export-alert-actions">
              <button type="button" className="softinsa-users-export-cancel" onClick={handleCloseExportAlert}>Cancelar</button>
              <button type="button" className={`softinsa-users-export-confirm${!exportFormat ? " is-disabled" : ""}`} onClick={handleConfirmExport} disabled={!exportFormat}>Exportar</button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="softinsa-users-modal-backdrop d-flex align-items-start justify-content-center" role="presentation" onClick={handleCloseModal}>
          <div className="softinsa-users-modal" data-node-id={isEditMode ? "3882:10265" : "3882:10288"} role="dialog" aria-label={isEditMode ? "Editar Utilizador" : "Novo Utilizador"} onClick={(e) => e.stopPropagation()}>
            <div className="softinsa-users-modal-header d-flex align-items-center justify-content-between" data-node-id="3932:7484">
              <h2>{isEditMode ? "Editar Utilizador" : "Novo Utilizador"}</h2>
              <button type="button" className="softinsa-users-modal-close" aria-label="Fechar modal" onClick={handleCloseModal}><CloseIcon /></button>
            </div>
            <form className="softinsa-users-modal-form d-flex flex-column" onSubmit={handleSubmitUser}>
              <div className="softinsa-users-modal-field d-flex flex-column">
                <label htmlFor="softinsa-user-name">Nome:</label>
                <input id="softinsa-user-name" type="text" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
              </div>
              <div className="softinsa-users-modal-field d-flex flex-column">
                <label htmlFor="softinsa-user-email">Email:</label>
                <input id="softinsa-user-email" type="email" value={formData.email} onChange={(e) => handleFieldChange("email", e.target.value)} />
              </div>
              {!isEditMode ? (
                <div className="softinsa-users-modal-field d-flex flex-column">
                  <label htmlFor="softinsa-user-password">Password:</label>
                  <input
                    id="softinsa-user-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    required
                  />
                </div>
              ) : null}
              {!isEditMode && formData.profile === "Consultor" ? (
                <div className="softinsa-users-modal-row">

                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label>Learning Path:</label>

                    <div className="softinsa-users-select-wrap">
                      <select
                        value={formData.learningPath}
                        onChange={(e) =>
                          handleFieldChange("learningPath", e.target.value)
                        }
                      >
                        <option value="">Selecionar</option>

                        {learningPaths.map((lp) => (
                          <option
                            key={lp.id_learning_path}
                            value={lp.id_learning_path}
                          >
                            {lp.nome_learning_path}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>

                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label>Service Line:</label>

                    <div className="softinsa-users-select-wrap">
                      <select
                        value={formData.serviceLine}
                        onChange={(e) =>
                          handleFieldChange("serviceLine", e.target.value)
                        }
                        disabled={!formData.learningPath}
                      >
                        <option value="">Selecionar</option>

                        {filteredServiceLines.map((sl) => (
                          <option
                            key={sl.id_service_line}
                            value={sl.id_service_line}
                          >
                            {sl.nome_service_line}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>

                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label>Área:</label>

                    <div className="softinsa-users-select-wrap">
                      <select
                        value={formData.area}
                        onChange={(e) =>
                          handleFieldChange("area", e.target.value)
                        }
                        disabled={!formData.serviceLine}
                      >
                        <option value="">Selecionar</option>

                        {filteredAreas.map((area) => (
                          <option
                            key={area.id_area}
                            value={area.id_area}
                          >
                            {area.nome_area}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>

                </div>
              ) : null}

              {!isEditMode && formData.profile === "Service Line Lider" ? (
                <div className="softinsa-users-modal-row">

                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label>Learning Path:</label>

                    <div className="softinsa-users-select-wrap">
                      <select
                        value={formData.learningPath}
                        onChange={(e) =>
                          handleFieldChange("learningPath", e.target.value)
                        }
                      >
                        <option value="">Selecionar</option>

                        {learningPaths.map((lp) => (
                          <option
                            key={lp.id_learning_path}
                            value={lp.id_learning_path}
                          >
                            {lp.nome_learning_path}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>

                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label>Service Line:</label>

                    <div className="softinsa-users-select-wrap">
                      <select
                        value={formData.serviceLine}
                        onChange={(e) =>
                          handleFieldChange("serviceLine", e.target.value)
                        }
                        disabled={!formData.learningPath}
                      >
                        <option value="">Selecionar</option>

                        {filteredServiceLines.map((sl) => (
                          <option
                            key={sl.id_service_line}
                            value={sl.id_service_line}
                          >
                            {sl.nome_service_line}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>

                </div>
              ) : null}

              <div className="softinsa-users-modal-row softinsa-users-modal-row-bottom">

                {!isEditMode ? (
                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label htmlFor="softinsa-user-profile">Perfil:</label>

                    <div className="softinsa-users-select-wrap softinsa-users-select-wrap-small">
                      <select
                        id="softinsa-user-profile"
                        value={formData.profile}
                        onChange={(e) => handleFieldChange("profile", e.target.value)}
                      >
                        {profileOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>
                ) : null}

                {isEditMode ? (
                  <div className="softinsa-users-modal-field d-flex flex-column">
                    <label htmlFor="softinsa-user-status">Estado:</label>

                    <div className="softinsa-users-select-wrap softinsa-users-select-wrap-small">
                      <select
                        id="softinsa-user-status"
                        value={formData.status}
                        onChange={(e) => handleFieldChange("status", e.target.value)}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <SelectArrowIcon />
                    </div>
                  </div>
                ) : null}

                <button type="submit" className="softinsa-users-modal-submit">
                  {isEditMode ? "Confirmar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default SoftinsaUsers;