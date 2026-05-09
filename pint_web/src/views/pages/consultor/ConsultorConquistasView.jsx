import { HiOutlineTrophy, HiOutlineStar } from 'react-icons/hi2'
import './ConsultorConquistasView.css'
import avtar1 from '../../../assets/images/avatars/avtar_1.png'
import avtar2 from '../../../assets/images/avatars/avtar_2.png'
import avtar3 from '../../../assets/images/avatars/avtar_3.png'
import avtar4 from '../../../assets/images/avatars/avtar_4.png'
import avtar5 from '../../../assets/images/avatars/avtar_5.png'

function progressTier(progress) {
  if (progress >= 100) return 'is-tier-4'
  if (progress >= 75)  return 'is-tier-3'
  if (progress >= 50)  return 'is-tier-2'
  if (progress >= 25)  return 'is-tier-1'
  return 'is-tier-0'
}

const conquistasData = [
  { id: 1, description: 'Obter todos os Badges de uma Área', thumb: avtar1, points: 520, progress: 0   },
  { id: 2, description: 'Obter 50 badges',                   thumb: avtar2, points: 520, progress: 25  },
  { id: 3, description: 'Obter 10 badges',                   thumb: avtar3, points: 520, progress: 50  },
  { id: 4, description: 'Obter 3 badges',                    thumb: avtar4, points: 520, progress: 75  },
  { id: 5, description: 'Obter 1 badge',                     thumb: avtar5, points: 520, progress: 100 },
]

function ConquistaRow({ row }) {
  const tier = progressTier(row.progress)

  return (
    <tr>
      <td>
        <div className="consultor-conquistas-description-cell">
          <img src={row.thumb} alt="" className="consultor-conquistas-thumb" />
          <span className="consultor-conquistas-description-text">{row.description}</span>
        </div>
      </td>

      <td>
        <span className="consultor-conquistas-points-cell">
          <span>{row.points}</span>
          <HiOutlineStar className="consultor-conquistas-points-icon" aria-hidden="true" />
        </span>
      </td>

      <td>
        <div
          className="consultor-conquistas-progress"
          role="progressbar"
          aria-valuenow={row.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`consultor-conquistas-progress-bar ${tier}`}
            style={{ width: `${Math.max(row.progress, 8)}%` }}
          >
            {row.progress}%
          </div>
        </div>
      </td>
    </tr>
  )
}

function ConsultorConquistasView() {
  return (
    <section className="consultor-conquistas-page">
      <header className="consultor-conquistas-hero">
        <div className="consultor-conquistas-hero-art" aria-hidden="true">
          <div className="consultor-conquistas-hero-circle consultor-conquistas-hero-circle-5" />
          <div className="consultor-conquistas-hero-circle consultor-conquistas-hero-circle-4" />
          <div className="consultor-conquistas-hero-circle consultor-conquistas-hero-circle-3" />
          <div className="consultor-conquistas-hero-circle consultor-conquistas-hero-circle-2" />
          <div className="consultor-conquistas-hero-circle consultor-conquistas-hero-circle-1" />
        </div>

        <div className="consultor-conquistas-hero-copy">
          <h1>Conquistas</h1>
          <p>Alcança estes marcos e progride na carreira</p>
        </div>
      </header>

      <article className="consultor-conquistas-card" aria-label="Histórico de Conquistas">
        <header className="consultor-conquistas-card-header">
          <HiOutlineTrophy className="consultor-conquistas-card-header-icon" aria-hidden="true" />
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
            {conquistasData.map((row) => (
              <ConquistaRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </article>
    </section>
  )
}

export default ConsultorConquistasView
