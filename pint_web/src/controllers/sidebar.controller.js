import api from '../services/api'

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

// Para chamar a rota do back com os dados da SideBar do Consultor
export async function getSideBarConsultor() {
  try {
    const response = await api.get('/consultores/sidebar')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da sidebar', error)
    throw error
  }
}
