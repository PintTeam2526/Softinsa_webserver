import React, { memo, useEffect, useMemo, useState } from "react";
import "./softinsa-rgpd.css";

const ACCEPTANCE_STORAGE_KEY = "softinsa.rgpd.acceptance";

// TODO: Replace static terms with API data when backend endpoints are available.
const initialTerms = [
  {
    id: 1,
    name: "Privacidade",
    description: "Tratamento geral de dados",
    mandatory: true,
    updatedAt: "2025-01-15T09:10:00.000Z",
  },
  {
    id: 2,
    name: "Privacidade",
    description: "Consentimento para perfis publicos e partilha no LinkedIn.",
    mandatory: true,
    updatedAt: "2025-01-18T10:45:00.000Z",
  },
  {
    id: 3,
    name: "Privacidade",
    description: "Regras de conduta e utilizacao do portal web e mobile.",
    mandatory: true,
    updatedAt: "2025-01-22T14:30:00.000Z",
  },
];

const getDefaultTermForm = () => ({
  name: "",
  description: "",
});

const normalizeSearchValue = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const formatDateLabel = (value) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short" }).format(parsedDate);
};

const formatDateTimeLabel = (value) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(parsedDate);
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-rgpd-icon" aria-hidden="true">
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-rgpd-icon" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="softinsa-rgpd-pencil-icon"
      aria-hidden="true"
    >
      <path
        d="M0 20V15.2778L14.6667 0.638889C14.8889 0.435185 15.1344 0.277778 15.4033 0.166667C15.6722 0.0555557 15.9544 0 16.25 0C16.5455 0 16.8326 0.0555557 17.1111 0.166667C17.3896 0.277778 17.6304 0.444444 17.8333 0.666667L19.3611 2.22222C19.5833 2.42593 19.7455 2.66667 19.8478 2.94444C19.95 3.22222 20.0007 3.5 20 3.77778C20 4.07407 19.9493 4.35667 19.8478 4.62556C19.7463 4.89444 19.5841 5.13963 19.3611 5.36111L4.72222 20H0ZM16.2222 5.33333L17.7778 3.77778L16.2222 2.22222L14.6667 3.77778L16.2222 5.33333Z"
        fill="#00B8E0"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-rgpd-status-icon" aria-hidden="true">
      <path
        d="M12 3L19 6V11.3C19 16 15.8 20.4 12 21C8.2 20.4 5 16 5 11.3V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 12.2L11.2 14.4L15 10.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-rgpd-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const SoftinsaRgpd = memo(() => {
  const [terms, setTerms] = useState(initialTerms);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingTermId, setEditingTermId] = useState(null);
  const [formData, setFormData] = useState(getDefaultTermForm());

  const [acceptance, setAcceptance] = useState(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [consentChecks, setConsentChecks] = useState({});
  const [consentError, setConsentError] = useState("");

  const isTermModalOpen = modalMode !== null;
  const isEditMode = modalMode === "edit";
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  useEffect(() => {
    try {
      const storedAcceptance = localStorage.getItem(ACCEPTANCE_STORAGE_KEY);
      if (!storedAcceptance) {
        return;
      }

      const parsedAcceptance = JSON.parse(storedAcceptance);
      if (parsedAcceptance && typeof parsedAcceptance === "object") {
        setAcceptance(parsedAcceptance);
      }
    } catch (error) {
      console.error("Nao foi possivel carregar estado de aceitação RGPD:", error);
      localStorage.removeItem(ACCEPTANCE_STORAGE_KEY);
    }
  }, []);

  const mandatoryTerms = useMemo(() => terms.filter((term) => term.mandatory), [terms]);

  const consentVersion = useMemo(() => {
    if (mandatoryTerms.length === 0) {
      return "";
    }

    return mandatoryTerms
      .map((term) => `${term.id}|${term.updatedAt}|${term.name}|${term.description}`)
      .join("::");
  }, [mandatoryTerms]);

  const hasAcceptedCurrentVersion = useMemo(() => {
    if (mandatoryTerms.length === 0) {
      return true;
    }

    return Boolean(acceptance && acceptance.version === consentVersion);
  }, [acceptance, consentVersion, mandatoryTerms.length]);

  useEffect(() => {
    if (mandatoryTerms.length === 0) {
      setIsConsentModalOpen(false);
      return;
    }

    if (!hasAcceptedCurrentVersion) {
      setConsentChecks((previousChecks) => {
        const nextChecks = {};

        mandatoryTerms.forEach((term) => {
          nextChecks[term.id] = Boolean(previousChecks[term.id]);
        });

        return nextChecks;
      });
      setConsentError("");
      setIsConsentModalOpen(true);
    }
  }, [hasAcceptedCurrentVersion, mandatoryTerms]);

  const filteredTerms = terms.filter((term) => {
    const searchableTerm = normalizeSearchValue(`${term.name} ${term.description}`);
    return !normalizedSearchTerm || searchableTerm.includes(normalizedSearchTerm);
  });

  const totalPages = Math.max(1, Math.ceil(filteredTerms.length / entriesPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedTerms = filteredTerms.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const allMandatoryChecked = mandatoryTerms.every((term) => Boolean(consentChecks[term.id]));

  const acceptedAtLabel = acceptance && acceptance.acceptedAt ? formatDateTimeLabel(acceptance.acceptedAt) : "";

  const handleOpenAddTerm = () => {
    setFormData(getDefaultTermForm());
    setEditingTermId(null);
    setModalMode("add");
  };

  const handleOpenEditTerm = (term) => {
    setFormData({
      name: term.name,
      description: term.description,
    });
    setEditingTermId(term.id);
    setModalMode("edit");
  };

  const handleCloseTermModal = () => {
    setModalMode(null);
    setEditingTermId(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData((previousData) => ({ ...previousData, [field]: value }));
  };

  const handleSubmitTerm = (event) => {
    event.preventDefault();

    const sanitizedName = formData.name.trim();
    const sanitizedDescription = formData.description.trim();

    if (!sanitizedName || !sanitizedDescription) {
      return;
    }

    const timestamp = new Date().toISOString();
    const payload = {
      name: sanitizedName,
      description: sanitizedDescription,
      mandatory: true,
      updatedAt: timestamp,
    };

    if (isEditMode && editingTermId !== null) {
      setTerms((previousTerms) =>
        previousTerms.map((term) => (term.id === editingTermId ? { ...term, ...payload } : term))
      );
    } else {
      setTerms((previousTerms) => {
        const nextId = previousTerms.reduce((maxId, term) => Math.max(maxId, Number(term.id) || 0), 0) + 1;
        return [{ id: nextId, ...payload }, ...previousTerms];
      });
      setCurrentPage(1);
    }

    handleCloseTermModal();
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

  const handleConsentCheckChange = (termId, checked) => {
    setConsentChecks((previousChecks) => ({
      ...previousChecks,
      [termId]: checked,
    }));

    if (consentError) {
      setConsentError("");
    }
  };

  const handleAcceptTerms = () => {
    if (!allMandatoryChecked) {
      setConsentError("Para continuar, aceite todos os termos.");
      return;
    }

    const nextAcceptance = {
      version: consentVersion,
      acceptedAt: new Date().toISOString(),
    };

    // TODO: Persist acceptance per user through API instead of localStorage.
    localStorage.setItem(ACCEPTANCE_STORAGE_KEY, JSON.stringify(nextAcceptance));
    setAcceptance(nextAcceptance);
    setConsentError("");
    setIsConsentModalOpen(false);
  };

  const handleRejectTerms = () => {
    const nextChecks = {};

    mandatoryTerms.forEach((term) => {
      nextChecks[term.id] = false;
    });

    setConsentChecks(nextChecks);
    setConsentError("Sem aceitação nao e possivel concluir o primeiro acesso.");
  };

  const handleSimulateFirstAccess = () => {
    localStorage.removeItem(ACCEPTANCE_STORAGE_KEY);
    setAcceptance(null);
    setConsentError("");
    setIsConsentModalOpen(true);
  };

  return (
    <section className="softinsa-rgpd-page" data-node-id="3895:4291">
      <div className="softinsa-rgpd-hero" data-node-id="3895:4301">
        <h1>RGPD</h1>
        <p>Configuracao de politicas de privacidade e gestao de termos de aceitação</p>
      </div>

      <div className={`softinsa-rgpd-consent-card${hasAcceptedCurrentVersion ? " is-accepted" : " is-pending"}`}>
        <div className="softinsa-rgpd-consent-main">
          <span className="softinsa-rgpd-consent-icon" aria-hidden="true">
            <ShieldIcon />
          </span>
          <div className="softinsa-rgpd-consent-content">
            <h3>Fluxo de primeiro acesso</h3>
            <p>
              {hasAcceptedCurrentVersion
                ? `Termos aceites na versao atual em ${acceptedAtLabel}.`
                : "Os utilizadores devem aceitar os termos no primeiro acesso."}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="softinsa-rgpd-consent-action"
          onClick={handleSimulateFirstAccess}
          aria-label="Simular primeiro acesso"
        >
          Simular primeiro acesso
        </button>
      </div>

      <div className="softinsa-rgpd-toolbar" data-node-id="3942:5626">
        <label className="softinsa-rgpd-search" aria-label="Pesquisar termo RGPD">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar por nome ou descricao..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <button type="button" className="softinsa-rgpd-add-btn" onClick={handleOpenAddTerm}>
          <PlusIcon />
          <span>Adicionar RGPD</span>
        </button>
      </div>

      <div className="softinsa-rgpd-table-meta">
        <span>Mostrar</span>
        <div className="softinsa-rgpd-entries-select-wrap">
          <select
            className="softinsa-rgpd-entries-select"
            value={entriesPerPage}
            onChange={handleEntriesChange}
            aria-label="Quantidade de entradas por pagina"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="softinsa-rgpd-entries-arrow" aria-hidden="true">
            ▾
          </span>
        </div>
        <span>Entradas</span>
      </div>

      <div className="softinsa-rgpd-table-card" data-node-id="3959:6262">
        <div className="softinsa-rgpd-table-scroll">
          <table className="softinsa-rgpd-table" role="table" aria-label="Tabela de termos RGPD">
            <thead>
              <tr>
                <th>NOME</th>
                <th>DESCRICAO</th>
                <th>ULTIMA ATUALIZACAO</th>
                <th>EDITAR</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTerms.length > 0 ? (
                paginatedTerms.map((term) => (
                  <tr key={term.id}>
                    <td>{term.name}</td>
                    <td>{term.description}</td>
                    <td>{formatDateLabel(term.updatedAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="softinsa-rgpd-edit-btn"
                        aria-label={`Editar termo ${term.name}`}
                        onClick={() => handleOpenEditTerm(term)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="softinsa-rgpd-empty-row">
                  <td colSpan={4}>Sem resultados para a pesquisa atual.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="softinsa-rgpd-table-footer">
          <div className="softinsa-rgpd-total">{filteredTerms.length} termos</div>

          <div className="softinsa-rgpd-pagination" aria-label="Paginacao">
            <button
              type="button"
              className={`softinsa-rgpd-page-link${currentPage === 1 ? " is-disabled" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`softinsa-rgpd-page-btn${currentPage === pageNumber ? " is-active" : ""}`}
                onClick={() => handlePageSelect(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className={`softinsa-rgpd-page-link${currentPage === totalPages ? " is-disabled" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Proximo
            </button>
          </div>
        </div>
      </div>

      {isTermModalOpen ? (
        <div className="softinsa-rgpd-modal-backdrop" role="presentation" onClick={handleCloseTermModal}>
          <div
            className="softinsa-rgpd-form-modal"
            role="dialog"
            aria-label={isEditMode ? "Editar termo RGPD" : "Adicionar termo RGPD"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="softinsa-rgpd-form-modal-header">
              <h2>{isEditMode ? "Editar RGPD" : "Adicionar RGPD"}</h2>
              <button
                type="button"
                className="softinsa-rgpd-modal-close"
                aria-label="Fechar modal"
                onClick={handleCloseTermModal}
              >
                <CloseIcon />
              </button>
            </div>

            <form className="softinsa-rgpd-form-modal-body" onSubmit={handleSubmitTerm}>
              <div className="softinsa-rgpd-field">
                <label htmlFor="softinsa-rgpd-name">Nome</label>
                <input
                  id="softinsa-rgpd-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  required
                />
              </div>

              <div className="softinsa-rgpd-field">
                <label htmlFor="softinsa-rgpd-description">Descricao</label>
                <textarea
                  id="softinsa-rgpd-description"
                  value={formData.description}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                  required
                ></textarea>
              </div>

              <div className="softinsa-rgpd-form-actions">
                <button type="button" className="softinsa-rgpd-form-cancel" onClick={handleCloseTermModal}>
                  Cancelar
                </button>
                <button type="submit" className="softinsa-rgpd-form-submit">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isConsentModalOpen ? (
        <div className="softinsa-rgpd-modal-backdrop softinsa-rgpd-consent-backdrop" role="presentation">
          <div className="softinsa-rgpd-consent-modal" role="dialog" aria-label="Aceitação de termos RGPD">
            <h2>Aceitacao de termos</h2>
            <p>
              Primeiro acesso detetado. Para continuar no portal, confirme os termos abaixo.
            </p>

            <div className="softinsa-rgpd-consent-list">
              {mandatoryTerms.map((term) => (
                <label className="softinsa-rgpd-consent-item" key={term.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(consentChecks[term.id])}
                    onChange={(event) => handleConsentCheckChange(term.id, event.target.checked)}
                  />
                  <span>
                    <strong>{term.name}</strong>
                    <small>{term.description}</small>
                  </span>
                </label>
              ))}
            </div>

            {consentError ? <p className="softinsa-rgpd-consent-error">{consentError}</p> : null}

            <div className="softinsa-rgpd-consent-actions">
              <button type="button" className="softinsa-rgpd-consent-reject" onClick={handleRejectTerms}>
                Recusar
              </button>
              <button
                type="button"
                className={`softinsa-rgpd-consent-accept${!allMandatoryChecked ? " is-disabled" : ""}`}
                onClick={handleAcceptTerms}
                disabled={!allMandatoryChecked}
              >
                Aceitar e continuar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default SoftinsaRgpd;
