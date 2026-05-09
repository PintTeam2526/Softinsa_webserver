import TalentManagerBadgesView from '../talent-manager/TalentManagerBadgesView'
import './ConsultorOutrasAreasView.css'

function ConsultorOutrasAreasView() {
  return (
    <TalentManagerBadgesView
      heroTitle="Outras Áreas"
      heroSubtitle="Descobre novas áreas e badges que valorizam o teu percurso profissional"
      showExportButton={false}
      classPrefix="consultor-outras"
    />
  )
}

export default ConsultorOutrasAreasView
