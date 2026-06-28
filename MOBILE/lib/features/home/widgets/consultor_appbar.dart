import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/core/app_state.dart';

class PaginaAppBar extends StatelessWidget implements PreferredSizeWidget {
  const PaginaAppBar({
    super.key,
    required this.titulo,
    required this.logo,
    this.onLogoTap
  });

  final String titulo;
  final String logo;
  final VoidCallback? onLogoTap;

  @override
  Size get preferredSize => const Size.fromHeight(90);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Fallback: se o logo estiver vazio, usa o ícone de badge por obter por defeito
    final String logoPath = logo.isEmpty ? 'lib/assets/icons/Icon_BadgePorObter.svg' : logo;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(25, 10, 25, 0),
        child: Container(
          height: 75,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: false,
            leadingWidth: 50,
            toolbarHeight: 75,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(25),
            ),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black87, size: 26),
              onPressed: () {
                if(context.canPop()) {
                  context.pop();
                } else {
                  context.pushReplacement('/homepage', extra: AppState().idConsultor);
                }
              },
            ),
            title: Text(
              titulo,
              style: theme.textTheme.titleLarge?.copyWith(
                fontFamily: 'Roboto',
                fontWeight: FontWeight.w500,
                fontSize: 24,
                color: Colors.black87,
              ),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 20),
                child: InkWell(
                  onTap: onLogoTap,
                  child: SvgPicture.asset(
                    logoPath,
                    width: 50,
                    height: 50,
                    colorFilter: const ColorFilter.mode(
                      Color(0xFF39639C),
                      BlendMode.srcIn,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
