import { useState } from 'react'
import { sidebarSections } from '../models/sidebar.model'

export function useSidebarController() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  function toggleSidebar() {
    setIsCollapsed((previousValue) => !previousValue)
  }

  return {
    isCollapsed,
    sections: sidebarSections,
    toggleSidebar,
  }
}
