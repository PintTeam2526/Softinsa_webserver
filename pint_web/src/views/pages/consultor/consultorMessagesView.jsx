import React from 'react'
import { Card, Col, Row, Form } from 'react-bootstrap'
import { HiOutlineSearch, HiOutlineTrash, HiOutlineMailOpen } from 'react-icons/hi'
import { MdOutlineNotifications, MdOutlineCheckCircle } from 'react-icons/md'
import './consultor-messages.css'

function ConsultorMessagesView() {
  const [filter, setFilter] = React.useState('all')

  const messages = [
    {
      id: 1,
      sender: 'RH Softinsa',
      avatar: 'https://via.placeholder.com/40',
      subject: 'Convite para Participar no Programa de Mentoría',
      preview: 'Gostaríamos de convidá-lo a participar no nosso programa de mentoría...',
      date: '15/04/2026',
      time: '10:30',
      read: false,
      type: 'invite'
    },
    {
      id: 2,
      sender: 'Gestor de Aprendizado',
      avatar: 'https://via.placeholder.com/40',
      subject: 'Novo Curso Disponível: Cloud Computing Avançado',
      preview: 'Um novo curso de Cloud Computing foi adicionado à sua recomendação...',
      date: '14/04/2026',
      time: '14:20',
      read: false,
      type: 'course'
    },
    {
      id: 3,
      sender: 'Sistema Softinsa',
      avatar: 'https://via.placeholder.com/40',
      subject: 'Seu Objetivo Expira em 3 Dias',
      preview: 'O objetivo "Completar Curso de Cloud Computing" expira em 3 dias...',
      date: '14/04/2026',
      time: '09:15',
      read: true,
      type: 'reminder'
    },
    {
      id: 4,
      sender: 'Seu Mentor',
      avatar: 'https://via.placeholder.com/40',
      subject: 'Feedback sobre sua Apresentação',
      preview: 'Parabéns pela excelente apresentação no projeto! Aqui está meu feedback...',
      date: '13/04/2026',
      time: '16:45',
      read: true,
      type: 'feedback'
    },
    {
      id: 5,
      sender: 'RH Softinsa',
      avatar: 'https://via.placeholder.com/40',
      subject: 'Resultado: Certificação DevOps Aprovada',
      preview: 'Felicidades! Sua certificação DevOps foi aprovada com êxito...',
      date: '12/04/2026',
      time: '11:30',
      read: true,
      type: 'success'
    },
    {
      id: 6,
      sender: 'Gestor de Aprendizado',
      avatar: 'https://via.placeholder.com/40',
      subject: 'Recomendação: Novos Badges para Você',
      preview: 'Baseado no seu perfil, recomendamos os seguintes badges...',
      date: '11/04/2026',
      time: '13:00',
      read: true,
      type: 'recommendation'
    }
  ]

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(msg => msg.read === (filter === 'read'))

  const unreadCount = messages.filter(msg => !msg.read).length

  const getMessageIcon = (type) => {
    switch(type) {
      case 'invite':
        return <MdOutlineNotifications className="message-type-icon invite" />
      case 'course':
        return <HiOutlineMailOpen className="message-type-icon course" />
      case 'reminder':
        return <MdOutlineNotifications className="message-type-icon reminder" />
      case 'feedback':
        return <HiOutlineMailOpen className="message-type-icon feedback" />
      case 'success':
        return <MdOutlineCheckCircle className="message-type-icon success" />
      case 'recommendation':
        return <HiOutlineMailOpen className="message-type-icon recommendation" />
      default:
        return null
    }
  }

  const markAsRead = (id) => {
    // Handle mark as read action
    console.log('Mark message as read:', id)
  }

  const deleteMessage = (id) => {
    // Handle delete action
    console.log('Delete message:', id)
  }

  return (
    <section className="consultor-messages-page">
      {/* Page Header */}
      <div className="messages-page-header">
        <div className="messages-header-content">
          <h1>Mensagens</h1>
          <p>Acompanha tuas notificações e mensagens importantes</p>
        </div>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="unread-banner">
          <span className="unread-icon">
            <MdOutlineNotifications size={20} />
          </span>
          <span className="unread-text">
            Tens <strong>{unreadCount}</strong> mensagem{unreadCount !== 1 ? 's' : ''} por ler
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="messages-search-section mb-4">
        <div className="search-wrapper">
          <HiOutlineSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Procura por mensagens..."
            className="messages-search-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="messages-filters mb-4">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({messages.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Não Lidas ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Lidas ({messages.filter(msg => msg.read).length})
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {filteredMessages.map((message) => (
          <Card
            key={message.id}
            className={`message-card ${message.read ? 'read' : 'unread'}`}
          >
            <Card.Body>
              <div className="message-content">
                <div className="message-avatar-wrapper">
                  <img
                    src={message.avatar}
                    alt={message.sender}
                    className="message-avatar"
                  />
                  {!message.read && <span className="unread-indicator"></span>}
                </div>

                <div className="message-main">
                  <div className="message-header">
                    <div className="message-sender-section">
                      <h6 className="message-sender">{message.sender}</h6>
                      <span className="message-date">
                        {message.date} · {message.time}
                      </span>
                    </div>
                    {getMessageIcon(message.type)}
                  </div>

                  <h5 className="message-subject">{message.subject}</h5>
                  <p className="message-preview">{message.preview}</p>

                  <div className="message-actions">
                    <button
                      className="action-btn"
                      onClick={() => markAsRead(message.id)}
                      title="Marcar como lido"
                    >
                      <MdOutlineCheckCircle size={18} />
                      {message.read ? 'Lido' : 'Marcar como Lido'}
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteMessage(message.id)}
                      title="Eliminar"
                    >
                      <HiOutlineTrash size={18} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="empty-state">
          <MdOutlineNotifications size={64} />
          <h5>Sem mensagens</h5>
          <p>Nenhuma mensagem encontrada para este filtro</p>
        </div>
      )}
    </section>
  )
}

export default ConsultorMessagesView
