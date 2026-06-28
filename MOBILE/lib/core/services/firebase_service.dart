import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class FirebaseService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  
  // USAR A INSTÂNCIA SINGLETON PARA PARTILHAR LOCKS E STREAM
  static final SyncService _syncService = SyncService.instance;

  static Future<void> init() async {
    // Pedir permissões (necessário para iOS e Android 13+)
    NotificationSettings settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      print('>>> [FIREBASE] Permissão concedida.');
      
      // Subscrever ao topico de atualizacoes (o mesmo que na api)
      await _messaging.subscribeToTopic('atualizacao_mobile');
      print('>>> [FIREBASE] Subscrito ao tópico: atualizacao_mobile');

      // Configurar o listener para mensagens em foreground
      _setupForegroundListener();
    }
  }

  static void _setupForegroundListener() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('>>> [FIREBASE] Notificacao push recebida!');

      // O backend deve enviar: { "table": "nome_da_tabela", "id_consultor": "3" }
      if (message.data.containsKey('table')) {
        String table = message.data['table'];
        String? idPushStr = message.data['id_consultor'];
        
        int currentId = AppState().idConsultor;
        int? idToSync;

        print('>>> [FIREBASE] Sync solicitado: Tabela $table');

        // Se vier um ID de consultor no Push, verificamos se coincide com o logado
        if (idPushStr != null && idPushStr.isNotEmpty) {
          int? idPush = int.tryParse(idPushStr);

          if (idPush != null && idPush != currentId && currentId != 0) {
            print('>>> [FIREBASE] Notificação ignorada: não é para o consultor logado');
            return;
          }
          idToSync = idPush;
        } else {
          // Se não vier ID no push, usamos o logado (caso de tabelas globais que podem precisar de ID para filtros)
          idToSync = currentId > 0 ? currentId : null;
        }
        
        // Disparar o sync APENAS para a tabela solicitada
        _syncService.syncTableByName(table, idConsultor: idToSync);
      }
    });
  }
}
