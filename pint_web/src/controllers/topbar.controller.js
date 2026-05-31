import api from '../services/api'

import { useCallback, useEffect, useRef, useState } from 'react'
import { availableLanguages, initialNotificationItems } from '../models/topbar.model'


export function useTopbarController() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isNotificationComposerOpen, setIsNotificationComposerOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [expandedNotificationId, setExpandedNotificationId] = useState(null)
  const [notificationBroadcastMessage, setNotificationBroadcastMessage] = useState('')
  const [notificationItems, setNotificationItems] = useState(initialNotificationItems)
  const [selectedLanguage, setSelectedLanguage] = useState('')

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
    function handleOpenNotifications() {
      openNotifications()
    }

    window.addEventListener('softinsa:open-notifications', handleOpenNotifications)
    return () => {
      window.removeEventListener('softinsa:open-notifications', handleOpenNotifications)
    }
  }, [openNotifications])

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideNotifications =
        notificationWrapRef.current && notificationWrapRef.current.contains(event.target)
      const clickedInsideProfile =
        profileWrapRef.current && profileWrapRef.current.contains(event.target)

      if (!clickedInsideNotifications) {
        closeNotifications()
      }

      if (!clickedInsideProfile) {
        closeProfileMenu()
      }
    }

    function handleEscape(event) {
      if (event.key !== 'Escape') {
        return
      }

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
    setIsNotificationsOpen((previousValue) => !previousValue)
    closeProfileMenu()
    resetNotificationsState()
  }

  function toggleNotificationMessage(notificationId) {
    setExpandedNotificationId((previousId) =>
      previousId === notificationId ? null : notificationId,
    )
  }

  function toggleComposer() {
    setIsNotificationComposerOpen((previousValue) => !previousValue)
    setExpandedNotificationId(null)
  }

  function showRepository() {
    setIsNotificationComposerOpen(false)
  }

  function toggleProfileMenu() {
    setIsProfileMenuOpen((previousValue) => !previousValue)
    closeNotifications()
  }

  function sendBroadcast() {
    const trimmedMessage = notificationBroadcastMessage.trim()

    if (!trimmedMessage) {
      return
    }

    const title = trimmedMessage.length > 42 ? `${trimmedMessage.slice(0, 42)}...` : trimmedMessage

    const newNotification = {
      id: `broadcast-${Date.now()}`,
      title,
      source: 'Admin',
      tone: 'info',
      message: trimmedMessage,
    }

    setNotificationItems((previousItems) => [newNotification, ...previousItems])
    setExpandedNotificationId(newNotification.id)
    setIsNotificationComposerOpen(false)
    setNotificationBroadcastMessage('')
    setIsNotificationsOpen(true)
  }

  return {
    notificationWrapRef,
    profileWrapRef,
    isNotificationsOpen,
    isNotificationComposerOpen,
    isProfileMenuOpen,
    expandedNotificationId,
    notificationBroadcastMessage,
    notificationItems,
    selectedLanguage,
    availableLanguages,
    toggleNotifications,
    openNotifications,
    closeNotifications,
    toggleNotificationMessage,
    toggleComposer,
    showRepository,
    toggleProfileMenu,
    sendBroadcast,
    setNotificationBroadcastMessage,
    setSelectedLanguage,
  }
}

// Para chamar a rota do back com os dados da TopBar do Utilizador
export async function getTopbarUtilizador() {
  try {
    const response = await api.get('/utilizadores/topbar')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da topbar', error)
    throw error
  }
}
