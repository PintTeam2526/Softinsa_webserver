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

      String? table = message.data['table'];
      String? idPushStr = message.data['id_consultor'];
      
      int currentId = AppState().idConsultor;
      int? idToSync;

      // 1. Verificar se a notificação é destinada ao consultor logado (se vier ID no push)
      if (idPushStr != null && idPushStr.isNotEmpty) {
        int? idPush = int.tryParse(idPushStr);

        if (idPush != null && idPush != currentId && currentId != 0) {
          print('>>> [FIREBASE] Notificação ignorada: não é para o consultor logado');
          return;
        }
        idToSync = idPush;
      } else {
        // Se não vier ID no push, assumimos o consultor logado (se houver) para syncs globais ou dependentes de ID
        idToSync = currentId > 0 ? currentId : null;
      }
      
      // 2. SEMPRE que recebermos uma notificação válida para o consultor logado, sincronizamos a tabela 'consultores'
      // Isto garante que o perfil, pontos, etc. estejam sempre atualizados.
      if (idToSync != null) {
        print('>>> [FIREBASE] Sync automático: consultores');
        _syncService.syncTableByName('consultores', idConsultor: idToSync);
      }

      // 3. Sincronizar a tabela específica solicitada no payload (se for diferente de 'consultores')
      if (table != null && table.isNotEmpty && table != 'consultores') {
        print('>>> [FIREBASE] Sync solicitado: Tabela $table');
        _syncService.syncTableByName(table, idConsultor: idToSync);
      }
    });
  }
}
