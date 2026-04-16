export const sidebarSections = [
  {
    title: 'Home',
    items: [{ text: 'Dashboard', icon: 'dashboard', to: '/softinsa', end: true }],
  },
  {
    title: 'Gestao',
    items: [
      { text: 'Utilizadores', icon: 'users', to: '/softinsa/utilizadores' },
      { text: 'Pedidos', icon: 'pedidos', to: '/softinsa/pedidos' },
      { text: 'SLAs', icon: 'slas', to: '/softinsa/slas' },
      { text: 'RGPD', icon: 'rgpd', to: '/softinsa/rgpd' },
    ],
  },
  {
    title: 'Estrutura',
    items: [
      { text: 'Badges', icon: 'badges', to: '/softinsa/badges' },
      { text: 'Areas', icon: 'areas', to: '/softinsa/areas' },
      { text: 'Service Lines', icon: 'service-lines', to: '/softinsa/service-lines' },
      { text: 'Learning Paths', icon: 'learning-paths', to: '/softinsa/learning-paths' },
    ],
  },
]
