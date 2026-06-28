import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_mostrarDetalhes.dart';
import 'package:go_router/go_router.dart';

//PEDIDOS DE DADOS
import 'package:pint_26_mobile/core/repositories/serviceLines_repository.dart';
import 'package:pint_26_mobile/core/models/serviceLines_model.dart';

class EcraServiceLineInfo extends ConsumerStatefulWidget{
   final int idServiceLine;

   const EcraServiceLineInfo({
      super.key,
      required this.idServiceLine
    });

   @override
   ConsumerState<EcraServiceLineInfo> createState() => _EcraServiceLineInfoState();
}

class _EcraServiceLineInfoState extends ConsumerState<EcraServiceLineInfo>{
  //criar a variavel que guarda o future (pedido)
  late Future<ServiceLinesModel> _futureServiceLine;

  @override
  void initState(){
    super.initState();
    final repositorioServiceLines = ref.read(serviceLinesRepositoryProvider);
    _futureServiceLine = repositorioServiceLines.getServiceLineById(widget.idServiceLine);
  }

  @override
  Widget build (BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PaginaAppBar(
          titulo: 'Service Line',
          logo: 'lib/assets/icons/Icon_ServiceLines.svg',
          onLogoTap: (){
            print('Carreguei no icone dos favoritos');
          }
      ),

      body: FutureBuilder<ServiceLinesModel>(
        future: _futureServiceLine,
        builder: (context,snapshot){

          if(snapshot.connectionState == ConnectionState.waiting){
            return const Center(child: CircularProgressIndicator(
              color: Color(0xFF39639C),
            ));
          }

          if(snapshot.hasError){
            return Center(child: Text("Erro: ${snapshot.error}"));
          }

          if(!snapshot.hasData){
            return const Center(child: Text("Não foi possível encontrar este Service Line."));
          }

          //correu tudo bem tenho os dados
          final serviceLine = snapshot.data!;

          return MostrarDetalhes(
              titulo: serviceLine.nome,
              imagem: serviceLine.imagem,
              dataInsercao: serviceLine.data_insercao,
              textoBotao: 'Ver Áreas',
              textoResumo: serviceLine.descricao,
              onTapBotao: () {
                context.pop(serviceLine.nome);
              },
          );
        },
      )
    );
  }
}
