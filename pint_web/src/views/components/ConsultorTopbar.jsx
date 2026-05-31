import { memo, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './ConsultorTopbar.css'

import { useTopbarController, getTopbarUtilizador } from '../../controllers/topbar.controller'


function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="softinsa-shell-topbar-icon" aria-hidden="true">
      <path
        d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z"
        fill="#39639C"
      />
      <path
        opacity="0.4"
        d="M14.0086 19.2284C13.5087 19.1216 10.4625 19.1216 9.96263 19.2284C9.53527 19.3271 9.07312 19.5567 9.07312 20.0603C9.09797 20.5407 9.37923 20.9647 9.76882 21.2336C10.2717 21.6274 10.8631 21.8771 11.4822 21.9668C11.8122 22.0121 12.1481 22.0101 12.49 21.9668C13.1082 21.8771 13.6995 21.6274 14.2034 21.2346C14.592 20.9647 14.8733 20.5407 14.8981 20.0603C14.8981 19.5567 14.436 19.3271 14.0086 19.2284Z"
        fill="#39639C"
      />
    </svg>
  )
}

function NotificationRepositoryArrowIcon({ isOpen }) {
  return (
    <span className={`softinsa-shell-notification-item-arrow${isOpen ? ' is-open' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" className="softinsa-shell-notification-item-arrow-icon">
        <path
          d="M5.8335 8.3335L10.0002 12.5002L14.1668 8.3335"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function NotificationRepository({ items, expandedId, onToggleItem, onClose }) {
  return (
    <div className="softinsa-shell-notification-panel" role="dialog" aria-label="Repositorio de notificacoes">
      <div className="softinsa-shell-notification-panel-header">
        <div className="softinsa-shell-notification-panel-title-wrap">
          <span className="softinsa-shell-notification-panel-title">Notificacoes</span>
        </div>

        <button
          type="button"
          className="softinsa-shell-notification-panel-close"
          onClick={onClose}
          aria-label="Fechar notificacoes"
        >
          x
        </button>
      </div>

      <div className="softinsa-shell-notification-panel-divider" />

      <div className="softinsa-shell-notification-list">
        {items.map((item) => {
          const isExpanded = expandedId === item.id

          return (
            <div key={item.id} className="softinsa-shell-notification-item-group">
              <button
                type="button"
                className={`softinsa-shell-notification-item softinsa-shell-notification-item-${item.tone}`}
                onClick={() => onToggleItem(item.id)}
                aria-expanded={isExpanded}
              >
                <span className="softinsa-shell-notification-item-left">
                  <span className="softinsa-shell-notification-item-title">{item.title}</span>
                </span>

                <span className="softinsa-shell-notification-item-right">
                  <span className="softinsa-shell-notification-item-source">{item.source}</span>
                  <NotificationRepositoryArrowIcon isOpen={isExpanded} />
                </span>
              </button>

              {isExpanded ? (
                <div className={`softinsa-shell-notification-message softinsa-shell-notification-message-${item.tone}`}>
                  {item.message}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="softinsa-shell-profile-skeleton" aria-busy="true" aria-label="A carregar perfil">
      <div className="softinsa-shell-profile-skeleton-avatar" />
      <div className="softinsa-shell-profile-skeleton-meta">
        <div className="softinsa-shell-profile-skeleton-name" />
        <div className="softinsa-shell-profile-skeleton-role" />
      </div>
    </div>
  )
}

function ProfileButton({ profile }) {
  const roleLabel = profile.total_pontos != null
    ? `${profile.cargo} · ${profile.total_pontos} pontos`
    : profile.cargo

  return (
    <Link to="/consultor/definicoes" className="softinsa-shell-profile-btn" aria-label="Abrir perfil público">
      <div className="softinsa-shell-profile-wrap">
        <img
          src={`data:image/jpeg;base64,${profile.imagem_utilizador}`}
          alt={profile.nome_utilizador}
          className="softinsa-shell-profile-avatar"
        />
        <span className="softinsa-shell-profile-meta">
          <span className="softinsa-shell-profile-name">{profile.nome_utilizador}</span>
          <span className="softinsa-shell-profile-role">{roleLabel}</span>
        </span>
      </div>
    </Link>
  )
}

const ConsultorTopbar = memo(() => {
  const {
    notificationWrapRef,
    isNotificationsOpen,
    expandedNotificationId,
    notificationItems,
    toggleNotifications,
    closeNotifications,
    toggleNotificationMessage,
  } = useTopbarController()

  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    setProfileLoading(true)
    try {
      const data = await getTopbarUtilizador()
      setProfile(data)
    } catch (err) {
      console.error('Erro ao carregar topbar', err)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    function handleOpenNotifications() {
      if (!isNotificationsOpen) toggleNotifications()
    }
    window.addEventListener('consultor:open-notifications', handleOpenNotifications)
    return () => window.removeEventListener('consultor:open-notifications', handleOpenNotifications)
  }, [isNotificationsOpen, toggleNotifications])

  return (
    <div className="softinsa-shell-topbar">
      <div className="softinsa-shell-topbar-actions">
        {/* Notifications */}
        <div className="softinsa-shell-notification-wrap" ref={notificationWrapRef}>
          <button
            type="button"
            className="softinsa-shell-notification-btn"
            aria-label="Notificacoes"
            aria-expanded={isNotificationsOpen}
            onClick={toggleNotifications}
          >
            <NotificationIcon />
          </button>

          {isNotificationsOpen ? (
            <NotificationRepository
              items={notificationItems}
              expandedId={expandedNotificationId}
              onToggleItem={toggleNotificationMessage}
              onClose={closeNotifications}
            />
          ) : null}
        </div>

        {/* Profile */}
        {profileLoading ? (
          <ProfileSkeleton />
        ) : profile ? (
          <ProfileButton profile={profile} />
        ) : null}
      </div>
    </div>
  )
})

export default ConsultorTopbar