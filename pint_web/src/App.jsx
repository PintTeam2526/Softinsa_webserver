import React from 'react';
import Chart from 'react-apexcharts';
import { Container, Row, Col, Card, Navbar, Nav, Form, InputGroup } from 'react-bootstrap';
import { HiOutlineUserGroup, HiOutlineBadgeCheck, HiOutlineViewGrid, HiOutlineAcademicCap } from 'react-icons/hi';
import { MdOutlineMiscellaneousServices } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';

const Dashboard = () => {
  // Configuração do Gráfico de Badges (Ondas)
  const chartOptions = {
    chart: { id: 'badges-chart', toolbar: { show: false }, zoom: { enabled: false }, stroke: { curve: 'smooth' } },
    colors: ['#5c7aff', '#a5f3fc'],
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'] },
    yaxis: { min: 54, max: 99 },
    legend: { position: 'top', horizontalAlign: 'right' },
    dataLabels: { enabled: false }
  };

  const chartSeries = [
    { name: 'Jornada Técnica', data: [88, 82, 88, 78, 88, 80, 92] },
    { name: 'Power Skills', data: [78, 75, 78, 70, 78, 72, 82] }
  ];

  return (
    <div className="d-flex" style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div className="bg-white border-end shadow-sm" style={{ width: '260px' }}>
        <div className="p-4 mb-2 d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px', fontWeight: 'bold' }}>S</div>
          <h5 className="mb-0 fw-bold" style={{ color: '#002d5b' }}>SOFTINSA</h5>
        </div>
        
        <Nav className="flex-column px-3 mt-3">
          <small className="text-muted fw-bold mb-2 ps-2 text-uppercase" style={{ fontSize: '11px' }}>Home</small>
          <Nav.Link href="#" className="bg-primary text-white rounded-3 mb-3 p-2 d-flex align-items-center shadow">
            <HiOutlineViewGrid className="me-2" /> Dashboard
          </Nav.Link>

          <small className="text-muted fw-bold mb-2 ps-2 text-uppercase" style={{ fontSize: '11px' }}>Gestão</small>
          <Nav.Link href="#" className="text-secondary p-2 d-flex align-items-center"><HiOutlineUserGroup className="me-2" /> Utilizadores</Nav.Link>
          <Nav.Link href="#" className="text-secondary p-2 d-flex align-items-center"><HiOutlineBadgeCheck className="me-2" /> Pedidos</Nav.Link>
          <Nav.Link href="#" className="text-secondary p-2 d-flex align-items-center"><MdOutlineMiscellaneousServices className="me-2" /> SLAs</Nav.Link>

          <small className="text-muted fw-bold mt-3 mb-2 ps-2 text-uppercase" style={{ fontSize: '11px' }}>Estrutura</small>
          <Nav.Link href="#" className="text-secondary p-2 d-flex align-items-center"><HiOutlineBadgeCheck className="me-2" /> Badges</Nav.Link>
          <Nav.Link href="#" className="text-secondary p-2 d-flex align-items-center"><HiOutlineAcademicCap className="me-2" /> Learning Paths</Nav.Link>
        </Nav>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-grow-1">
        
        {/* TOP NAVBAR */}
        <Navbar bg="white" className="px-4 py-2 border-bottom shadow-sm justify-content-between">
          <InputGroup size="sm" style={{ maxWidth: '300px' }} className="bg-light rounded-pill px-2">
            <InputGroup.Text className="bg-transparent border-0"><FiSearch /></InputGroup.Text>
            <Form.Control className="bg-transparent border-0" placeholder="Search..." />
          </InputGroup>
          <div className="d-flex align-items-center">
            <div className="text-end me-3">
              <div className="fw-bold small">António Portugal</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>Administrador</div>
            </div>
            <div className="rounded-circle bg-info overflow-hidden" style={{ width: '40px', height: '40px' }}>
               <img src="https://pravatar.cc" alt="user" style={{ width: '100%' }} />
            </div>
          </div>
        </Navbar>

        {/* DASHBOARD BODY */}
        <Container fluid className="p-4">
          <div className="text-white p-4 rounded-4 mb-4 shadow-lg" style={{ background: 'linear-gradient(90deg, #0052cc 0%, #002d5b 100%)' }}>
            <h2 className="fw-bold mb-0">Olá, António Portugal!</h2>
          </div>

          {/* METRIC CARDS */}
          <Row className="mb-4 g-3">
            {[
              { label: 'Utilizadores', val: '4600', icon: <HiOutlineUserGroup /> },
              { label: 'Total Badges', val: '200', icon: <HiOutlineBadgeCheck /> },
              { label: 'Service Lines', val: '6', icon: <MdOutlineMiscellaneousServices /> },
              { label: 'Total Áreas', val: '6', icon: <HiOutlineViewGrid /> },
              { label: 'Learning Paths', val: '2', icon: <HiOutlineAcademicCap /> }
            ].map((item, idx) => (
              <Col key={idx}>
                <Card className="border-0 shadow-sm text-center py-3 rounded-4">
                  <Card.Body>
                    <div className="text-primary mb-2" style={{ fontSize: '20px' }}>{item.icon}</div>
                    <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{item.label}</div>
                    <h4 className="fw-bold mb-0">{item.val}</h4>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CHART CARD */}
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm p-4 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold">Badges Obtidos</h5>
                </div>
                <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;