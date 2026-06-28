import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/core/models/objetivos_model.dart';
import 'package:pint_26_mobile/core/repositories/objetivos_repository.dart';
import 'package:flutter/material.dart';
class EcraDataObjetivo extends StatefulWidget {
  final int idBadgeObjetivo;
  final String nomeBadge;

  const EcraDataObjetivo({
    super.key,
    required this.idBadgeObjetivo,
    required this.nomeBadge,
  });

  @override
  State<EcraDataObjetivo> createState() => _EcraDataObjetivoState();
}

class _EcraDataObjetivoState extends State<EcraDataObjetivo> {
  // Estado inicial da data
  DateTime _dataSelecionada = DateTime.now();
  final ObjetivosRepository _repositorioObjetivos = ObjetivosRepository();


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


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Cor de fundo leve para destacar o cartão branco
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Adicionar Objetivo',
        logo: 'lib/assets/icons/Icon_Objetivos.svg',
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 40),
            const Text(
              'Escolha a data',
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1C1B1F),
              ),
            ),
            const SizedBox(height: 30),

            // --- CARTÃO DO CALENDÁRIO ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 15,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Cabecalho
                    Padding(
                      padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            DateFormat('EEE, d MMM', 'pt_PT').format(_dataSelecionada),
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w400,
                              color: Colors.black,
                            ),
                          ),
                          const Icon(Icons.edit, color: Color(0xFF39639C)),
                        ],
                      ),
                    ),
                    const Divider(height: 1, thickness: 1, color: Color(0xFFCAC4D0)),

                    // Seletor de Data
                    CalendarDatePicker(
                      initialDate: _dataSelecionada,
                      firstDate: DateTime.now(), // Data inicial
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                      onDateChanged: (DateTime novaData) {
                        setState(() {
                          _dataSelecionada = novaData;
                        });
                      },
                    ),

                    // Barra de Ações (Botões)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _dataSelecionada = DateTime.now();
                              });
                            },
                            child: const Text(
                              'Limpar',
                              style: TextStyle(color: Color(0xFF39639C), fontWeight: FontWeight.w600),
                            ),
                          ),
                          Row(
                            children: [
                              TextButton(
                                onPressed: () => context.pushReplacement('/homepage', extra: AppState().idConsultor),
                                child: const Text(
                                  'Cancelar',
                                  style: TextStyle(color: Color(0xFF39639C), fontWeight: FontWeight.w600),
                                ),
                              ),
                              TextButton(
                                onPressed: () async {
                                  //CHAMAR O REPO QUE VAI INSERIR O OBJETIVO
                                  final adicionarObjetivo = await _repositorioObjetivos.adicionarObjetivo(AppState().idConsultor, widget.idBadgeObjetivo, widget.nomeBadge, _dataSelecionada);
                                  print('Finalizar objetivo ${widget.idBadgeObjetivo} para a data $_dataSelecionada');
                                  if(adicionarObjetivo == true){
                                    print('ADICIONEI OBJETIVO');
                                    context.pushReplacement('/homepage', extra: AppState().idConsultor);
                                  }else{
                                    _mostrarErro('Erro ao adicionar objetivo');
                                    context.pushReplacement('/homepage', extra: AppState().idConsultor);
                                  }
                                },
                                child: const Text(
                                  'Finalizar',
                                  style: TextStyle(
                                    color: Color(0xFF39639C),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}