import api from '../services/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getNotifications, createNotification } from './notificacoesController'

export function useTopbarController() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isNotificationComposerOpen, setIsNotificationComposerOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [expandedNotificationId, setExpandedNotificationId] = useState(null)
  const [notificationBroadcastMessage, setNotificationBroadcastMessage] = useState('')
  const [notificationItems, setNotificationItems] = useState([])

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

  useEffect(() => {
    getNotifications()
      .then((data) =>
        setNotificationItems(
          data.map((n, index) => ({
            id: `notif-${index}`,
            title: n.notificacao,
            source: n.remetente,
            tone: 'info',
            message: n.descricao ?? n.notificacao,
          }))
        )
      )
      .catch((err) => console.error('Erro ao carregar notificacoes', err))
  }, [])

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
      })

      const data = await getNotifications()
      setNotificationItems(
        data.map((n, index) => ({
          id: `notif-${index}`,
          title: n.notificacao,
          source: n.remetente,
          tone: 'info',
          message: n.descricao ?? n.notificacao,
        }))
      )

      setExpandedNotificationId('notif-0')
      setIsNotificationComposerOpen(false)
      setNotificationBroadcastMessage('')
      setIsNotificationsOpen(true)

    } catch (err) {
      console.error('Erro ao enviar notificacao global', err)
    }
  }

  // ← return aqui, fora do sendBroadcast, dentro do useTopbarController
  return {
    notificationWrapRef,
    profileWrapRef,
    isNotificationsOpen,
    isNotificationComposerOpen,
    isProfileMenuOpen,
    expandedNotificationId,
    notificationBroadcastMessage,
    notificationItems,
    toggleNotifications,
    openNotifications,
    closeNotifications,
    toggleNotificationMessage,
    toggleComposer,
    showRepository,
    toggleProfileMenu,
    sendBroadcast,
    setNotificationBroadcastMessage,
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