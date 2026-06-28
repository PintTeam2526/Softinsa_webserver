import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';

//BUSCAR AS AREAS
import 'package:pint_26_mobile/core/repositories/areas_repository.dart';
import 'package:pint_26_mobile/core/models/areas_model.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class AreaPreferencia extends ConsumerStatefulWidget {
  final TextEditingController controller;
  final Function(int) onAreaSelected; 
  final String? placeholder;
  
  const AreaPreferencia({
    super.key,
    required this.controller,
    required this.onAreaSelected,
    this.placeholder
  });

  @override
  ConsumerState<AreaPreferencia> createState() => _AreaPreferenciaState();
}

class _AreaPreferenciaState extends ConsumerState<AreaPreferencia> {
  
  @override
  void initState() {
    super.initState();
    // Escuta atualizações do sync para invalidar o provider se necessário
    // Embora o main.dart já dispare o sync, se o sync terminar enquanto este widget está aberto, ele atualiza.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(syncServiceProvider).syncStream.listen((tableName) {
        if (tableName == 'areas' && mounted) {
          ref.invalidate(allAreasProvider);
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    // Observa o provider reativo
    final areasAsync = ref.watch(allAreasProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Área de Preferência', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
        const SizedBox(height: 8),
        areasAsync.when(
          loading: () => _buildLoadingField(),
          error: (err, stack) => _buildErrorField(),
          data: (listaAreas) {
            final nomesAreas = listaAreas.map((area) => area.nome).toList();
            
            return Autocomplete<String>(
              optionsBuilder: (TextEditingValue textEditingValue) {
                if (nomesAreas.isEmpty) return const Iterable<String>.empty();
                if (textEditingValue.text.isEmpty) return nomesAreas;
                return nomesAreas.where((String option) => option.toLowerCase().contains(textEditingValue.text.toLowerCase()));
              },
              onSelected: (String selection) {
                widget.controller.text = selection;
                final area = listaAreas.firstWhere((element) => element.nome == selection);
                widget.onAreaSelected(area.id);
              },
              fieldViewBuilder: (context, controller, focusNode, onFieldSubmitted) {
                return TextField(
                  controller: controller,
                  focusNode: focusNode,
                  decoration: InputDecoration(
                    hintText: widget.placeholder ?? 'Selecione a sua área',
                    fillColor: Colors.grey[100],
                    filled: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none),
                    prefixIcon: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: SvgPicture.asset(
                        'lib/assets/icons/Icon_Areas.svg',
                        width: 20,
                        height: 20,
                        colorFilter: const ColorFilter.mode(Color(0xFF39639C), BlendMode.srcIn),
                      ),
                    ),
                    suffixIcon: const Icon(Icons.arrow_drop_down),
                  ),
                );
              },
              optionsViewBuilder: (context, onSelected, options) {
                return Align(
                  alignment: Alignment.topLeft,
                  child: Material(
                    elevation: 4.0,
                    borderRadius: BorderRadius.circular(15),
                    color: Colors.white,
                    child: Container(
                      width: MediaQuery.of(context).size.width - 60,
                      constraints: const BoxConstraints(maxHeight: 180),
                      child: ListView.builder(
                        padding: EdgeInsets.zero,
                        shrinkWrap: true,
                        itemCount: options.length,
                        itemBuilder: (context, index) => ListTile(
                          title: Text(options.elementAt(index)), 
                          onTap: () => onSelected(options.elementAt(index))
                        ),
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ],
    );
  }

  Widget _buildLoadingField() {
    return TextField(
      readOnly: true,
      decoration: InputDecoration(
        hintText: 'A carregar áreas...',
        fillColor: Colors.grey[100],
        filled: true,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none),
        prefixIcon: const Padding(
          padding: EdgeInsets.all(12.0),
          child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
        ),
      ),
    );
  }

  Widget _buildErrorField() {
    return TextField(
      readOnly: true,
      decoration: InputDecoration(
        hintText: 'Erro ao carregar áreas',
        hintStyle: const TextStyle(color: Colors.red),
        fillColor: Colors.red[50],
        filled: true,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none),
        prefixIcon: const Icon(Icons.error_outline, color: Colors.red),
        suffixIcon: IconButton(
          icon: const Icon(Icons.refresh, color: Color(0xFF39639C)),
          onPressed: () => ref.invalidate(allAreasProvider),
        ),
      ),
    );
  }
}
