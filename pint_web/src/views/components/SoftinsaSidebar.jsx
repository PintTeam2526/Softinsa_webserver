import { NavLink } from 'react-router-dom'
import {
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { useSidebarController } from '../../controllers/sidebar.controller'
import './SoftinsaSidebar.css'

function MenuTitle({ text }) {
  return (
    <div className="softinsa-sidebar-title">
      <span>{text}</span>
    </div>
  )
}

function SidebarIcon({ type }) {
  if (type === 'dashboard' || type === 'areas') {
    return <HiOutlineViewGrid className="softinsa-sidebar-icon" aria-hidden="true" />
  }

  if (type === 'users') {
    return <HiOutlineUserGroup className="softinsa-sidebar-icon" aria-hidden="true" />
  }

  if (type === 'learning-paths') {
    return <HiOutlineAcademicCap className="softinsa-sidebar-icon" aria-hidden="true" />
  }

  if (type === 'service-lines' || type === 'slas') {
    return <MdOutlineMiscellaneousServices className="softinsa-sidebar-icon" aria-hidden="true" />
  }

  return <HiOutlineBadgeCheck className="softinsa-sidebar-icon" aria-hidden="true" />
}

function MenuItem({ text, icon, to = '/softinsa', end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `softinsa-sidebar-item${isActive ? ' active' : ''}`}
    >
      <span className="softinsa-sidebar-icon-wrap">
        <SidebarIcon type={icon} />
      </span>
      <span className="softinsa-sidebar-item-text">{text}</span>
    </NavLink>
  )
}

function SectionDivider() {
  return <div className="softinsa-sidebar-divider" />
}

function SoftinsaSidebar() {
  const { isCollapsed, sections, toggleSidebar } = useSidebarController()

  return (
    <aside className={`softinsa-sidebar${isCollapsed ? ' is-collapsed' : ''}`}>
      <div className="softinsa-sidebar-panel">
        <div className="softinsa-sidebar-header">
          <div className="softinsa-sidebar-logo-pill">
            <span className="softinsa-sidebar-logo-text">SOFTINSA</span>
          </div>
        </div>

        <div className="softinsa-sidebar-top-line" />

        <div className="softinsa-sidebar-sections">
          {sections.map((section) => (
            <div className="softinsa-sidebar-section" key={section.title}>
              <MenuTitle text={section.title} />

              {section.items.map((item) => (
                <MenuItem
                  key={item.to}
                  text={item.text}
                  icon={item.icon}
                  to={item.to}
                  end={item.end === true}
                />
              ))}

              <SectionDivider />
            </div>
          ))}
        </div>
      </div>

      <button
        className="softinsa-sidebar-toggle"
        type="button"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Abrir sidebar' : 'Fechar sidebar'}
        aria-expanded={!isCollapsed}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="softinsa-sidebar-toggle-arrow"
          aria-hidden="true"
        >
          <path
            d="M3.18752 9.20553L14.4375 9.20553"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.72496 13.724L3.18746 9.20595L7.72496 4.6872"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </aside>
  )
}

export default SoftinsaSidebar
