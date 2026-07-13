import api from '../services/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getNotifications, createNotification, deactivateNotification } from './notificacoesController'

// tipo: 1-informação, 2-aviso, 3-perigo, 4-correto/válido
const TIPO_TONE_MAP = {
  1: 'info',
  2: 'warning',
  3: 'danger',
  4: 'success',
}

function mapNotificacao(n) {
  return {
    id: n.id_notificacao,
    id_consultor: n.id_consultor,
    title: n.notificacao,
    source: n.remetente,
    tone: TIPO_TONE_MAP[n.tipo] || 'info',
    message: n.descricao ?? n.notificacao,
    grupo: n.id_consultor === null ? 'global' : 'pessoal',
  }
}

export function useTopbarController() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isNotificationComposerOpen, setIsNotificationComposerOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [expandedNotificationId, setExpandedNotificationId] = useState(null)
  const [notificationBroadcastMessage, setNotificationBroadcastMessage] = useState('')
  const [notificationItems, setNotificationItems] = useState([])
  const [activeNotificationTab, setActiveNotificationTab] = useState('global')

  const notificationWrapRef = useRef(null)
  const profileWrapRef = useRef(null)

  const resetNotificationsState = useCallback(() => {
    setIsNotificationComposerOpen(false)
    setExpandedNotificationId(null)
    setNotificationBroadcastMessage('')
  }, [])

  const closeNotifications = useCallback(() => {
    setIsNotificationsOpen(false)
    resetNotificationsState()
  }, [resetNotificationsState])

  const closeProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(false)
  }, [])

  const openNotifications = useCallback(() => {
    setIsNotificationsOpen(true)
    setIsProfileMenuOpen(false)
    resetNotificationsState()
  }, [resetNotificationsState])

  const loadNotifications = useCallback(() => {
    return getNotifications()
      .then((data) => setNotificationItems(data.map(mapNotificacao)))
      .catch((err) => console.error('Erro ao carregar notificacoes', err))
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    window.addEventListener('softinsa:open-notifications', openNotifications)
    return () => window.removeEventListener('softinsa:open-notifications', openNotifications)
  }, [openNotifications])

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationWrapRef.current && !notificationWrapRef.current.contains(event.target)) {
        closeNotifications()
      }
      if (profileWrapRef.current && !profileWrapRef.current.contains(event.target)) {
        closeProfileMenu()
      }
    }

    function handleEscape(event) {
      if (event.key !== 'Escape') return
      closeNotifications()
      closeProfileMenu()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closeNotifications, closeProfileMenu])

  function toggleNotifications() {
    setIsNotificationsOpen((prev) => !prev)
    closeProfileMenu()
    resetNotificationsState()
  }

  function toggleNotificationMessage(notificationId) {
    setExpandedNotificationId((prev) => prev === notificationId ? null : notificationId)
  }

  function toggleComposer() {
    setIsNotificationComposerOpen((prev) => !prev)
    setExpandedNotificationId(null)
  }

  function showRepository() {
    setIsNotificationComposerOpen(false)
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen((prev) => !prev)
    closeNotifications()
  }

  async function sendBroadcast() {
    const trimmedMessage = notificationBroadcastMessage.trim()
    if (!trimmedMessage) return

    try {
      await createNotification({
        notificacao: trimmedMessage,
        descricao: trimmedMessage,
        remetente: 'Admin',
        id_consultor: null,
        tipo: 1,
      })

      await loadNotifications()

      setActiveNotificationTab('global')
      setExpandedNotificationId(null)
      setIsNotificationComposerOpen(false)
      setNotificationBroadcastMessage('')
      setIsNotificationsOpen(true)

    } catch (err) {
      console.error('Erro ao enviar notificacao global', err)
    }
  }

  async function handleDeactivateNotification(id) {
    try {
      await deactivateNotification(id)
      setNotificationItems((prev) => prev.filter((item) => item.id !== id))
      setExpandedNotificationId((prev) => (prev === id ? null : prev))
    } catch (err) {
      console.error('Erro ao inativar notificacao', err)
    }
  }

  const globalNotificationItems = useMemo(
    () => notificationItems.filter((item) => item.grupo === 'global'),
    [notificationItems]
  )

  const personalNotificationItems = useMemo(
    () => notificationItems.filter((item) => item.grupo === 'pessoal'),
    [notificationItems]
  )

  return {
    notificationWrapRef,
    profileWrapRef,
    isNotificationsOpen,
    isNotificationComposerOpen,
    isProfileMenuOpen,
    expandedNotificationId,
    notificationBroadcastMessage,
    notificationItems,
    activeNotificationTab,
    setActiveNotificationTab,
    globalNotificationItems,
    personalNotificationItems,
    toggleNotifications,
    openNotifications,
    closeNotifications,
    toggleNotificationMessage,
    toggleComposer,
    showRepository,
    toggleProfileMenu,
    sendBroadcast,
    setNotificationBroadcastMessage,
    handleDeactivateNotification,
  }
}

export async function getTopbarUtilizador() {
  try {
    const response = await api.get('/utilizadores/topbar')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da topbar', error)
    throw error
  }
}