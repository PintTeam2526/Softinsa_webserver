import { useNavigate } from 'react-router-dom'
import TalentManagerBadgesView from '../talent-manager/TalentManagerBadgesView'
import './ConsultorOutrasAreasView.css'

function slugify(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ConsultorOutrasAreasView() {
  const navigate = useNavigate()

  function handleBadgeClick(badge) {
    navigate(`/consultor/badge/${slugify(badge.title)}`)
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
