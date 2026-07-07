import 'package:flutter/material.dart';
import 'package:pint_26_mobile/core/router/app_router.dart';
import 'package:intl/date_symbol_data_local.dart'; // PARA TRADUZIR AS DATAS PARA PT
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:pint_26_mobile/core/services/firebase_service.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:pint_26_mobile/core/app_state.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicializar Firebase
  await Firebase.initializeApp();
  
  // Inicializar serviço de mensagens (Push Notifications / Sync Trigger)
  await FirebaseService.init();

  // VERIFICAR SE JA EXISTE TOKEN E IDCONSULTOR (Auto-login)
  // Fazemos isto antes dos syncs para que os pedidos já levem o Token se existir
  final prefs = await SharedPreferences.getInstance();
  final int? idConsultor = prefs.getInt('idConsultor');
  final String? token = prefs.getString('token');

  if (idConsultor != null && token != null) {
    AppState().idConsultor = idConsultor;
    AppState().tokenLogin = token;
  }

  SyncService.instance.syncTableByName('areas').catchError((e) => print("Erro sync inicial areas: $e"));
  SyncService.instance.syncTableByName('learningPaths').catchError((e) => print("Erro sync inicial LP: $e"));
  SyncService.instance.syncTableByName('serviceLines').catchError((e) => print("Erro sync inicial SL: $e"));

  await initializeDateFormatting('pt_PT', null);
  runApp(ProviderScope(child: MyApp(idConsultor: idConsultor)));
}

class MyApp extends StatelessWidget {
  final int? idConsultor;
  MyApp({super.key, this.idConsultor});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'PINT 2026 Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          scrolledUnderElevation: 0,
        ),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF39639C),
          surface: Colors.white,
        ),
      ),
      routerConfig: appRouter, // Usa a configuração que definiste no app_router.dart
      builder: (context, child) {
        return child!;
      },
    );
  }
}
