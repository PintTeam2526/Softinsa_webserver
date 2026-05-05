import { memo, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiOutlineAcademicCap,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCodeBracket,
  HiOutlineCloud,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineBuildingLibrary,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineTrophy,
} from 'react-icons/hi2'
import './ConsultorSidebar.css'

const softinsaLogo = 'https://www.figma.com/api/mcp/asset/fe338133-f0f4-4325-91ea-9c78fd1547c2'

const storageKey = 'consultor-sidebar-collapsed'

const navigationSections = [
  {
    title: 'Home',
    items: [{ text: 'Dashboard', icon: HiOutlineHome, to: '/consultor/dashboard', end: true }],
  },
  {
    title: 'Área',
    items: [
      {
        text: 'LowCode\n(Outsystems)',
        icon: HiOutlineCodeBracket,
        to: '/consultor/area/lowcode',
      },
    ],
  },
  {
    title: 'Service Line',
    items: [
      {
        text: 'Hybrid Cloud',
        icon: HiOutlineCloud,
        to: '/consultor/service-line/hybrid-cloud',
      },
    ],
  },
  {
    title: 'Learning Path',
    items: [
      {
        text: 'Jornada Tecnica',
        icon: HiOutlineAcademicCap,
        to: '/consultor/learning-path/jornada-tecnica',
      },
    ],
  },
  {
    title: 'Badges',
    items: [
      {
        text: 'Pedidos',
        icon: HiOutlineClipboardDocumentList,
        to: '/consultor/badges/pedidos',
      },
      {
        text: 'Listas de Badges',
        icon: HiOutlineBuildingLibrary,
        to: '/consultor/badges/listas-badges',
      },
      {
        text: 'Objetivos',
        icon: HiOutlineClipboardDocumentCheck,
        to: '/consultor/badges/objetivos',
      },
      {
        text: 'Conquistas',
        icon: HiOutlineTrophy,
        to: '/consultor/badges/conquistas',
      },
      {
        text: 'Outras Areas',
        icon: HiOutlineSquares2X2,
        to: '/consultor/badges/outras-areas',
      },
    ],
  },
]

function SidebarItem({ item, collapsed }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `consultor-sidebar-item${isActive ? ' active' : ''}${collapsed ? ' is-collapsed' : ''}`
      }
      title={item.text.replace(/\n/g, ' ')}
    >
      <span className="consultor-sidebar-item-icon-shell">
        <Icon className="consultor-sidebar-item-icon" aria-hidden="true" />
      </span>

      {!collapsed ? (
        <span className="consultor-sidebar-item-label">
          {item.text.split('\n').map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      ) : null}

      {!collapsed && item.to !== '/consultor' ? (
        <HiOutlineChevronRight className="consultor-sidebar-item-chevron" aria-hidden="true" />
      ) : null}
    </NavLink>
  )
}

function ConsultorSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(storageKey) === 'true'
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(isCollapsed))
  }, [isCollapsed])

  return (
    <aside className={`consultor-sidebar-shell${isCollapsed ? ' is-collapsed' : ''}`}>
      <div className="consultor-sidebar-panel">
        <button
          type="button"
          className="consultor-sidebar-toggle"
          onClick={() => setIsCollapsed((previousValue) => !previousValue)}
          aria-label={isCollapsed ? 'Abrir sidebar' : 'Fechar sidebar'}
          aria-expanded={!isCollapsed}
        >
          <HiOutlineChevronLeft className="consultor-sidebar-toggle-arrow" aria-hidden="true" />
        </button>

        <div className="consultor-sidebar-header">
          <div className="consultor-sidebar-logo-pill" aria-label="Softinsa">
            <img src={softinsaLogo} alt="Softinsa" className="consultor-sidebar-logo-image" />
          </div>
        </div>

        <div className="consultor-sidebar-top-line" />

        <div className="consultor-sidebar-sections">
          {navigationSections.map((section) => (
            <section key={section.title} className="consultor-sidebar-section" aria-label={section.title}>
              {!isCollapsed ? <div className="consultor-sidebar-title">{section.title}</div> : null}

              <div className="consultor-sidebar-items">
                {section.items.map((item) => (
                  <SidebarItem key={item.to} item={item} collapsed={isCollapsed} />
                ))}
              </div>

              {!isCollapsed ? <div className="consultor-sidebar-divider" /> : null}
            </section>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default memo(ConsultorSidebar)