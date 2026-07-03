import 'package:flutter/material.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_mostrarDetalhes.dart';
import 'package:go_router/go_router.dart';

//PEDIDOS DADOS
import 'package:pint_26_mobile/core/repositories/areas_repository.dart'; //chamar o repositorio
import 'package:pint_26_mobile/core/models/areas_model.dart'; //chamar o model

class EcraAreasInfo extends StatefulWidget {

  final int idArea;

  const EcraAreasInfo({
    super.key,
    required this.idArea
  });

  @override
  State<EcraAreasInfo> createState() => _EcraLearningPathInfoState();
}

class _EcraLearningPathInfoState extends State<EcraAreasInfo> {
  //instanciar o repositorio dos Learning Path
  final AreasRepository _repositorioAreas = AreasRepository();

  //criar a variavel que guarda o future (pedido)
  late Future<AreasModel> _futureArea;


  //override no initstate para fazer a chamada do repositorio
  @override
  void initState(){
    super.initState(); // Importante chamar o super, executa as configuracoes internas padrao primeiro, boa pratica
    //Usar widget.idLearningPath para aceder ao valor do construtor
    _futureArea = _repositorioAreas.getAreaById(widget.idArea);
  }

  @override
  Widget build (BuildContext context){
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: PaginaAppBar(
          titulo: 'Áreas',
          logo: 'lib/assets/icons/Icon_Areas.svg',
          onLogoTap: (){
            print('Carreguei no icone das areas.');
          },
        ),
        // CORREÇÃO 3: Usar FutureBuilder para esperar pelos dados da API
        body: FutureBuilder<AreasModel>(
          future: _futureArea,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator(
                color: Color(0xFF39639C),
              ));
            }

            if (snapshot.hasError) {
              return Center(child: Text("Erro: ${snapshot.error}"));
            }

            if (!snapshot.hasData) {
              return const Center(child: Text("Não foi possível encontrar este Learning Path."));
            }

            final area = snapshot.data!;

            return MostrarDetalhes(
              titulo: area.nome,
              imagem: area.imagem,
              nomePai: area.nome_service_line_pai,
              textoBotao: 'Ver Badges',
              textoResumo: area.descricao,
              onTapBotao: (){
                //VOU ENVIAR O ID DA AERA E VOU MONTAR A OUTRA PAGINA COM OS BADGES DO ID DA AREA
               context.pop(area.id);

              },
            );
          },
        )
    );
  }
}
