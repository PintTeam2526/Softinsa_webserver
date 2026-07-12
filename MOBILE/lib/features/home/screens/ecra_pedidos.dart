import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_estadoPedidoBadgeCard.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import 'package:go_router/go_router.dart';

//PEDIDOS DE DADOS
import 'package:pint_26_mobile/core/models/pedidosEcra_model.dart';
import 'package:pint_26_mobile/core/repositories/pedidosConsultor_repository.dart';
import 'package:pint_26_mobile/core/app_state.dart';

class EcraPedidos extends ConsumerStatefulWidget {
  const EcraPedidos({super.key});

  @override
  ConsumerState<EcraPedidos> createState() => _EcraPedidosState();
}

class _EcraPedidosState extends ConsumerState<EcraPedidos> {
  final TextEditingController _controllerPesquisa = TextEditingController();
  late Future<List<PedidoEcraModel>> _futurePedidos;
  String _filtroEstado = 'todos'; 

  void _carregarDados() {
    final repositorio = ref.read(pedidosConsultorRepositoryProvider);
    setState(() {
      _futurePedidos = repositorio.fetchPedidosConsultor(AppState().idConsultor);
    });
  }

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  @override
  void dispose() {
    _controllerPesquisa.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PaginaAppBar(
        titulo: 'Pedidos',
        logo: 'lib/assets/icons/Icon_Pedidos_Navbar.svg',
        onLogoTap: () => _carregarDados(),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          _carregarDados();
          await _futurePedidos;
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: 'Nome do badge',
              onChanged: (value) => setState(() {}),
            ),
            const SizedBox(height: 5),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
              child: Row(
                children: [
                  ConsultorFiltroChip(
                    texto: 'Todos',
                    icone: 'lib/assets/icons/Icon_Pedidos_Navbar.svg',
                    isSelected: _filtroEstado == 'todos',
                    onTap: () => setState(() => _filtroEstado = 'todos'),
                  ),
                  const SizedBox(width: 9),
                  ConsultorFiltroChip(
                    texto: 'Submetido',
                    icone: 'lib/assets/icons/Icon_EmAnalise.svg',
                    isSelected: _filtroEstado == 'submetido',
                    onTap: () => setState(() => _filtroEstado = 'submetido'),
                  ),
                  const SizedBox(width: 9),
                  ConsultorFiltroChip(
                    texto: 'Aprovado',
                    icone: 'lib/assets/icons/Icon_Aceite.svg',
                    isSelected: _filtroEstado == 'aprovado',
                    onTap: () => setState(() => _filtroEstado = 'aprovado'),
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Rejeitado',
                    icone: 'lib/assets/icons/Icon_Rejeitado.svg',
                    isSelected: _filtroEstado == 'rejeitado',
                    onTap: () => setState(() => _filtroEstado = 'rejeitado'),
                  ),
                ],
              ),
            ),
            
            Expanded(
              child: FutureBuilder<List<PedidoEcraModel>>(
                future: _futurePedidos,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator(color: Color(0xFF39639C)));
                  }
        
                  if (snapshot.hasError) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        Center(child: Text("Erro: ${snapshot.error}")),
                      ],
                    );
                  }
        
                  if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Não existem pedidos.")),
                      ],
                    );
                  }
        
                  final pedidos = snapshot.data!;
        
                  final pedidosFiltrados = pedidos.where((pedido) {
                    final matchesNome = pedido.nomeBadge.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    final matchesEstado = _filtroEstado == 'todos' || pedido.estadoBadge.toLowerCase() == _filtroEstado;
                    return matchesNome && matchesEstado;
                  }).toList();
        
                  if (pedidosFiltrados.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhum badge encontrado.")),
                      ],
                    );
                  }
        
                  return ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(bottom: 80), // AJUSTADO BOTTOM PADDING
                    itemCount: pedidosFiltrados.length,
                    itemBuilder: (context, index) {
                      final pedido = pedidosFiltrados[index];
                      final estado = pedido.estadoBadge.toLowerCase();
        
                      return ConsultorEstadoPedidoBadgeCard(
                        imagem: pedido.imagemBadge,
                        nomeBadge: pedido.nomeBadge,
                        nivelBadge: pedido.nivelBadge,
                        textoBotao: pedido.estadoBadge[0].toUpperCase() + pedido.estadoBadge.substring(1).toLowerCase(),
                        onTap: () {
                          if (estado == 'Aprovado' || estado == 'Concluido' || estado == 'Correto') {
                            context.push('/mostrarBadgesConcluidos', extra: pedido.nomeBadge);
                          } else {
                            context.push('/mostrarCandidaturaBadge', extra: pedido.idBadge);
                          }
                        },
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
