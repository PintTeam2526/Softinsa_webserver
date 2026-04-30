export const topbarProfile = {
  name: 'Antonio Portugal',
  role: 'Administrador',
  avatar: 'https://i.pravatar.cc/90?img=12',
}

export const initialNotificationItems = [
  {
    id: 'exportacao',
    title: 'Exportacao de dados concluida',
    source: 'Sistema',
    tone: 'success',
    message:
      'A exportacao de dados foi concluida com sucesso e esta disponivel para download.',
  },
  {
    id: 'sla',
    title: 'SLA ultrapassado',
    source: 'Sistema',
    tone: 'error',
    message:
      'Foi ultrapassado o SLA de um ou mais pedidos. Verifique os detalhes no modulo de gestao.',
  },
  {
    id: 'badges',
    title: 'Badges a expirar brevemente',
    source: 'Sistema',
    tone: 'pending',
    message:
      'Existem badges a expirar nos proximos dias. Recomendamos rever os utilizadores impactados.',
  },
  {
    id: 'rgpd',
    title: 'Atualizacao de termos RGPD',
    source: 'Admin',
    tone: 'info',
    message: 'Os termos de RGPD foram atualizados. Consulte os novos pontos com a equipa.',
  },
]

export const availableLanguages = [
  { value: '', label: 'Selecione o idioma', disabled: true },
  { value: 'pt', label: 'Portugues' },
  { value: 'en', label: 'Ingles' },
  { value: 'es', label: 'Espanhol' },
]
