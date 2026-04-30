export const mapLearningPath = (item) => ({
  id_learning_path: item.id_learning_path,
  nome_learning_path: item.nome_learning_path || "",
  descricao_learning_path: item.descricao_learning_path || "",
  data_insercao: item.data_insercao || 0,
  estado_a_i: item.estado_a_i || false,
  imagem_learning_path: item.imagem_learning_path || "",
  serviceLines:item.serviceLines || 0,
  areas:item.areas || 0,
  badges:item.badges || 0,
});
