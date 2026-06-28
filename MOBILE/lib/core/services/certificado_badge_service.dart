import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import 'package:pint_26_mobile/core/models/certificado_badge_model.dart';

class CertificadoService {
  /// Função principal que recebe o modelo e gera o PDF
  static Future<void> gerarEVisualizar(CertificadoModel dados) async {
    final pdf = pw.Document();

    //Carrega a imagem base (placeholder)
    final ByteData imageBytes = await rootBundle.load('lib/assets/images/certificado_obtencao_badge.png');
    final Uint8List uint8list = imageBytes.buffer.asUint8List();
    final pw.MemoryImage background = pw.MemoryImage(uint8list);

    //Define o estilo de texto
    final baseStyle = pw.TextStyle(
      color: PdfColor.fromInt(0xFF1D4E89), // Cor azul Softinsa
      fontWeight: pw.FontWeight.bold,
    );

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4.portrait,
        margin: pw.EdgeInsets.zero,
        build: (pw.Context context) {
          return pw.Stack(
            alignment: pw.Alignment.center,
            children: [
              // Imagem de fundo que ocupa a página toda
              pw.Image(background, fit: pw.BoxFit.cover),

              // Nome do Consultor
              pw.Positioned(
                top: 310,
                child: pw.Text(
                  dados.nomeConsultor.toUpperCase(),
                  style: baseStyle.copyWith(fontSize: 26),
                ),
              ),

              // Nome do Badge
              pw.Positioned(
                top: 440,
                child: pw.Text(
                  dados.nomeBadge.toUpperCase(),
                  style: baseStyle.copyWith(fontSize: 20),
                ),
              ),

              // Texto do Nível (ex: Junior)
              pw.Positioned(
                top: 530,
                left: 200,
                child: pw.Text(
                    dados.nivel,
                    style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.normal)
                ),
              ),

              // Texto da Área
              pw.Positioned(
                top: 575,
                left: 200,
                child: pw.Text(
                    dados.area,
                    style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.normal)
                ),
              ),

              // Service Line
              pw.Positioned(
                top: 485,
                left: 260,
                child: pw.Text(
                    dados.serviceLine,
                    style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.normal)
                ),
              ),
              // Dia
              pw.Positioned(
                top: 625,
                left: 300, // Ajuste para ficar antes do primeiro "de"
                child: pw.Text(
                    dados.dia,
                    style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.normal)
                ),
              ),

              // Mês
              pw.Positioned(
                top: 625,
                left: 350, // Ajuste para ficar entre os dois "de"
                child: pw.Text(
                    dados.mes,
                    style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.normal)
                ),
              ),

              // Ano
              pw.Positioned(
                top: 625,
                left: 400, // Ajuste para ficar após o segundo "de"
                child: pw.Text(
                    dados.ano,
                    style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.normal)
                ),
              ),
            ],
          );
        },
      ),
    );

    // 3. Mostra a interface de impressão/guardar
    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
      name: 'Certificado_${dados.nomeBadge}.pdf',
    );
  }
}