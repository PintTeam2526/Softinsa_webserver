import { Card } from 'react-bootstrap'

function PlaceholderView({ title }) {
  return (
    <div style={{ padding: '24px' }}>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h3 style={{ marginBottom: '8px', color: '#232d42' }}>{title}</h3>
          <p style={{ marginBottom: 0, color: '#8a92a6' }}>
            Pagina em preparacao.
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default PlaceholderView
