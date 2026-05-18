import React, { memo, useEffect, useMemo, useState } from "react";
import "./admin-rgpd.css";

const POLICY_STORAGE_KEY = "softinsa.rgpd.policy";
const ACCEPTANCE_STORAGE_KEY = "softinsa.rgpd.acceptance";

const DEFAULT_POLICY = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore`;

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-rgpd-close-icon" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const SoftinsaRgpd = memo(() => {
  const [policyText, setPolicyText] = useState(() => {
    try {
      return localStorage.getItem(POLICY_STORAGE_KEY) || DEFAULT_POLICY;
    } catch (error) {
      return DEFAULT_POLICY;
    }
  });
  const [savedPolicyText, setSavedPolicyText] = useState(policyText);
  const [saveStatus, setSaveStatus] = useState("");

  const [acceptance, setAcceptance] = useState(() => {
    try {
      const storedAcceptance = localStorage.getItem(ACCEPTANCE_STORAGE_KEY);
      if (!storedAcceptance) return null;
      const parsedAcceptance = JSON.parse(storedAcceptance);
      return parsedAcceptance && typeof parsedAcceptance === "object" ? parsedAcceptance : null;
    } catch (error) {
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

  const isConsentModalOpen = !hasAcceptedCurrentVersion;

  useEffect(() => {
    if (!saveStatus) return;
    const timeoutId = window.setTimeout(() => setSaveStatus(""), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [saveStatus]);

  const handleSavePolicy = () => {
    const trimmedPolicy = policyText.trim();
    if (!trimmedPolicy) return;

    try {
      localStorage.setItem(POLICY_STORAGE_KEY, policyText);
      setSavedPolicyText(policyText);
      setSaveStatus("Política guardada com sucesso.");
    } catch (error) {
      setSaveStatus("Não foi possível guardar a política.");
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
          value={policyText}
          onChange={(event) => setPolicyText(event.target.value)}
          rows={16}
          aria-label="Texto das políticas RGPD"
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
            disabled={!isDirty || !policyText.trim()}
          >
            Guardar
          </button>
        </div>
      </div>

      {isConsentModalOpen ? (
        <div className="softinsa-rgpd-modal-backdrop softinsa-rgpd-consent-backdrop" role="presentation">
          <div className="softinsa-rgpd-consent-modal" role="dialog" aria-label="Aceitação de termos RGPD">
            <h2>Aceitação de termos</h2>
            <p>Primeiro acesso detetado. Para continuar no portal, confirme a política abaixo.</p>

            <div className="softinsa-rgpd-consent-policy">{savedPolicyText}</div>

            <label className="softinsa-rgpd-consent-item">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(event) => {
                  setConsentChecked(event.target.checked);
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
