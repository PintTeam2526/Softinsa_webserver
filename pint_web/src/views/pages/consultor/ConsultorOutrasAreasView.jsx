import { useNavigate } from 'react-router-dom'
import TalentManagerBadgesView from '../talent-manager/TalentManagerBadgesView'
import './ConsultorOutrasAreasView.css'

function ConsultorOutrasAreasView() {
  const navigate = useNavigate()

  function handleBadgeClick(badge) {
    navigate(`/consultor/badge/${badge.id}`)
  }

  return (
    <TalentManagerBadgesView
      heroTitle="Outras Áreas"
      heroSubtitle="Descobre novas áreas e badges que valorizam o teu percurso profissional"
      showExportButton={false}
      classPrefix="consultor-outras"
      onBadgeClick={handleBadgeClick}
      showTabProgress
    />
  )
}

export default ConsultorOutrasAreasView
