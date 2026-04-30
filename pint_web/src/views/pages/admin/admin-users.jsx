import React, { memo, useEffect, useRef, useState } from "react";
import "./softinsa-users.css";

const userAvatarVasco = "https://www.figma.com/api/mcp/asset/54902fd0-73ae-42f2-b5e5-a9d96163e1e2";
const userAvatarPedro = "https://www.figma.com/api/mcp/asset/3bf143d4-10b8-4921-898a-988ff5c7cd4b";
const userAvatarBartolomeu = "https://www.figma.com/api/mcp/asset/633e7e9c-1f1e-4e05-9091-45001cdafb74";

// TODO: Replace all mock data and local options with API data (users, filters, and form options).
const usersRows = [
  {
    id: 1,
    name: "Vasco da Gama",
    email: "vasco150gama@gmail.com",
    learningPath: "Jornada Técnica",
    serviceLine: "Hybrid Cloud",
    area: "LowCode (Outsystems)",
    profile: "Talent Manager",
    status: "Ativo",
    avatar: userAvatarVasco,
  },
  {
    id: 2,
    name: "Pedro Alvares Cabral",
    email: "pedro12alvaro@gmail.com",
    learningPath: "Jornada Técnica",
    serviceLine: "Hybrid Cloud",
    area: "LowCode (Outsystems)",
    profile: "Service Line Lider",
    status: "Inativo",
    avatar: userAvatarPedro,
  },
  {
    id: 3,
    name: "Bartolomeu Dias",
    email: "bartolomeudias05@gmail.com",
    learningPath: "Jornada Técnica",
    serviceLine: "Hybrid Cloud",
    area: "LowCode (Outsystems)",
    profile: "Consultor",
    status: "Ativo",
    avatar: userAvatarBartolomeu,
  },
];

const learningPathOptions = ["Jornada Técnica", "Power Skills"];
const serviceLineOptions = ["Hybrid Cloud", "Data & AI", "Security"];
const areaOptions = ["LowCode (Outsystems)", "Frontend", "Backend"];
const profileOptions = ["Consultor", "Talent Manager", "Service Line Lider"];
const statusOptions = ["Ativo", "Inativo"];

const getDefaultUserForm = () => ({
  name: "",
  email: "",
  learningPath: "Jornada Técnica",
  serviceLine: "Hybrid Cloud",
  area: "LowCode (Outsystems)",
  profile: "Consultor",
  status: "Ativo",
});

const getDefaultFilterDraft = () => ({
  profile: "",
  status: "",
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-icon" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-icon" aria-hidden="true">
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
      className="softinsa-users-pencil-icon"
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
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-users-icon" aria-hidden="true">
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
  const [users, setUsers] = useState(usersRows);
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
  const filterWrapRef = useRef(null);

  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const hasActiveFilters = Boolean(activeFilters.profile || activeFilters.status);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);
  const filteredUsers = users.filter((user) => {
    const matchesProfile = !activeFilters.profile || user.profile === activeFilters.profile;
    const matchesStatus = !activeFilters.status || user.status === activeFilters.status;
    const searchableUser = normalizeSearchValue(`${user.name} ${user.email}`);
    const matchesSearch = !normalizedSearchTerm || searchableUser.includes(normalizedSearchTerm);
    return matchesProfile && matchesStatus && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

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
        setEditingUserId(null);
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenAddUser = () => {
    setFormData(getDefaultUserForm());
    setEditingUserId(null);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("add");
  };

  const handleOpenEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      learningPath: user.learningPath,
      serviceLine: user.serviceLine,
      area: user.area,
      profile: user.profile,
      status: user.status,
    });
    setEditingUserId(user.id);
    setIsFilterOpen(false);
    setIsExportAlertOpen(false);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingUserId(null);
  };

  const handleSubmitUser = (event) => {
    event.preventDefault();

    if (isEditMode && editingUserId !== null) {
      setUsers((previousUsers) =>
        previousUsers.map((user) => (user.id === editingUserId ? { ...user, ...formData } : user))
      );
    } else {
      setUsers((previousUsers) => {
        const nextId = previousUsers.reduce((maxId, user) => Math.max(maxId, Number(user.id) || 0), 0) + 1;
        return [
          {
            id: nextId,
            ...formData,
            avatar: userAvatarVasco,
          },
          ...previousUsers,
        ];
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

    const rowsToExport = filteredUsers.map((user) => ({
      Nome: user.name,
      Email: user.email,
      "Learning Path": user.learningPath,
      "Service Line": user.serviceLine,
      "Área": user.area,
      Perfil: user.profile,
      Estado: user.status,
    }));

    const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);

    try {
      if (exportFormat === "xlsx") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Utilizadores");
        XLSX.writeFile(workbook, `utilizadores-${timestamp}.xlsx`);
      }

      if (exportFormat === "pdf") {
        const [{ jsPDF }, { default: autoTable }] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Listagem de Utilizadores", 14, 14);

        autoTable(doc, {
          startY: 20,
          head: [["Nome", "Email", "Learning Path", "Service Line", "Área", "Perfil", "Estado"]],
          body: rowsToExport.map((row) => [
            row.Nome,
            row.Email,
            row["Learning Path"],
            row["Service Line"],
            row["Área"],
            row.Perfil,
            row.Estado,
          ]),
          styles: { fontSize: 9, cellPadding: 2.4 },
          headStyles: { fillColor: [58, 87, 232] },
        });

        doc.save(`utilizadores-${timestamp}.pdf`);
      }

      setIsExportAlertOpen(false);
      setExportFormat("");
    } catch (error) {
      console.error("Erro ao exportar listagem:", error);
    }
  };

  return (
    <section className="softinsa-users-page" data-node-id="3882:8944">
      <div className="softinsa-users-hero" data-node-id="3882:8950">
        <h1>Utilizadores</h1>
        <p>Controlo de contas, atribuição de permissões e acessos ao sistema</p>
      </div>

      <div className="softinsa-users-toolbar" data-node-id="4111:9084">
        <label className="softinsa-users-search" aria-label="Pesquisar utilizador">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por nome do consultor ou email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <div className="softinsa-users-filter-wrap" ref={filterWrapRef}>
          <button
            type="button"
            className="softinsa-users-filter-btn"
            aria-label="Abrir filtro"
            aria-expanded={isFilterOpen}
            onClick={handleToggleFilter}
          >
            <FilterIcon />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="softinsa-users-filter-panel" data-node-id="4153:12021" role="dialog" aria-label="Filtro de utilizadores">
              <div className="softinsa-users-filter-field">
                <label htmlFor="softinsa-filter-profile">Tipo de perfil</label>
                <div className="softinsa-users-select-wrap softinsa-users-filter-select-wrap">
                  <select
                    id="softinsa-filter-profile"
                    value={filterDraft.profile}
                    onChange={(event) => handleFilterDraftChange("profile", event.target.value)}
                  >
                    <option value="">Selecione o perfil</option>
                    {profileOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SelectArrowIcon />
                </div>
              </div>

              <div className="softinsa-users-filter-field">
                <label htmlFor="softinsa-filter-status">Estado</label>
                <div className="softinsa-users-select-wrap softinsa-users-filter-select-wrap">
                  <select
                    id="softinsa-filter-status"
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

              <div className="softinsa-users-filter-actions">
                <button type="button" className="softinsa-users-filter-clear" onClick={handleClearFilters}>
                  Limpar
                </button>
                <button type="button" className="softinsa-users-filter-submit" onClick={handleApplyFilters}>
                  Filtrar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="softinsa-users-add-btn"
          aria-label="Adicionar utilizador"
          onClick={handleOpenAddUser}
        >
          <PlusIcon />
          <span>Adicionar Utilizador</span>
        </button>
      </div>

      <div className="softinsa-users-table-meta" data-node-id="4123:15417">
        <span>Mostrar</span>
        <div className="softinsa-users-entries-select-wrap">
          <select
            className="softinsa-users-entries-select"
            value={entriesPerPage}
            onChange={handleEntriesChange}
            aria-label="Quantidade de entradas por página"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="softinsa-users-entries-arrow" aria-hidden="true">
            ▾
          </span>
        </div>
        <span>Entradas</span>
        {hasActiveFilters ? (
          <button type="button" className="softinsa-users-clear-filter-inline" onClick={handleClearFilters}>
            Remover filtros
          </button>
        ) : null}
      </div>

      <div className="softinsa-users-table-card" data-node-id="4436:2811">
        <div className="softinsa-users-table-scroll">
          <table className="softinsa-users-table" role="table" aria-label="Tabela de utilizadores">
            <thead>
              <tr>
                <th>UTILIZADOR</th>
                <th>EMAIL</th>
                <th>PERFIL</th>
                <th>ESTADO</th>
                <th>EDITAR</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="softinsa-users-name-cell">
                        <img src={user.avatar} alt={user.name} className="softinsa-users-avatar" />
                        <span className="softinsa-users-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="softinsa-users-email">{user.email}</td>
                    <td>{user.profile}</td>
                    <td>{user.status}</td>
                    <td>
                      <button
                        type="button"
                        className="softinsa-users-edit-btn"
                        aria-label={`Editar ${user.name}`}
                        onClick={() => handleOpenEditUser(user)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-users-empty-row">
                  <td colSpan={5}>Sem resultados para o filtro aplicado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-users-table-footer" data-node-id="4436:2951">
          <button
            type="button"
            className="softinsa-users-export-btn"
            aria-label="Exportar utilizadores"
            onClick={handleOpenExportAlert}
          >
            <ExportIcon />
            <span>Exportar</span>
          </button>

          <div className="softinsa-users-pagination" aria-label="Paginação">
            <button
              type="button"
              className={`softinsa-users-page-link${currentPage === 1 ? " is-disabled" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`softinsa-users-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
                onClick={() => handlePageSelect(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className={`softinsa-users-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {isExportAlertOpen ? (
        <div className="softinsa-users-modal-backdrop" role="presentation" onClick={handleCloseExportAlert}>
          <div
            className="softinsa-users-export-alert"
            data-node-id="4123:15715"
            role="dialog"
            aria-label="Alerta Exportar"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-users-export-alert-header">
              <h3>Alerta</h3>
              <button
                type="button"
                className="softinsa-users-modal-close"
                aria-label="Fechar alerta"
                onClick={handleCloseExportAlert}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="softinsa-users-export-alert-body">
              <h4>Exportar Listagem</h4>
              <p>Qual é o Formato que pretende Exportar?</p>

              <button
                type="button"
                className="softinsa-users-export-option"
                aria-pressed={exportFormat === "xlsx"}
                onClick={() => setExportFormat("xlsx")}
              >
                <span className={`softinsa-users-export-radio${exportFormat === "xlsx" ? " is-active" : ""}`}></span>
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                className="softinsa-users-export-option"
                aria-pressed={exportFormat === "pdf"}
                onClick={() => setExportFormat("pdf")}
              >
                <span className={`softinsa-users-export-radio${exportFormat === "pdf" ? " is-active" : ""}`}></span>
                <span>PDF (.pdf)</span>
              </button>
            </div>

            <div className="softinsa-users-export-alert-actions">
              <button type="button" className="softinsa-users-export-cancel" onClick={handleCloseExportAlert}>
                Cancelar
              </button>
              <button
                type="button"
                className={`softinsa-users-export-confirm${!exportFormat ? " is-disabled" : ""}`}
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
        <div className="softinsa-users-modal-backdrop" role="presentation" onClick={handleCloseModal}>
          <div
            className="softinsa-users-modal"
            data-node-id={isEditMode ? "3882:10265" : "3882:10288"}
            role="dialog"
            aria-label={isEditMode ? "Editar Utilizador" : "Novo Utilizador"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-users-modal-header" data-node-id="3932:7484">
              <h2>{isEditMode ? "Editar Utilizador" : "Novo Utilizador"}</h2>
              <button
                type="button"
                className="softinsa-users-modal-close"
                aria-label="Fechar modal"
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-users-modal-form" onSubmit={handleSubmitUser}>
              <div className="softinsa-users-modal-field">
                <label htmlFor="softinsa-user-name">Nome:</label>
                <input
                  id="softinsa-user-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                />
              </div>

              <div className="softinsa-users-modal-field">
                <label htmlFor="softinsa-user-email">Email:</label>
                <input
                  id="softinsa-user-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                />
              </div>

              <div className="softinsa-users-modal-row">
                <div className="softinsa-users-modal-field">
                  <label htmlFor="softinsa-user-learning-path">Learning Path:</label>
                  <div className="softinsa-users-select-wrap">
                    <select
                      id="softinsa-user-learning-path"
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

                <div className="softinsa-users-modal-field">
                  <label htmlFor="softinsa-user-service-line">Service Line:</label>
                  <div className="softinsa-users-select-wrap">
                    <select
                      id="softinsa-user-service-line"
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

                <div className="softinsa-users-modal-field">
                  <label htmlFor="softinsa-user-area">Área:</label>
                  <div className="softinsa-users-select-wrap">
                    <select
                      id="softinsa-user-area"
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
              </div>

              <div className="softinsa-users-modal-row softinsa-users-modal-row-bottom">
                <div className="softinsa-users-modal-field">
                  <label htmlFor="softinsa-user-profile">Perfil:</label>
                  <div
                    className={`softinsa-users-select-wrap softinsa-users-select-wrap-small${isEditMode ? " is-disabled" : ""}`}
                  >
                    <select
                      id="softinsa-user-profile"
                      value={formData.profile}
                      onChange={(event) => handleFieldChange("profile", event.target.value)}
                      disabled={isEditMode}
                    >
                      {profileOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

                <div className="softinsa-users-modal-field">
                  <label htmlFor="softinsa-user-status">Estado:</label>
                  <div className="softinsa-users-select-wrap softinsa-users-select-wrap-small">
                    <select
                      id="softinsa-user-status"
                      value={formData.status}
                      onChange={(event) => handleFieldChange("status", event.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <SelectArrowIcon />
                  </div>
                </div>

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
