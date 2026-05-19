const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  request, TOKENS, query,
  cleanupPedido, cleanupDocumento, findPedido, closeDb,
} = require('./helper');

const REQUISITO_PADRAO = 2;
const BADGES = [1, 2, 3, 4, 5, 6];

let tokens = {};
let shared = { pedido1: null, doc1: null, pedido2: null, doc2: null };
const createdPedidos = [];
const createdDocumentos = [];

async function ensurePedido(consultorId, badge) {
  const before = await findPedido(consultorId, badge);
  if (before) await cleanupPedido(before.id_pedido_badge);
  const { status, body } = await request('POST', '/api/pedidos/create',
    { id_consultor: consultorId, id_badge: badge },
    tokens.admin,
  );
  if (status !== 201) throw new Error(`Failed to create pedido: ${JSON.stringify(body)}`);
  const id = body.dados?.id_pedido_badge;
  if (!id) throw new Error(`No pedido id: ${JSON.stringify(body)}`);
  createdPedidos.push(id);
  return id;
}

async function ensureDocumento(pedidoId) {
  const { status, body } = await request('POST', '/api/documentos/create',
    { id_pedido_badge: pedidoId, id_requisito: REQUISITO_PADRAO, documentacao: 'Base64DocTeste123' },
    tokens.admin);
  if (status !== 201) throw new Error(`Failed to create documento: ${JSON.stringify(body)}`);
  const id = body.dados?.id_documentacao;
  if (!id) throw new Error(`No documento id: ${JSON.stringify(body)}`);
  createdDocumentos.push(id);
  return id;
}

async function findFreeBadge(consultorId) {
  for (const badgeId of BADGES) {
    const existing = await findPedido(consultorId, badgeId);
    if (!existing) return badgeId;
  }
  return null;
}

describe('Documentos', () => {
  before(async () => {
    for (const name of Object.keys(TOKENS)) {
      tokens[name] = TOKENS[name];
    }
    for (const cId of [1, 2]) {
      for (const bId of BADGES) {
        const res = await query(
          'SELECT id_pedido_badge FROM "PedidosBadges" WHERE id_consultor = $1 AND id_badge = $2 AND estado_atual NOT IN (4, 5) LIMIT 1',
          [cId, bId],
        );
        if (res.rows[0]) await cleanupPedido(res.rows[0].id_pedido_badge);
      }
    }
    shared.pedido1 = await ensurePedido(1, 1);
    shared.doc1 = await ensureDocumento(shared.pedido1);
    shared.pedido2 = await ensurePedido(2, 1);
    shared.doc2 = await ensureDocumento(shared.pedido2);
  });

  after(async () => {
    for (const id of [...new Set(createdDocumentos)]) {
      await cleanupDocumento(id);
    }
    for (const id of [...new Set(createdPedidos)]) {
      await cleanupPedido(id);
    }
    await closeDb();
  });

  describe('GET /api/documentos/get', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/documentos/get');
      assert.equal(status, 401);
    });

    it('deve retornar 401 para consultor', async () => {
      const { status } = await request('GET', '/api/documentos/get', null, tokens.joao);
      assert.equal(status, 401);
    });

    it('admin vê todos os documentos', async () => {
      const { status, body } = await request('GET', '/api/documentos/get', null, tokens.admin);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
    });
  });

  describe('GET /api/documentos/:id/get', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/documentos/1/get');
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('GET', '/api/documentos/999999/get', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor vê o próprio documento', async () => {
      const { status, body } = await request('GET', `/api/documentos/${shared.doc1}/get`, null, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.id_documentacao, shared.doc1);
    });

    it('consultor NÃO vê documento alheio', async () => {
      const { status } = await request('GET', `/api/documentos/${shared.doc2}/get`, null, tokens.joao);
      assert.equal(status, 401);
    });

    it('admin vê qualquer documento', async () => {
      const { status } = await request('GET', `/api/documentos/${shared.doc1}/get`, null, tokens.admin);
      assert.equal(status, 200);
    });
  });

  describe('GET /api/documentos/pedido/:id_pedido', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/documentos/pedido/1');
      assert.equal(status, 401);
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const { status } = await request('GET', '/api/documentos/pedido/999999', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor vê documentos do próprio pedido', async () => {
      const { status, body } = await request('GET', `/api/documentos/pedido/${shared.pedido1}`, null, tokens.joao);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
    });

    it('consultor NÃO vê documentos de pedido alheio', async () => {
      const { status } = await request('GET', `/api/documentos/pedido/${shared.pedido2}`, null, tokens.joao);
      assert.equal(status, 401);
    });

    it('admin vê documentos de qualquer pedido', async () => {
      const { status } = await request('GET', `/api/documentos/pedido/${shared.pedido1}`, null, tokens.admin);
      assert.equal(status, 200);
    });
  });

  describe('GET /api/documentos/pedido/:id_pedido/requisito/:id_requisito', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/documentos/pedido/1/requisito/1');
      assert.equal(status, 401);
    });

    it('deve retornar 404 para documento não encontrado', async () => {
      const { status } = await request('GET', '/api/documentos/pedido/1/requisito/999',
        null, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor vê o próprio documento por requisito', async () => {
      const { status, body } = await request('GET',
        `/api/documentos/pedido/${shared.pedido1}/requisito/${REQUISITO_PADRAO}`, null, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.id_documentacao, shared.doc1);
    });

    it('consultor NÃO vê documento alheio por requisito', async () => {
      const { status } = await request('GET',
        `/api/documentos/pedido/${shared.pedido2}/requisito/${REQUISITO_PADRAO}`, null, tokens.joao);
      assert.equal(status, 401);
    });
  });

  describe('POST /api/documentos/create', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('POST', '/api/documentos/create',
        { id_pedido_badge: 1, id_requisito: REQUISITO_PADRAO, documentacao: 'x' });
      assert.equal(status, 401);
    });

    it('deve retornar 401 para TM', async () => {
      const { status } = await request('POST', '/api/documentos/create',
        { id_pedido_badge: 1, id_requisito: REQUISITO_PADRAO, documentacao: 'x' }, tokens.tm);
      assert.equal(status, 401);
    });

    it('deve retornar 400 sem campos obrigatórios', async () => {
      const { status } = await request('POST', '/api/documentos/create',
        {}, tokens.admin);
      assert.equal(status, 400);
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const { status } = await request('POST', '/api/documentos/create',
        { id_pedido_badge: 999999, id_requisito: REQUISITO_PADRAO, documentacao: 'x' }, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor cria documento com sucesso', async () => {
      const badge = await findFreeBadge(1);
      if (!badge) throw new Error('No free badge');
      const pedidoId = await ensurePedido(1, badge);
      const { status, body } = await request('POST', '/api/documentos/create',
        { id_pedido_badge: pedidoId, id_requisito: REQUISITO_PADRAO, documentacao: 'Base64DocConsulta' }, tokens.joao);
      assert.equal(status, 201);
      assert.ok(body.dados?.id_documentacao);
      createdDocumentos.push(body.dados.id_documentacao);
    });
  });

  describe('PUT /api/documentos/:id/update', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('PUT', '/api/documentos/1/update',
        { documentacao: 'x' });
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('PUT', '/api/documentos/999999/update',
        { documentacao: 'x' }, tokens.admin);
      assert.equal(status, 404);
    });

    it('consultor atualiza o próprio documento', async () => {
      const badge = await findFreeBadge(1);
      if (!badge) throw new Error('No free badge');
      const pedidoId = await ensurePedido(1, badge);
      const docId = await ensureDocumento(pedidoId);
      const { status, body } = await request('PUT', `/api/documentos/${docId}/update`,
        { documentacao: 'NovaBase64' }, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.dados.documentacao, 'NovaBase64');
    });

    it('consultor NÃO atualiza documento alheio', async () => {
      const { status } = await request('PUT', `/api/documentos/${shared.doc2}/update`,
        { documentacao: 'x' }, tokens.joao);
      assert.equal(status, 401);
    });
  });

  describe('DELETE /api/documentos/:id/delete', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('DELETE', '/api/documentos/1/delete');
      assert.equal(status, 401);
    });

    it('deve retornar 401 para consultor', async () => {
      const { status } = await request('DELETE', '/api/documentos/1/delete', null, tokens.joao);
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('DELETE', '/api/documentos/999999/delete', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('admin elimina documento com sucesso', async () => {
      const badge = await findFreeBadge(1);
      if (!badge) throw new Error('No free badge');
      const pedidoId = await ensurePedido(1, badge);
      const docId = await ensureDocumento(pedidoId);
      const { status, body } = await request('DELETE', `/api/documentos/${docId}/delete`, null, tokens.admin);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Documento eliminado com sucesso');
    });
  });

  describe('PUT /api/documentos/:id/validate', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('PUT', '/api/documentos/1/validate',
        { validado: true });
      assert.equal(status, 401);
    });

    it('deve retornar 401 para consultor', async () => {
      const { status } = await request('PUT', '/api/documentos/1/validate',
        { validado: true }, tokens.joao);
      assert.equal(status, 401);
    });

    it('deve retornar 400 sem validado', async () => {
      const { status } = await request('PUT', '/api/documentos/1/validate',
        {}, tokens.admin);
      assert.equal(status, 400);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('PUT', '/api/documentos/999999/validate',
        { validado: true }, tokens.admin);
      assert.equal(status, 404);
    });

    it('TM valida documento com sucesso', async () => {
      const badge = await findFreeBadge(1);
      if (!badge) throw new Error('No free badge');
      const pedidoId = await ensurePedido(1, badge);
      const docId = await ensureDocumento(pedidoId);
      const { status, body } = await request('PUT', `/api/documentos/${docId}/validate`,
        { validado: true, observacao: 'ok' }, tokens.tm);
      assert.equal(status, 200);
      assert.ok(body.mensagem.includes('validado'));
      assert.equal(body.dados.validado, true);
    });
  });
});
