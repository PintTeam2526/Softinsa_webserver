class RgpdModel {
  final String politica;


  RgpdModel({
   required this.politica
});


  factory RgpdModel.fromJson(Map<String, dynamic> json) {
    return RgpdModel(
      politica: json['politica']
    );
  }
}

