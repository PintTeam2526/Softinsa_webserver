const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  request, TOKENS, query, cleanupPedido,
  findPedido, findPedidoByConsultor, findPedidoById,
  closeDb,
} = require('./helper');

const createdIds = [];

async function findFreeBadge(consultorId) {
  for (let badgeId = 1; badgeId <= 5; badgeId++) {
    const existing = await findPedido(consultorId, badgeId);
    if (!existing) return badgeId;
  }
  const first = await findPedidoByConsultor(consultorId);
  if (first) {
    await cleanupPedido(first.id_pedido_badge);
    return first.id_badge;
  }
  return null;
}

async function ensurePedido(consultorId = 1, badgeId) {
  const badge = badgeId || await findFreeBadge(consultorId);
  if (!badge) throw new Error(`No free badge for consultor ${consultorId}`);
  const before = await findPedido(consultorId, badge);
  if (before) await cleanupPedido(before.id_pedido_badge);
  const { status, body } = await request('POST', '/api/pedidos/create',
    { id_consultor: consultorId, id_badge: badge },
    TOKENS.admin,
  );
  if (status !== 201) throw new Error(`Failed to create pedido: ${JSON.stringify(body)}`);
  const id = body.dados?.id_pedido_badge;
  if (!id) throw new Error(`No pedido id in response: ${JSON.stringify(body)}`);
  createdIds.push(id);
  return { id, badge };
}

describe('PedidosBadges', () => {
  let tokens = {};

  before(async () => {
    for (const name of Object.keys(TOKENS)) {
      tokens[name] = TOKENS[name];
    }
    for (const cId of [1, 2]) {
      for (const bId of [1, 2, 3, 4, 5, 6]) {
        const res = await query(
          'SELECT id_pedido_badge FROM "PedidosBadges" WHERE id_consultor = $1 AND id_badge = $2 AND estado_atual NOT IN (4, 5) LIMIT 1',
          [cId, bId],
        );
        if (res.rows[0]) await cleanupPedido(res.rows[0].id_pedido_badge);
      }
    }
  });

  after(async () => {
    for (const id of [...new Set(createdIds)]) {
      await cleanupPedido(id);
    }
    await closeDb();
  });

  /* ===================================================
     GET /api/pedidos/get
  =================================================== */
  describe('GET /api/pedidos/get', () => {
    it('deve retornar 401 para guest (sem token)', async () => {
      const { status } = await request('GET', '/api/pedidos/get');
      assert.equal(status, 401);
    });

    it('consultor vê apenas os seus pedidos', async () => {
      await ensurePedido(1, 1);
      const { status, body } = await request('GET', '/api/pedidos/get', null, tokens.joao);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      for (const p of body) assert.equal(p.id_consultor, 1);
    });

    it('TM vê apenas os seus pedidos', async () => {
      await ensurePedido(1, 2);
      const { status, body } = await request('GET', '/api/pedidos/get', null, tokens.tm);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      for (const p of body) assert.equal(p.id_talent_manager, 1);
    });

    it('SL vê apenas os seus pedidos', async () => {
      await ensurePedido(1, 3);
      const { status, body } = await request('GET', '/api/pedidos/get', null, tokens.sl);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      for (const p of body) assert.equal(p.id_service_line_lider, 1);
    });

    it('admin vê todos os pedidos', async () => {
      await ensurePedido(1, 4);
      const { status, body } = await request('GET', '/api/pedidos/get', null, tokens.admin);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      assert.ok(body.length >= 1);
    });
  });

  /* ===================================================
     GET /api/pedidos/:id/get
  =================================================== */
  describe('GET /api/pedidos/:id/get', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/pedidos/1/get');
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('GET', '/api/pedidos/999999/get', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor vê o próprio pedido', async () => {
      const { id } = await ensurePedido(1, 1);
      const { status, body } = await request('GET', `/api/pedidos/${id}/get`, null, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.id_pedido_badge, id);
    });

    it('outro consultor NÃO vê pedido alheio', async () => {
      const { id } = await ensurePedido(1, 2);
      const { status } = await request('GET', `/api/pedidos/${id}/get`, null, tokens.maria);
      assert.equal(status, 401);
    });

    it('TM vê pedido atribuído a si', async () => {
      const { id } = await ensurePedido(1, 3);
      const { status } = await request('GET', `/api/pedidos/${id}/get`, null, tokens.tm);
      assert.equal(status, 200);
    });

    it('SL vê pedido da sua service line', async () => {
      const { id } = await ensurePedido(1, 4);
      const { status } = await request('GET', `/api/pedidos/${id}/get`, null, tokens.sl);
      assert.equal(status, 200);
    });

    it('admin vê qualquer pedido', async () => {
      const { id } = await ensurePedido(1, 5);
      const { status } = await request('GET', `/api/pedidos/${id}/get`, null, tokens.admin);
      assert.equal(status, 200);
    });
  });

  /* ===================================================
     POST /api/pedidos/create
  =================================================== */
  describe('POST /api/pedidos/create', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('POST', '/api/pedidos/create', { id_consultor: 1, id_badge: 1 });
      assert.equal(status, 401);
    });

    it('deve retornar 401 para TM', async () => {
      const { status } = await request('POST', '/api/pedidos/create', { id_consultor: 1, id_badge: 1 }, tokens.tm);
      assert.equal(status, 401);
    });

    it('deve retornar 401 para SL', async () => {
      const { status } = await request('POST', '/api/pedidos/create', { id_consultor: 1, id_badge: 1 }, tokens.sl);
      assert.equal(status, 401);
    });

    it('consultor cria pedido com sucesso', async () => {
      const badge = await findFreeBadge(1);
      if (!badge) throw new Error('No free badge for consultor');
      const before = await findPedido(1, badge);
      if (before) await cleanupPedido(before.id_pedido_badge);
      const { status, body } = await request('POST', '/api/pedidos/create',
        { id_consultor: 1, id_badge: badge }, tokens.joao);
      assert.equal(status, 201);
      assert.ok(body.dados?.id_pedido_badge);
      createdIds.push(body.dados.id_pedido_badge);
    });

    it('admin cria pedido com sucesso', async () => {
      const badge = await findFreeBadge(2);
      if (!badge) throw new Error('No free badge for consultor 2');
      const before = await findPedido(2, badge);
      if (before) await cleanupPedido(before.id_pedido_badge);
      const { status, body } = await request('POST', '/api/pedidos/create',
        { id_consultor: 2, id_badge: badge }, tokens.admin);
      assert.equal(status, 201);
      assert.ok(body.dados?.id_pedido_badge);
      createdIds.push(body.dados.id_pedido_badge);
    });

    it('rejeita badge inexistente', async () => {
      const { status, body } = await request('POST', '/api/pedidos/create',
        { id_consultor: 1, id_badge: 999 }, tokens.admin);
      assert.ok(status === 404 || status === 400);
    });
  });

  /* ===================================================
     POST /api/pedidos/:id/tm-review
  =================================================== */
  describe('POST /api/pedidos/:id/tm-review', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('POST', '/api/pedidos/1/tm-review', { acao: 'aprovar' });
      assert.equal(status, 401);
    });

    it('consultor não pode aprovar', async () => {
      const { id } = await ensurePedido(1, 1);
      const { status } = await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'aprovar' }, tokens.joao);
      assert.equal(status, 401);
    });

    it('SL não pode fazer review de TM', async () => {
      const { id } = await ensurePedido(1, 2);
      const { status } = await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'aprovar' }, tokens.sl);
      assert.equal(status, 401);
    });

    it('TM aprova pedido', async () => {
      const { id } = await ensurePedido(1, 3);
      const { status, body } = await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'aprovar' }, tokens.tm);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido aprovado');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 2);
    });

    it('TM devolve pedido', async () => {
      const { id } = await ensurePedido(1, 4);
      const { status, body } = await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'devolver' }, tokens.tm);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido devolvido');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 3);
    });

    it('admin pode fazer TM review', async () => {
      const { id } = await ensurePedido(1, 5);
      const { status } = await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'aprovar' }, tokens.admin);
      assert.equal(status, 200);
    });

    it('ação inválida retorna 400', async () => {
      const { id } = await ensurePedido(1, 1);
      const { status } = await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'invalida' }, tokens.tm);
      assert.equal(status, 400);
    });

    it('pedido inexistente retorna 404', async () => {
      const { status } = await request('POST', '/api/pedidos/999999/tm-review',
        { acao: 'aprovar' }, tokens.tm);
      assert.equal(status, 404);
    });
  });

  /* ===================================================
     POST /api/pedidos/:id/sl-review
  =================================================== */
  describe('POST /api/pedidos/:id/sl-review', () => {
    async function ensurePedidoTmReady(badgeId) {
      const { id } = await ensurePedido(1, badgeId);
      await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'aprovar' }, tokens.tm);
      return id;
    }

    it('deve retornar 401 para guest', async () => {
      const { status } = await request('POST', '/api/pedidos/1/sl-review', { acao: 'aprovar' });
      assert.equal(status, 401);
    });

    it('consultor não pode fazer SL review', async () => {
      const id = await ensurePedidoTmReady(1);
      const { status } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'aprovar' }, tokens.joao);
      assert.equal(status, 401);
    });

    it('TM não pode fazer SL review', async () => {
      const id = await ensurePedidoTmReady(2);
      const { status } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'aprovar' }, tokens.tm);
      assert.equal(status, 401);
    });

    it('SL aprova pedido', async () => {
      const id = await ensurePedidoTmReady(3);
      const { status, body } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'aprovar' }, tokens.sl);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido aprovado com sucesso');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 4);
    });

    it('SL devolve pedido', async () => {
      const id = await ensurePedidoTmReady(4);
      const { status, body } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'devolver' }, tokens.sl);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido devolvido');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 6);
    });

    it('SL rejeita pedido', async () => {
      const id = await ensurePedidoTmReady(5);
      const { status, body } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'rejeitar' }, tokens.sl);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido rejeitado');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 5);
    });

    it('admin pode fazer SL review', async () => {
      const id = await ensurePedidoTmReady(1);
      const { status } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'aprovar' }, tokens.admin);
      assert.equal(status, 200);
    });

    it('ação inválida retorna 400', async () => {
      const id = await ensurePedidoTmReady(2);
      const { status } = await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'invalida' }, tokens.sl);
      assert.equal(status, 400);
    });

    it('pedido inexistente retorna 404', async () => {
      const { status } = await request('POST', '/api/pedidos/999999/sl-review',
        { acao: 'aprovar' }, tokens.sl);
      assert.equal(status, 404);
    });
  });

  /* ===================================================
     POST /api/pedidos/:id/resubmit
  =================================================== */
  describe('POST /api/pedidos/:id/resubmit', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('POST', '/api/pedidos/1/resubmit');
      assert.equal(status, 401);
    });

    it('TM não pode resubmit', async () => {
      const { id } = await ensurePedido(1, 1);
      const { status } = await request('POST', `/api/pedidos/${id}/resubmit`,
        {}, tokens.tm);
      assert.equal(status, 401);
    });

    it('SL não pode resubmit', async () => {
      const { id } = await ensurePedido(1, 2);
      const { status } = await request('POST', `/api/pedidos/${id}/resubmit`,
        {}, tokens.sl);
      assert.equal(status, 401);
    });

    it('consultor reenvia após devolução TM (estado 3)', async () => {
      const { id } = await ensurePedido(1, 3);
      await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'devolver' }, tokens.tm);
      const { status, body } = await request('POST', `/api/pedidos/${id}/resubmit`,
        {}, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido reenviado com sucesso');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 1);
    });

    it('consultor reenvia após devolução SL (estado 6)', async () => {
      const { id } = await ensurePedido(1, 4);
      await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'aprovar' }, tokens.tm);
      await request('POST', `/api/pedidos/${id}/sl-review`,
        { acao: 'devolver' }, tokens.sl);
      const { status, body } = await request('POST', `/api/pedidos/${id}/resubmit`,
        {}, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Pedido reenviado com sucesso');
      const pedido = await findPedidoById(id);
      assert.equal(pedido.estado_atual, 1);
    });

    it('pedido em estado 1 não pode ser reenviado', async () => {
      const { id } = await ensurePedido(1, 5);
      const { status, body } = await request('POST', `/api/pedidos/${id}/resubmit`,
        {}, tokens.joao);
      assert.equal(status, 400);
      assert.ok(body.mensagem.includes('não pode ser reenviado'));
    });

    it('admin pode resubmit', async () => {
      const { id } = await ensurePedido(1, 1);
      await request('POST', `/api/pedidos/${id}/tm-review`,
        { acao: 'devolver' }, tokens.tm);
      const { status } = await request('POST', `/api/pedidos/${id}/resubmit`,
        {}, tokens.admin);
      assert.equal(status, 200);
    });

    it('pedido inexistente retorna 404', async () => {
      const { status } = await request('POST', '/api/pedidos/999999/resubmit',
        {}, tokens.admin);
      assert.equal(status, 404);
    });
  });

  /* ===================================================
     GET /api/pedidos/:id/historico
  =================================================== */
  describe('GET /api/pedidos/:id/historico', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/pedidos/1/historico');
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('GET', '/api/pedidos/999999/historico', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor vê histórico do próprio pedido', async () => {
      const { id } = await ensurePedido(1, 2);
      const { status, body } = await request('GET', `/api/pedidos/${id}/historico`, null, tokens.joao);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      assert.ok(body.length >= 1);
    });

    it('outro consultor não vê histórico alheio', async () => {
      const { id } = await ensurePedido(1, 3);
      const { status } = await request('GET', `/api/pedidos/${id}/historico`, null, tokens.maria);
      assert.equal(status, 401);
    });

    it('TM vê histórico do pedido atribuído', async () => {
      const { id } = await ensurePedido(1, 4);
      const { status } = await request('GET', `/api/pedidos/${id}/historico`, null, tokens.tm);
      assert.equal(status, 200);
    });

    it('SL vê histórico do pedido da sua SL', async () => {
      const { id } = await ensurePedido(1, 5);
      const { status } = await request('GET', `/api/pedidos/${id}/historico`, null, tokens.sl);
      assert.equal(status, 200);
    });

    it('admin vê histórico de qualquer pedido', async () => {
      const { id } = await ensurePedido(1, 1);
      const { status } = await request('GET', `/api/pedidos/${id}/historico`, null, tokens.admin);
      assert.equal(status, 200);
    });
  });
});
