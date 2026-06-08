import React, { memo, useEffect, useMemo, useState } from "react";
import "./admin-rgpd.css";

import { getRGPD, updateRGPD } from '../../../controllers/gestaoController'

const ACCEPTANCE_STORAGE_KEY = "softinsa.rgpd.acceptance";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-rgpd-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const SoftinsaRgpd = memo(() => {
  const [policyText, setPolicyText] = useState("");
  const [savedPolicyText, setSavedPolicyText] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [acceptance, setAcceptance] = useState(() => {
    try {
      const stored = localStorage.getItem(ACCEPTANCE_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      localStorage.removeItem(ACCEPTANCE_STORAGE_KEY);
      return null;
    }
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");

  const isDirty = policyText !== savedPolicyText;

  const hasAcceptedCurrentVersion = useMemo(() => {
    if (!savedPolicyText.trim()) return true;
    return Boolean(acceptance && acceptance.version === savedPolicyText);
  }, [acceptance, savedPolicyText]);

  const isConsentModalOpen = !isLoading && !hasAcceptedCurrentVersion;

  // Carrega a política da API
  useEffect(() => {
    const fetchPolicy = async () => {
      setIsLoading(true);
      try {
        const data = await getRGPD();
        const text = data?.politica ?? "";
        setPolicyText(text);
        setSavedPolicyText(text);
      } catch {
        setSaveStatus("Não foi possível carregar a política.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  // Limpa a mensagem de estado após 3 s
  useEffect(() => {
    if (!saveStatus) return;
    const id = window.setTimeout(() => setSaveStatus(""), 3000);
    return () => window.clearTimeout(id);
  }, [saveStatus]);

  const handleSavePolicy = async () => {
    const trimmed = policyText.trim();
    if (!trimmed) return;

    setIsSaving(true);
    try {
      await updateRGPD({ politica: policyText });
      setSavedPolicyText(policyText);
      setSaveStatus("Política guardada com sucesso.");
    } catch {
      setSaveStatus("Não foi possível guardar a política.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptPolicy = () => {
    if (!consentChecked) {
      setConsentError("Para continuar, aceite a política.");
      return;
    }

    const nextAcceptance = {
      version: savedPolicyText,
      acceptedAt: new Date().toISOString(),
    };

    localStorage.setItem(ACCEPTANCE_STORAGE_KEY, JSON.stringify(nextAcceptance));
    setAcceptance(nextAcceptance);
    setConsentChecked(false);
    setConsentError("");
  };

  const handleRejectPolicy = () => {
    setConsentChecked(false);
    setConsentError("Sem aceitação não é possível concluir o primeiro acesso.");
  };

  return (
    <section className="softinsa-rgpd-page">
      <div className="softinsa-rgpd-hero">
        <h1>RGPD</h1>
        <p>Configuração de políticas de privacidade e gestão de termos de aceitação</p>
      </div>

      <div className="softinsa-rgpd-editor-card">
        <label className="softinsa-rgpd-editor-label" htmlFor="softinsa-rgpd-policy">
          Políticas RGPD:
        </label>

        <textarea
          id="softinsa-rgpd-policy"
          className="softinsa-rgpd-editor-textarea"
          value={isLoading ? "" : policyText}
          onChange={(e) => setPolicyText(e.target.value)}
          rows={16}
          placeholder={isLoading ? "A carregar política..." : ""}
          aria-label="Texto das políticas RGPD"
          disabled={isLoading || isSaving}
        />

        <div className="softinsa-rgpd-editor-actions">
          {saveStatus ? (
            <span className="softinsa-rgpd-editor-status" role="status">
              {saveStatus}
            </span>
          ) : null}

          <button
            type="button"
            className="softinsa-rgpd-editor-save"
            onClick={handleSavePolicy}
            disabled={isLoading || isSaving || !isDirty || !policyText.trim()}
          >
            {isSaving ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>

      {isConsentModalOpen ? (
        <div className="softinsa-rgpd-modal-backdrop softinsa-rgpd-consent-backdrop" role="presentation">
          <div className="softinsa-rgpd-consent-modal" role="dialog" aria-label="Aceitação de termos RGPD">
            <h2>Teste de Aceitação de Termos</h2>
            <p>Formulário apresentado no Registo da aplicação.</p>

            <div className="softinsa-rgpd-consent-policy">{savedPolicyText}</div>

            <label className="softinsa-rgpd-consent-item">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  if (consentError) setConsentError("");
                }}
              />
              <span>Li e aceito as políticas RGPD.</span>
            </label>

            {consentError ? <p className="softinsa-rgpd-consent-error">{consentError}</p> : null}

            <div className="softinsa-rgpd-consent-actions">
              <button type="button" className="softinsa-rgpd-consent-reject" onClick={handleRejectPolicy}>
                Recusar
              </button>
              <button
                type="button"
                className={`softinsa-rgpd-consent-accept${!consentChecked ? " is-disabled" : ""}`}
                onClick={handleAcceptPolicy}
                disabled={!consentChecked}
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