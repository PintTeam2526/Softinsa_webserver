import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class DatabaseHelper {
  static const _databaseName = "MyDbLocal.db";
  static const _databaseVersion = 2; // Aumentado para 2 para forçar o upgrade

  DatabaseHelper._privateConstructor();
  static final DatabaseHelper instance = DatabaseHelper._privateConstructor();

  static Database? _database;
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  _initDatabase() async {
    Directory documentsDirectory = await getApplicationDocumentsDirectory();
    String path = join(documentsDirectory.path, _databaseName);
    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Se a versão for antiga, garantimos que todas as tabelas têm as colunas de sync
    if (oldVersion < 2) {
      List<String> tables = [
        'learningPaths', 'serviceLines', 'areas', 'consultores', 
        'badges', 'requisitos', 'badgesConcluidos', 'estados', 
        'pedidosBadge', 'historicoPedidos', 'objetivos', 'notificacoes',
        'documentacoes', 'documentacaoTemporaria', 'conquistas', 'conquistasConsultores'
      ];

      for (var table in tables) {
        try {
          await db.execute("ALTER TABLE $table ADD COLUMN updated_at TEXT;");
        } catch (e) { /* Coluna já existe */ }
        try {
          await db.execute("ALTER TABLE $table ADD COLUMN sync_status TEXT;");
        } catch (e) { /* Coluna já existe */ }
      }
      
      try {
        await db.execute("ALTER TABLE pedidosBadge ADD COLUMN SESSAO_ID TEXT;");
      } catch (e) { /* Coluna já existe */ }

      try {
        await db.execute("ALTER TABLE documentacoes ADD COLUMN SESSAO_ID TEXT;");
      } catch (e) { /* Coluna já existe */ }
    }
  }

  Future _onCreate(Database db, int version) async {
    await db.execute('''
          CREATE TABLE learningPaths (
            ID_LEARNINGPATH INTEGER PRIMARY KEY,
            NOME_LEARNINGPATH TEXT NOT NULL,
            DESCRICAO_LEARNINGPATH TEXT NOT NULL,
            IMAGEM_LEARNING_PATH TEXT NOT NULL,
            ESTADO_A_I_ INT NOT NULL,
            DATA_INSERCAO TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE serviceLines (
            ID_SERVICELINE INTEGER PRIMARY KEY,
            ID_LEARNINGPATH INTEGER NOT NULL,
            NOME_SERVICELINE TEXT NOT NULL,
            DESCRICAO_SERVICELINE TEXT NOT NULL,
            IMAGEM_SERVICE_LINE TEXT NOT NULL,
            ESTADO_A_I_ INT NOT NULL,
            DATA_INSERCAO TEXT NOT NULL,
            NOME_LP_PAI TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE areas (
            id_area INTEGER PRIMARY KEY,
            id_service_line INTEGER NOT NULL,
            nome_area TEXT NOT NULL,
            descricao_area TEXT NOT NULL,
            imagem_area TEXT NOT NULL,
            estado_a_i INTEGER NOT NULL, 
            data_insercao TEXT NOT NULL,
            nome_service_line TEXT,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE consultores (
            ID_CONSULTOR INTEGER PRIMARY KEY,
            TOTAL_PONTOS INTEGER NOT NULL,
            ID_AREA_PREFERENCIA INTEGER NOT NULL,
            NOME_AREA_PREFERENCIA TEXT NOT NULL,
            NOME_UTILIZADOR TEXT NOT NULL,
            EMAIL_UTILIZADOR TEXT NOT NULL,
            IMAGEM_PERFIL TEXT NOT NULL,
            USERNAME_UTILIZADOR TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE badges (
            ID_BADGE INTEGER PRIMARY KEY,
            ID_AREA INTEGER NOT NULL,
            NOME_BADGE TEXT NOT NULL,
            DESCRICAO_BADGE TEXT NOT NULL,
            PONTOS_BADGE INT NOT NULL,
            PAGO INT NOT NULL,
            NIVEL_BADGE TEXT NOT NULL,
            IMAGEM_BADGE TEXT NOT NULL,
            nome_area_pai TEXT NOT NULL,
            ESTADO_A_I_ INTEGER NOT NULL,
            DATA_INSERCAO TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE requisitos (
            ID_REQUISITO INTEGER PRIMARY KEY,
            ID_BADGE INTEGER NOT NULL,
            NOME_REQUISITO TEXT NOT NULL,
            DESCRICAO_REQUISITO TEXT NOT NULL,
            IMAGEM_REQUISITO TEXT NOT NULL,
            ESTADO_A_I_ INT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE badgesConcluidos (
            ID_BADGE_CONCLUIDO INTEGER PRIMARY KEY,
            ID_CONSULTOR INTEGER,
            ID_BADGE INTEGER NOT NULL,
            NOME_BADGE TEXT NOT NULL,
            nome_area_pai TEXT NOT NULL,
            NIVEL_BADGE TEXT NOT NULL,
            PONTOS_BADGE INTEGER NOT NULL,
            IMAGEM_BADGE TEXT NOT NULL,
            DATA_CONCLUSAO TEXT NOT NULL,
            VALIDADE INTEGER,
            nome_sl_pai TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE estados (
            ID_ESTADO INTEGER PRIMARY KEY,
            NOME_ESTADO TEXT NOT NULL,
            DESCRICAO_ESTADO TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE pedidosBadge (
            ID_PEDIDO_BADGE INTEGER PRIMARY KEY,
            ID_CONSULTOR INTEGER NOT NULL,
            ID_BADGE INTEGER NOT NULL,
            ESTADO_ATUAL INTEGER NOT NULL,
            SESSAO_ID TEXT,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE historicoPedidos (
            ID_HISTORICO INTEGER PRIMARY KEY,
            ID_BADGE INTEGER NOT NULL,
            ID_CONSULTOR INTEGER NOT NULL,
            DATA TEXT,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE objetivos (
            ID_OBJETIVO INTEGER PRIMARY KEY,
            ID_BADGE INTEGER NOT NULL,
            ID_CONSULTOR INTEGER NOT NULL,
            NOME_OBJETIVO TEXT NOT NULL,
            DATA_LIMITE_CONCLUSAO TEXT,
            DATA_CONCLUSAO_OBJETIVO TEXT,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE notificacoes ( 
            ID_NOTIFICACAO INTEGER PRIMARY KEY,
            ID_CONSULTOR INTEGER NOT NULL,
            NOTIFICACAO TEXT NOT NULL,
            DATA_DE_ENVIO TEXT NOT NULL,
            REMETENTE TEXT NOT NULL,
            DESCRICAO TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE documentacoes( 
            ID_DOCUMENTACAO INTEGER PRIMARY KEY,
            ID_HISTORICO INTEGER NOT NULL,
            ID_CONSULTOR INTEGER NOT NULL,
            DOCUMENTACAO TEXT NOT NULL,
            SESSAO_ID TEXT,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE documentacaoTemporaria(
            ID INTEGER PRIMARY KEY,
            SESSAO_ID TEXT NOT NULL,
            DOCUMENTACAO TEXT NOT NULL,
            DATA_INSERCAO TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE conquistas (
            ID_CONQUISTA INTEGER PRIMARY KEY,
            DESCRICAO_CONQUISTA TEXT NOT NULL,
            PONTOS_CONQUISTA INTEGER NOT NULL,
            TIPO_CONQUISTA TEXT NOT NULL,
            VALOR_CONQUISTA INTEGER NOT NULL,
            ESTADO_CONQUISTA TEXT NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
    await db.execute('''
          CREATE TABLE conquistasConsultores (
            ID_CONQUISTA_CONSULTOR INTEGER PRIMARY KEY,
            ID_CONSULTOR INTEGER NOT NULL,
            ID_CONQUISTA INTEGER NOT NULL,
            updated_at TEXT,
            sync_status TEXT
          )
          ''');
  }

  Future<void> upsert(String table, Map<String, dynamic> row) async {
    Database db = await instance.database;
    await db.insert(
      table,
      row,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Map<String, dynamic>>> queryAll(String table) async {
    Database db = await instance.database;
    return await db.query(table);
  }

  Future<List<Map<String, dynamic>>> getPendingSync(String table) async {
    Database db = await instance.database;
    return await db.query(table, where: "sync_status = ?", whereArgs: ['pending']);
  }

  Future<int> getNextTempId(String table, String idColumnName) async {
    Database db = await instance.database;
    final List<Map<String, dynamic>> res = await db.rawQuery('SELECT MIN($idColumnName) as minId FROM $table');
    int minId = res.first['minId'] ?? 0;
    return minId >= 0 ? -1 : minId - 1;
  }

  Future<void> updateAfterSync(String table, String idColumnName, int oldId, int newId) async {
    Database db = await instance.database;
    await db.rawUpdate(
        'UPDATE $table SET $idColumnName = ?, sync_status = "synced" WHERE $idColumnName = ?',
        [newId, oldId]
    );
  }

  Future<String?> getLastUpdate(String table, {int? idConsultor}) async {
    Database db = await instance.database;
    
    // Lista de tabelas que são específicas de consultor (possuem ID_CONSULTOR)
    const userTables = [
      'consultores', 'badgesConcluidos', 'pedidosBadge', 'historicoPedidos', 
      'objetivos', 'notificacoes', 'documentacoes', 'conquistasConsultores'
    ];

    String query = 'SELECT MAX(updated_at) as lastUpdate FROM $table WHERE sync_status = "synced"';
    List<dynamic> args = [];

    if (idConsultor != null && userTables.contains(table)) {
      query += ' AND ID_CONSULTOR = ?';
      args.add(idConsultor);
    }

    final List<Map<String, dynamic>> res = await db.rawQuery(query, args);
    return res.first['lastUpdate'] as String?;
  }

  Future<void> clearUserData() async {
    Database db = await instance.database;
    const privateTables = [
      'consultores', 'badgesConcluidos', 'objetivos', 'notificacoes', 
      'pedidosBadge', 'historicoPedidos', 'documentacoes', 'conquistasConsultores', 
      'conquistas'
    ];
    for (var table in privateTables) {
      await db.delete(table);
    }
    print(">>> [DB] Dados do utilizador limpos.");
  }

}
