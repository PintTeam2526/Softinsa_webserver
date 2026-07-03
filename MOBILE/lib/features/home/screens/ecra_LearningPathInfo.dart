import 'package:flutter/material.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_mostrarDetalhes.dart';
import 'package:go_router/go_router.dart';

//PEDIDOS DADOS
import 'package:pint_26_mobile/core/repositories/learningPaths_repository.dart'; //chamar o repositorio
import 'package:pint_26_mobile/core/models/learningPaths_model.dart'; //chamar o model

class EcraLearningPathInfo extends StatefulWidget {
  
  final int idLearningPath;
  
  const EcraLearningPathInfo({
    super.key,
    required this.idLearningPath
  });

  @override
  State<EcraLearningPathInfo> createState() => _EcraLearningPathInfoState();
}

class _EcraLearningPathInfoState extends State<EcraLearningPathInfo> {
    //instanciar o repositorio dos Learning Path
    final LearningPathsRepository _repositorioLearningPaths = LearningPathsRepository();

    //criar a variavel que guarda o future (pedido)
    late Future<LearningPathsModel> _futureLearningPath;


    //override no initstate para fazer a chamada do repositorio
    @override
    void initState(){
      super.initState(); // Importante chamar o super, executa as configuracoes internas padrao primeiro, boa pratica
      // CORREÇÃO 2: Usar widget.idLearningPath para aceder ao valor do construtor
      _futureLearningPath = _repositorioLearningPaths.getLearningPathById(widget.idLearningPath);
    }

    @override
    Widget build (BuildContext context){
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: PaginaAppBar(
            titulo: 'Learning Path',
            logo: 'lib/assets/icons/Icon_LearningPaths.svg',
            onLogoTap: (){
              print('Carreguei no icone dos learning paths.');
            },
        ),
        // CORREÇÃO 3: Usar FutureBuilder para esperar pelos dados da API
        body: FutureBuilder<LearningPathsModel>(
          future: _futureLearningPath,
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

            final learningPath = snapshot.data!;

            return MostrarDetalhes(
              titulo: learningPath.nome,
              imagem: learningPath.imagem,
              dataInsercao: learningPath.data_insercao,
              textoBotao: 'Ver Service Lines',
              textoResumo: learningPath.descricao,
              onTapBotao: (){
                context.pop(learningPath.nome);
              },
            );
          },
        )
      );
    }
}
