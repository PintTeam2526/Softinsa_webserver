const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  request, TOKENS, query,
  cleanupRequisito, closeDb,
} = require('./helper');

let tokens = {};
const createdRequisitos = [];

async function ensureRequisito(badgeId = 1, nome = 'Requisito Teste') {
  const { status, body } = await request('POST', '/api/requisitos/create',
    { id_badge: badgeId, nome_requisito: nome },
    tokens.admin,
  );
  if (status !== 201) throw new Error(`Failed to create requisito: ${JSON.stringify(body)}`);
  const id = body.dados?.id_requisito;
  if (!id) throw new Error(`No id in response: ${JSON.stringify(body)}`);
  createdRequisitos.push(id);
  return { id, nome };
}

describe('Requisitos', () => {
  before(async () => {
    for (const name of Object.keys(TOKENS)) {
      tokens[name] = TOKENS[name];
    }
  });

  after(async () => {
    for (const id of [...new Set(createdRequisitos)]) {
      await cleanupRequisito(id);
    }
    await closeDb();
  });

  describe('GET /api/requisitos/get', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/requisitos/get');
      assert.equal(status, 401);
    });

    it('admin vê todos os requisitos (incluindo inativos)', async () => {
      const { status, body } = await request('GET', '/api/requisitos/get', null, tokens.admin);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
    });

    it('consultor vê apenas requisitos ativos', async () => {
      const { status, body } = await request('GET', '/api/requisitos/get', null, tokens.joao);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      for (const r of body) assert.equal(r.estado_a_i, true);
    });

    it('TM vê apenas requisitos ativos', async () => {
      const { status, body } = await request('GET', '/api/requisitos/get', null, tokens.tm);
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      for (const r of body) assert.equal(r.estado_a_i, true);
    });
  });

  describe('GET /api/requisitos/:id/get', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('GET', '/api/requisitos/1/get');
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('GET', '/api/requisitos/999999/get', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('admin vê requisito inativo', async () => {
      const { id } = await ensureRequisito(2, 'Inativo Teste');
      await query('UPDATE "Requisitos" SET estado_a_i = false WHERE id_requisito = $1', [id]);
      const { status } = await request('GET', `/api/requisitos/${id}/get`, null, tokens.admin);
      assert.equal(status, 200);
    });

    it('consultor vê requisito ativo', async () => {
      const { status, body } = await request('GET', '/api/requisitos/2/get', null, tokens.joao);
      assert.equal(status, 200);
      assert.equal(body.id_requisito, 2);
    });

    it('consultor NÃO vê requisito inativo', async () => {
      const { id } = await ensureRequisito(2, 'Inativo Bloqueado');
      await query('UPDATE "Requisitos" SET estado_a_i = false WHERE id_requisito = $1', [id]);
      const { status } = await request('GET', `/api/requisitos/${id}/get`, null, tokens.joao);
      assert.equal(status, 401);
    });
  });

  describe('GET /api/requisitos/get/badge/:id', () => {
    it('retorna requisitos de badge com ID válido', async () => {
      const { status, body } = await request('GET', '/api/requisitos/get/badge/2');
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      for (const r of body) assert.equal(r.ID_BADGE, 2);
    });

    it('retorna array vazio para badge sem requisitos', async () => {
      const { status, body } = await request('GET', '/api/requisitos/get/badge/6');
      assert.equal(status, 200);
      assert.ok(Array.isArray(body));
      assert.equal(body.length, 0);
    });
  });

  describe('POST /api/requisitos/create', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('POST', '/api/requisitos/create', { id_badge: 1, nome_requisito: 'test' });
      assert.equal(status, 401);
    });

    it('deve retornar 401 para TM', async () => {
      const { status } = await request('POST', '/api/requisitos/create',
        { id_badge: 1, nome_requisito: 'test' }, tokens.tm);
      assert.equal(status, 401);
    });

    it('deve retornar 400 sem id_badge', async () => {
      const { status } = await request('POST', '/api/requisitos/create',
        { nome_requisito: 'test' }, tokens.admin);
      assert.equal(status, 400);
    });

    it('deve retornar 400 sem nome_requisito', async () => {
      const { status } = await request('POST', '/api/requisitos/create',
        { id_badge: 1 }, tokens.admin);
      assert.equal(status, 400);
    });

    it('deve retornar 404 para badge inexistente', async () => {
      const { status } = await request('POST', '/api/requisitos/create',
        { id_badge: 999, nome_requisito: 'test' }, tokens.admin);
      assert.equal(status, 404);
    });

    it('cria requisito com sucesso', async () => {
      const { status, body } = await request('POST', '/api/requisitos/create',
        { id_badge: 2, nome_requisito: 'Requisito Teste Criação' }, tokens.admin);
      assert.equal(status, 201);
      assert.ok(body.dados?.id_requisito);
      assert.equal(body.dados.nome_requisito, 'Requisito Teste Criação');
      createdRequisitos.push(body.dados.id_requisito);
    });
  });

  describe('PUT /api/requisitos/:id/update', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('PUT', '/api/requisitos/1/update', { nome_requisito: 'x' });
      assert.equal(status, 401);
    });

    it('deve retornar 401 para consultor', async () => {
      const { status } = await request('PUT', '/api/requisitos/1/update',
        { nome_requisito: 'x' }, tokens.joao);
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('PUT', '/api/requisitos/999999/update',
        { nome_requisito: 'x' }, tokens.admin);
      assert.equal(status, 404);
    });

    it('atualiza requisito com sucesso', async () => {
      const { id } = await ensureRequisito(3, 'Para Atualizar');
      const { status, body } = await request('PUT', `/api/requisitos/${id}/update`,
        { nome_requisito: 'Atualizado' }, tokens.admin);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Requisito atualizado com sucesso');
      assert.equal(body.dados.nome_requisito, 'Atualizado');
    });
  });

  describe('DELETE /api/requisitos/:id/delete', () => {
    it('deve retornar 401 para guest', async () => {
      const { status } = await request('DELETE', '/api/requisitos/1/delete');
      assert.equal(status, 401);
    });

    it('deve retornar 401 para consultor', async () => {
      const { status } = await request('DELETE', '/api/requisitos/1/delete', null, tokens.joao);
      assert.equal(status, 401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const { status } = await request('DELETE', '/api/requisitos/999999/delete', null, tokens.admin);
      assert.equal(status, 404);
    });

    it('soft-delete requisito com sucesso', async () => {
      const { id } = await ensureRequisito(3, 'Para Deletar');
      const { status, body } = await request('DELETE', `/api/requisitos/${id}/delete`, null, tokens.admin);
      assert.equal(status, 200);
      assert.equal(body.mensagem, 'Requisito eliminado com sucesso');
      const res = await query('SELECT estado_a_i FROM "Requisitos" WHERE id_requisito = $1', [id]);
      assert.equal(res.rows[0].estado_a_i, false);
    });
  });
});
