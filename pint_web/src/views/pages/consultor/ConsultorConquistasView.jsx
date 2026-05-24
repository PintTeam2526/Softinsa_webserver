import { useEffect, useState } from 'react'
import { HiOutlineStar } from 'react-icons/hi2'

import outsystems1 from '../../../assets/images/badges/outsystems_1.png'
import outsystems3 from '../../../assets/images/badges/outsystems_3.png'
import outsystemsSpecial from '../../../assets/images/badges/outsystems_special.png'
import tm1 from '../../../assets/images/badges/tm_1.png'
import devops2 from '../../../assets/images/badges/devops_2.png'

import { getConquistasConsultor } from '../../../controllers/conquistasController'
import './ConsultorConquistasView.css'

// ─── Badge por id_conquista ───────────────────────────────────────────────────

const BADGE_MAP = {
  1: outsystems1,
  2: outsystems3,
  3: devops2,
  4: tm1,
  5: outsystemsSpecial,
  6: outsystems1,
  7: outsystems3,
  8: devops2,
  9: tm1,
  10: outsystemsSpecial,
}

function resolveBadge(id) {
  return BADGE_MAP[id] ?? outsystems1
}

// ─── Cálculo de progresso no front ───────────────────────────────────────────

function calcularProgresso(conquista, total_badges, total_pontos) {
  const desc = conquista.descricao_conquista?.toLowerCase() ?? ''
  const meta = parseInt(desc)   // extrai o número (1, 5, 10, 50, 100…)

  if (isNaN(meta) || meta === 0) return 0

  const valor = desc.includes('ponto') ? total_pontos : total_badges
  return Math.min(Math.round((valor / meta) * 100), 100)
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

function IconConquistas({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.75 0.000285335C8.922 0.000285335 7.411 0.161285 6.248 0.357285L6.114 0.380285C5.104 0.549285 4.264 0.690285 3.607 1.49829C3.187 2.01729 3.05 2.57829 3.019 3.20329L2.527 3.36729C2.064 3.52129 1.657 3.65729 1.336 3.80729C0.988 3.96929 0.669 4.17729 0.425 4.51628C0.181 4.85528 0.084 5.22329 0.04 5.60429C-3.72529e-08 5.95729 0 6.38429 0 6.87329V7.01828C0 7.42028 -2.79397e-08 7.77528 0.03 8.07228C0.062 8.39328 0.133 8.70629 0.31 9.00829C0.489 9.31129 0.727 9.52528 0.993 9.70928C1.238 9.87928 1.548 10.0523 1.9 10.2473L4.54 11.7143C5.08 12.7753 5.821 13.7213 6.84 14.4043C7.727 15.0003 8.792 15.3743 10.053 15.4733C10.0191 15.5618 10.0011 15.6555 10 15.7503V17.5003H8.57C8.16542 17.5003 7.77334 17.6405 7.46047 17.897C7.14761 18.1535 6.9333 18.5105 6.854 18.9073L6.635 20.0003H4.75C4.55109 20.0003 4.36032 20.0793 4.21967 20.22C4.07902 20.3606 4 20.5514 4 20.7503C4 20.9492 4.07902 21.14 4.21967 21.2806C4.36032 21.4213 4.55109 21.5003 4.75 21.5003H16.75C16.9489 21.5003 17.1397 21.4213 17.2803 21.2806C17.421 21.14 17.5 20.9492 17.5 20.7503C17.5 20.5514 17.421 20.3606 17.2803 20.22C17.1397 20.0793 16.9489 20.0003 16.75 20.0003H14.865L14.646 18.9073C14.5667 18.5105 14.3524 18.1535 14.0395 17.897C13.7267 17.6405 13.3346 17.5003 12.93 17.5003H11.5V15.7503C11.4989 15.6555 11.4809 15.5618 11.447 15.4733C12.708 15.3733 13.773 15.0003 14.66 14.4053C15.68 13.7213 16.42 12.7753 16.96 11.7143L19.6 10.2473C19.952 10.0523 20.262 9.87928 20.507 9.70928C20.772 9.52528 21.011 9.31129 21.189 9.00928C21.367 8.70628 21.439 8.39328 21.47 8.07228C21.5 7.77528 21.5 7.42028 21.5 7.01828V6.87329C21.5 6.38529 21.5 5.95729 21.46 5.60429C21.416 5.22329 21.32 4.85428 21.075 4.51628C20.831 4.17729 20.512 3.96929 20.165 3.80629C19.842 3.65629 19.436 3.52129 18.973 3.36729L18.481 3.20329C18.451 2.57729 18.314 2.01729 17.893 1.49829C17.237 0.689285 16.397 0.548285 15.387 0.380285L15.252 0.357285C13.7639 0.11277 12.258 -0.00664758 10.75 0.000285335ZM13.335 20.0003L13.175 19.2013C13.1637 19.1446 13.1331 19.0937 13.0884 19.057C13.0438 19.0204 12.9878 19.0003 12.93 19.0003H8.57C8.51223 19.0003 8.45625 19.0204 8.41158 19.057C8.36692 19.0937 8.33632 19.1446 8.325 19.2013L8.165 20.0003H13.335ZM3.038 4.77829L3.052 4.77328C3.124 6.29328 3.295 7.97329 3.723 9.54329L2.657 8.95228C2.268 8.73528 2.024 8.59929 1.848 8.47729C1.686 8.36429 1.633 8.29729 1.604 8.24728C1.574 8.19728 1.542 8.11929 1.522 7.92329C1.50133 7.61107 1.49399 7.29812 1.5 6.98528V6.91228C1.5 6.37328 1.501 6.03229 1.53 5.77429C1.558 5.53629 1.602 5.44729 1.642 5.39329C1.681 5.33829 1.751 5.26828 1.968 5.16728C2.204 5.05728 2.528 4.94929 3.038 4.77829ZM18.448 4.77228C18.377 6.29228 18.205 7.97228 17.778 9.54228L18.843 8.95129C19.232 8.73429 19.476 8.59828 19.652 8.47628C19.814 8.36329 19.867 8.29629 19.896 8.24629C19.926 8.19629 19.958 8.11829 19.978 7.92229C19.999 7.70828 20 7.42929 20 6.98429V6.91129C20 6.37229 19.999 6.03128 19.97 5.77328C19.942 5.53528 19.898 5.44629 19.858 5.39229C19.819 5.33729 19.749 5.26728 19.532 5.16629C19.296 5.05628 18.972 4.94729 18.462 4.77629L18.448 4.77228ZM6.498 1.83629C7.90352 1.6062 9.32579 1.49381 10.75 1.50029C12.49 1.50029 13.917 1.65329 15.002 1.83629C16.209 2.04029 16.462 2.11629 16.729 2.44429C16.991 2.76629 17.016 3.07229 16.962 4.42729C16.872 6.68529 16.574 9.12329 15.652 10.9773C15.196 11.8913 14.6 12.6393 13.825 13.1593C13.054 13.6763 12.059 14.0003 10.75 14.0003C9.441 14.0003 8.447 13.6763 7.676 13.1593C6.9 12.6393 6.304 11.8913 5.849 10.9763C4.926 9.12329 4.629 6.68629 4.539 4.42629C4.485 3.07229 4.509 2.76629 4.772 2.44429C5.038 2.11629 5.291 2.04029 6.498 1.83629Z" fill="currentColor" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function progressTier(progress) {
  if (progress >= 100) return 'is-tier-4'
  if (progress >= 75) return 'is-tier-3'
  if (progress >= 50) return 'is-tier-2'
  if (progress >= 25) return 'is-tier-1'
  return 'is-tier-0'
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function ConquistaRow({ conquista, total_badges, total_pontos }) {
  const progress = calcularProgresso(conquista, total_badges, total_pontos)
  const tier = progressTier(progress)

  return (
    <tr>
      <td>
        <div className="consultor-conquistas-description-cell">
          <img src={resolveBadge(conquista.id_conquista)} alt="" className="consultor-conquistas-thumb" />
          <span className="consultor-conquistas-description-text">{conquista.descricao_conquista}</span>
        </div>
      </td>

      <td>
        <span className="consultor-conquistas-points-cell">
          <span>{conquista.pontos_conquista}</span>
          <HiOutlineStar className="consultor-conquistas-points-icon" aria-hidden="true" />
        </span>
      </td>

      <td>
        <div
          className="consultor-conquistas-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`consultor-conquistas-progress-bar ${tier}`}
            style={{ width: `${Math.max(progress, 8)}%` }}
          >
            {progress}%
          </div>
        </div>
      </td>
    </tr>
  )
}

// ─── Estados de UI ────────────────────────────────────────────────────────────

function LoadingRows() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i} className="consultor-conquistas-skeleton-row">
      <td><div className="consultor-conquistas-skeleton consultor-conquistas-skeleton--desc" /></td>
      <td><div className="consultor-conquistas-skeleton consultor-conquistas-skeleton--pts" /></td>
      <td><div className="consultor-conquistas-skeleton consultor-conquistas-skeleton--bar" /></td>
    </tr>
  ))
}

function ErrorMessage({ message, onRetry }) {
  return (
    <tr>
      <td colSpan={3} className="consultor-conquistas-feedback-cell">
        <p className="consultor-conquistas-error">{message}</p>
        <button className="consultor-conquistas-retry-btn" onClick={onRetry} type="button">
          Tentar novamente
        </button>
      </td>
    </tr>
  )
}

function EmptyMessage() {
  return (
    <tr>
      <td colSpan={3} className="consultor-conquistas-feedback-cell">
        <p className="consultor-conquistas-empty">Ainda não tens conquistas registadas.</p>
      </td>
    </tr>
  )
}

// ─── View principal ───────────────────────────────────────────────────────────

function ConsultorConquistasView() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchConquistas() {
    setLoading(true)
    setError(null)
    try {
      const data = await getConquistasConsultor()
      setDados(data)
    } catch (err) {
      setError(err.message ?? 'Erro ao carregar conquistas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchConquistas() }, [])

  function renderBody() {
    if (loading) return <LoadingRows />
    if (error) return <ErrorMessage message={error} onRetry={fetchConquistas} />
    if (!dados?.conquistas?.length) return <EmptyMessage />

    return dados.conquistas.map((c) => (
      <ConquistaRow
        key={c.id_conquista}
        conquista={c}
        total_badges={dados.total_badges}
        total_pontos={dados.total_pontos}
      />
    ))
  }

  return (
    <section className="consultor-conquistas-page">
      <header className="consultor-conquistas-hero">
        <div className="consultor-conquistas-hero-copy">
          <h1>Conquistas</h1>
          <p>Alcança estes marcos e progride na carreira</p>
        </div>
      </header>

      <article className="consultor-conquistas-card" aria-label="Histórico de Conquistas">
        <header className="consultor-conquistas-card-header">
          <IconConquistas className="consultor-conquistas-card-header-icon" />
          <h2>Histórico de Conquistas</h2>
        </header>

        <table className="consultor-conquistas-table">
          <thead>
            <tr>
              <th className="consultor-conquistas-col-description" scope="col">DESCRIÇÃO</th>
              <th className="consultor-conquistas-col-points" scope="col">PONTOS</th>
              <th className="consultor-conquistas-col-progress" scope="col">PROGRESSO</th>
            </tr>
          </thead>
          <tbody>
            {renderBody()}
          </tbody>
        </table>
      </article>
    </section>
  )
}

export default ConsultorConquistasView