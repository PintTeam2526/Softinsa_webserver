import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap';

function App() {
  return (
    <div className="wrapper">
      {/* Navbar Simples */}
      <Navbar bg="white" className="border-bottom mb-4">
        <Container fluid>
          <Navbar.Brand href="#">Hope UI React</Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">Bem-vindo ao Dashboard!</h4>
                    <p className="text-muted">Configuração com Vite + React-Bootstrap concluída.</p>
                  </div>
                  <Button variant="primary">Novo Relatório</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          {[1, 2, 3].map((item) => (
            <Col key={item} md={4}>
              <Card className="shadow-sm border-0 mb-3">
                <Card.Body>
                  <h6>Estatística {item}</h6>
                  <h2 className="mt-2">1,25{item}</h2>
                  <span className="text-success">↑ 10% este mês</span>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;