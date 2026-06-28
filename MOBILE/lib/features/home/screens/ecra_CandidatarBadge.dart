import 'package:flutter/material.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_detalhesBadge.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_requisitosCard.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart'; //VAI GERAR O MEU UID
import 'dart:io';
import 'dart:convert';
import 'package:file_picker/file_picker.dart';

//PEDIDOS DE DADOS (MODEL + REPO)
import 'package:pint_26_mobile/core/repositories/badges_repository.dart'; //chamar o repositorio
import 'package:pint_26_mobile/core/models/badges_model.dart'; //chamar o model
import 'package:pint_26_mobile/core/repositories/requisitos_repository.dart';
import 'package:pint_26_mobile/core/models/requisitos_model.dart';
import 'package:pint_26_mobile/core/repositories/candidaturasBadge_repository.dart';


class EcraCandidatarBadge extends StatefulWidget{
    final int idBadge;

    const EcraCandidatarBadge({
    super.key,
    required this.idBadge
});

    @override
    State<EcraCandidatarBadge> createState() => _EcraCandidatarBadgeState();
}

class _EcraCandidatarBadgeState extends State<EcraCandidatarBadge>{

  //INSTANCIAR REPOSITORIO
  final BadgesRepository _repositorioBadge = BadgesRepository();
  final RequisitosRepository _repositorioRequisitos = RequisitosRepository();
  final CandidaturasBadgeRepository _repositorioCandidaturas = CandidaturasBadgeRepository();
  //INSTANCIAR VARIAVEL FUTURE QUE AGUARDA A REPOSTA DO REPO
  late Future<BadgesModel> _futureBadge;
  late Future<List<RequisitosModel>> _futureRequisitos;
  late Future<List<dynamic>> _pedidos;
  late String sessaoID;
  var quantidadeRequisitos = 0;
  var quantidadePDFSubmetido = 0;
  //INITSTATE DO PEDIDO FUTURE
  @override
  void initState(){
    super.initState();
    //GERAR O ID PARA ESTA SESSAO
    sessaoID = const Uuid().v4(); // Gera um UNIQUEIDENTIFIER
    _pedidos = Future.wait([
      _repositorioBadge.getBadgeById(widget.idBadge),
      _repositorioRequisitos.getRequisitosBadge(widget.idBadge),
      _repositorioBadge.getEstadoBadgeConsultor(widget.idBadge, AppState().idConsultor),
    ]);
  }

  void _mostrarSucesso(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensagem, textAlign: TextAlign.center),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _mostrarErro(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          mensagem,
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Widget build (BuildContext context){
    return FutureBuilder<List<dynamic>>(
      future: _pedidos,
      builder: (context, snapshot) {
        // 1. Enquanto carrega
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
          );
        }

        // 2. Erro ou sem dados
        if (snapshot.hasError || !snapshot.hasData) {
          return Scaffold(
            appBar: const PaginaAppBar(titulo: 'Erro', logo: ''),
            body: Center(child: Text("Erro ao carregar os dados")),
          );
        }

        // 3. Dados recebidos com sucesso
        final badge = snapshot.data![0] as BadgesModel;
        final listaRequisitos = snapshot.data![1] as List<RequisitosModel>;
        final estadoBadgeConsultor = snapshot.data![2] as String;
        
        // Normalização do estado para lógica de UI
        final statusLimpo = estadoBadgeConsultor.replaceAll('"', '').toLowerCase().trim();
        final isAprovado = statusLimpo == 'aprovado' || statusLimpo == 'concluido' || statusLimpo == 'concluído' || statusLimpo == 'correto';
        final isEmAnalise = statusLimpo == 'submetido' || statusLimpo == 'em análise';

        // dar reset ao contador para evitar incrementos infinitos no rebuild
        quantidadeRequisitos = 0;
        return Scaffold(
          backgroundColor: Colors.white,
          appBar: PaginaAppBar(
            // AGORA JÁ PODES USAR O snapshot (badge) AQUI!
            titulo: badge.nome,
            logo: 'lib/assets/icons/Icon_Favoritos.svg',
            onLogoTap: () {
              print('Adicionei ${badge.nome} aos favoritos');
            },
          ),
          body: SingleChildScrollView( // Recomendado para evitar overflow
            child: Column(
              children: [
                ConsultorDetalhesBadge(
                  imagem: badge.imagem,
                  descricaoBadge: badge.descricao,
                  nome: badge.nome,
                  nivel: badge.nivel,
                  pontos: badge.pontos,
                  estadoBadge: estadoBadgeConsultor.replaceAll('"', ''), //tira as "" da api
                  isGratuito: badge.pago_S_N,
                ),
                const SizedBox(height: 20),
                // O ... (spread operator) pega na linha de cards e coloca-os "soltos" dentro da column para que fiquem um por baixo do outro alinhados
                ...listaRequisitos.map((requisito){
                  quantidadeRequisitos++;
                  return ConsultorRequisitosBadgeCard(
                      titulo: requisito.nome,
                      imagem: requisito.imagem,
                      descricaoDocumentacao: requisito.descricao,
                      isAprovado: isAprovado,
                      onUpload: (isAprovado || isEmAnalise)
                        ? null
                        : () async{
                        //Abre o seletor de ficheiros
                        FilePickerResult? result = await FilePicker.pickFiles(
                          type: FileType.custom,
                          allowedExtensions: ['pdf'],
                        );
                        if (result != null) {
                        // Obter o ficheiro selecionado
                        File file = File(result.files.single.path!);

                        // Opcional: Validar tamanho (ex: max 5MB)
                        int sizeInBytes = await file.length();
                          if (sizeInBytes > 5 * 1024 * 1024) {
                          ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('O PDF é demasiado grande (Máx: 5MB)')),
                        );
                          return;
                        }
                          //CONVERTER O PDF PARA BASE64
                        List<int> fileBytes = await file.readAsBytes();
                        String base64PDF = base64Encode(fileBytes);
                        print('PDF convertido para Base64 com sucesso!');
                        //ENVIAR O PDF DOCUMENTACAO
                        _repositorioCandidaturas.submeterDocumentacao(base64PDF, sessaoID);
                        _mostrarSucesso('Documento submetido com sucesso');
                        quantidadePDFSubmetido++;
                        } else {
                          // Utilizador cancelou a selecao
                          print('Seleção cancelada');
                        }
                      },
                  );
               }).toList(),
                const SizedBox(height: 10),

                // Esconder botão se já estiver aprovado ou em análise
                if(!isAprovado && !isEmAnalise)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                    child: SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: () {
                          // Lógica para submeter a candidatura
                          if(quantidadeRequisitos > quantidadePDFSubmetido){
                            _mostrarErro('Falta submeter ${quantidadeRequisitos - quantidadePDFSubmetido} documento(s)');
                            return;
                          }
                          _repositorioCandidaturas.submeterCandidaturaBadge(AppState().idConsultor, badge.id, sessaoID);
                          print('SESSAO ID: $sessaoID');
                          _mostrarSucesso('Candidatura submetida com sucesso');
                          context.push('/homepage', extra: AppState().idConsultor);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF39639C),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                          elevation: 2,
                        ),

                        child: const Text(
                          'SUBMETER CANDIDATURA',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                    ),
                  ),
                const SizedBox(height:20),
              ],
            ),
          ),
        );
      },
    );
  }

}
