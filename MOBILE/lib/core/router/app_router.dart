//AQUI VAO ESTAR TODAS AS ROTAS DA APLICACAO (GoRouter)
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
//importar os ecras
import '../../features/auth/screens/ecra_login.dart';
import '../../features/auth/screens/ecra_registar.dart';
import '../../features/home/widgets/consultor_navBar.dart'; //trata de atualizar o body entre paginas
import '../../features/home/screens/ecra_alterar_definicoes.dart';
import '../../features/home/screens/ecra_LearningPathInfo.dart';
import '../../features/home/screens/ecra_ServiceLineInfo.dart';
import '../../features/home/screens/ecra_AreasInfo.dart';
import '../../features/home/screens/ecra_CandidatarBadge.dart';
import '../../features/home/screens/ecra_AdicionarObjetivo.dart';
import '../../features/home/screens/ecra_AdicionarDataObjetivo.dart';
import '../../features/home/screens/ecra_BadgesObtidos.dart';
import '../../features/home/screens/ecra_badgesRecomendados.dart';
import '../../features/auth/screens/ecra_recuperarPassword.dart';

import '../../core/app_state.dart';
import '../../core/services/sync_service.dart';

//definir as rotas da aplicacao
class AppRoutes {
  static const String login = '/login';
  static const String registar = '/registar';
  static const String homepage = '/homepage';
  static const String definicoes = '/definicoes';
  static const String alterarDefinicoes = '/alterarDefinicoes';
  static const String mostrarLearningPathInfo = '/mostrarLearningPathInfo';
  static const String mostrarServiceLineInfo = '/mostrarServiceLineInfo';
  static const String mostrarAreasInfo = '/mostrarAreasInfo';
  static const String mostrarCandidaturaBadge = '/mostrarCandidaturaBadge';
  static const String mostrarObjetivos = '/mostrarObjetivos';
  static const String adicionarObjetivo = '/adicionarObjetivo';
  static const String adicionarDataObjetivo = '/adicionarDataObjetivo';
  static const String mostrarBadgesConcluidos = '/mostrarBadgesConcluidos';
  static const String mostrarBadgesRecomendados = '/mostrarBadgesRecomendados';
  static const String recuperarPassword = '/recuperarPassword';
}
//permite que o widget detete quando uma pagina que estava em cima na pilha foi removida (pop)
final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();

//Configurar o Gorouter
final appRouter = GoRouter(

  // Verifica se o ID existe no AppState para decidir por onde começar
  initialLocation: AppState().idConsultor != 0 ? AppRoutes.homepage : AppRoutes.login,

  observers: [routeObserver], //observer global aqui,

  // VALIDAÇÃO GLOBAL DE TOKEN EM TODAS AS NAVEGAÇÕES
  redirect: (context, state) async {
    // Definir quais são as rotas que NÃO precisam de login
    final bool isLoggingIn = state.matchedLocation == AppRoutes.login;
    final bool isRegistering = state.matchedLocation == AppRoutes.registar;
    final bool isRecoveringPassword = state.matchedLocation == AppRoutes.recuperarPassword;

    if (isLoggingIn || isRegistering || isRecoveringPassword) {
      return null;
    }

    // Se o token estiver expirado ou não existir
    if (AppState().isTokenExpired()) {
      print(">>> [ROUTER] Sessão expirada. A redirecionar para Login...");
      
      // Limpa os dados do AppState e SharedPrefs para garantir
      await AppState().logout(); 
      
      return AppRoutes.login;
    }
    // Se estiver tudo OK, continua para a rota pretendida
    return null;
  },

  routes: [
    GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const EcraLogin(),
    ),
    GoRoute(
        path: AppRoutes.registar,
        builder: (context,state) => const EcraRegistar(),
    ),
    GoRoute(
      path: AppRoutes.homepage,
      builder: (context, state) {
        final idConsultor = (state.extra as int?) ?? AppState().idConsultor;
        
        // DISPARAR SYNC COMPLETO AO ENTRAR NA HOMEPAGE
        if (idConsultor != 0) {
          print(">>> [ROUTER] Homepage. A iniciar sincronização com a API...");
          SyncService.instance.syncAll(idConsultor);
        }

        return ConsultorNavBar(idConsultorLogado:idConsultor);
      }
    ),
    GoRoute(
      path: AppRoutes.alterarDefinicoes,
      builder:(context, state) => const EcraAlterarDefinicoes(),
    ),
    GoRoute(
      path: AppRoutes.mostrarLearningPathInfo,
      builder: (context, state) {
        //extrair a variavel enviada no 'extra' (que e o id do Learning Path)
        final lpSelecionado = state.extra as int;
        //passar o id do learningPath para o construtor do Ecra
        return EcraLearningPathInfo(idLearningPath: lpSelecionado);
      },
    ),
    GoRoute(
      path: AppRoutes.mostrarServiceLineInfo,
      builder:(context, state) {
        final slSelecionado = state.extra as int;
        return EcraServiceLineInfo(idServiceLine: slSelecionado);
      }
    ),
    GoRoute(
        path: AppRoutes.mostrarAreasInfo,
        builder: (context,state) {
          final areaSelecionada = state.extra as int;
          return EcraAreasInfo(idArea: areaSelecionada);
        }
    ),
    GoRoute(
      path: AppRoutes.mostrarCandidaturaBadge,
      builder: (context,state){
        final idBadgeSelecionada = state.extra as int;
        return EcraCandidatarBadge(idBadge: idBadgeSelecionada);
      }
    ),
    GoRoute(
      path: AppRoutes.adicionarObjetivo,
      builder: (context,state){
        return const EcraAdicionarObjetivo();
      }
    ),
    GoRoute(
      path: AppRoutes.adicionarDataObjetivo,
      builder: (context,state){
        final extras = state.extra as List<dynamic>;
        final idBadgeSelecionado = extras[0] as int;
        final nomeBadgeSelecionado = extras[1] as String;
        return EcraDataObjetivo(idBadgeObjetivo: idBadgeSelecionado, nomeBadge: nomeBadgeSelecionado,);
      }
    ),
    GoRoute(
        path: AppRoutes.mostrarBadgesConcluidos,
       builder: (context, state) {
          final nomeBadgeSelecionado = state.extra as String;
          return EcraBadgesObtidos(nomeBadgePesquisa: nomeBadgeSelecionado,);
       },
    ),
    GoRoute(
      path: AppRoutes.mostrarBadgesRecomendados,
      builder: (context,state){
        return const EcraBadgesRecomendados();
      }
    ),
    GoRoute(
      path: AppRoutes.recuperarPassword,
      builder: (context,state){
        return const EcraRecuperarPassword();
      }
    ),
  ],
);
