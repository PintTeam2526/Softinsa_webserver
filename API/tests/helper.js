require('dotenv').config();
const http = require('node:http');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'teste',
  max: 2,
});

const BASE = 'http://localhost:3000';

const USERS = {
  admin: { email: 'admin@softinsa.pt', password: 'admin123', role: 'a' },
  tm:    { email: 'tm@softinsa.pt',    password: 'password123', role: 't' },
  sl:    { email: 'sl@softinsa.pt',    password: 'password123', role: 's' },
  joao:  { email: 'consultor1@softinsa.pt', password: '123456', role: 'c' },
  maria: { email: 'consultor2@softinsa.pt', password: '123456', role: 'c' },
};

const agent = new http.Agent({ keepAlive: true, maxSockets: 10 });

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
      agent,
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function login(name) {
  const user = USERS[name];
  if (!user) throw new Error(`Unknown user: ${name}`);
  const { status, body } = await request('POST', '/api/autenticacao/login', {
    email: user.email,
    password: user.password,
  });
  if (status !== 200) throw new Error(`Login failed for ${name}: ${JSON.stringify(body)}`);
  return body.token;
}

function makeToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'supersegredo', { expiresIn: '1h' });
}

const TOKENS = {
  admin: makeToken({ id: 1, email: 'admin@softinsa.pt', role: 'a', id_administrador: 1 }),
  tm:    makeToken({ id: 2, email: 'tm@softinsa.pt', role: 't', id_talent_manager: 1 }),
  sl:    makeToken({ id: 3, email: 'sl@softinsa.pt', role: 's', id_service_line_lider: 1 }),
  joao:  makeToken({ id: 4, email: 'consultor1@softinsa.pt', role: 'c', id_consultor: 1 }),
  maria: makeToken({ id: 5, email: 'consultor2@softinsa.pt', role: 'c', id_consultor: 2 }),
};

async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

async function cleanupPedido(id) {
  if (!id) return;
  await query('DELETE FROM "NotificacoesPedidos" WHERE id_pedido_badge = $1', [id]);
  await query('DELETE FROM "HistoricoPedidos" WHERE id_pedido_badge = $1', [id]);
  await query('DELETE FROM "Documentacoes"      WHERE id_pedido_badge = $1', [id]);
  await query('DELETE FROM "PedidosBadges"      WHERE id_pedido_badge = $1', [id]);
}

async function cleanupAllPedidos(ids) {
  for (const id of ids) {
    await cleanupPedido(id);
  }
}

async function findPedido(consultorId, badgeId) {
  const res = await query(
    'SELECT * FROM "PedidosBadges" WHERE id_consultor = $1 AND id_badge = $2 AND estado_atual NOT IN (4, 5) LIMIT 1',
    [consultorId, badgeId],
  );
  return res.rows[0] || null;
}

async function findPedidoByConsultor(consultorId) {
  const res = await query(
    'SELECT * FROM "PedidosBadges" WHERE id_consultor = $1 AND estado_atual NOT IN (4, 5) ORDER BY id_pedido_badge ASC LIMIT 1',
    [consultorId],
  );
  return res.rows[0] || null;
}

async function findPedidoById(id) {
  const res = await query('SELECT * FROM "PedidosBadges" WHERE id_pedido_badge = $1', [id]);
  return res.rows[0] || null;
}

async function cleanupRequisito(id) {
  if (!id) return;
  await query('DELETE FROM "Requisitos" WHERE id_requisito = $1', [id]);
}

async function cleanupDocumento(id) {
  if (!id) return;
  await query('DELETE FROM "Documentacoes" WHERE id_documentacao = $1', [id]);
}

async function closeDb() {
  await pool.end();
}

module.exports = {
  request, login, makeToken, TOKENS, USERS,
  query,
  cleanupPedido, cleanupAllPedidos,
  findPedido, findPedidoByConsultor, findPedidoById,
  cleanupRequisito, cleanupDocumento,
  closeDb,
};
