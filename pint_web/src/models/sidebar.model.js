export const sidebarSections = [
  {
    title: 'Home',
    items: [{ text: 'Dashboard', icon: 'dashboard', to: '/admin', end: true }],
  },
  {
    title: 'Gestao',
    items: [
      { text: 'Utilizadores', icon: 'users', to: '/admin/utilizadores' },
      { text: 'Pedidos', icon: 'pedidos', to: '/admin/pedidos' },
      { text: 'SLAs', icon: 'slas', to: '/admin/slas' },
      { text: 'RGPD', icon: 'rgpd', to: '/admin/rgpd' },
    ],
  },
  {
    title: 'Estrutura',
    items: [
      { text: 'Badges', icon: 'badges', to: '/admin/badges' },
      { text: 'Areas', icon: 'areas', to: '/admin/areas' },
      { text: 'Service Lines', icon: 'service-lines', to: '/admin/service-lines' },
      { text: 'Learning Paths', icon: 'learning-paths', to: '/admin/learning-paths' },
    ],
  },
]
