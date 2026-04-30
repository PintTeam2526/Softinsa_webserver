export const mapLearningPath = (item) => ({
  id: item.id,
  name: item.name || "",
  description: item.description || "",
  serviceLines: item.serviceLines || 0,
  areas: item.areas || 0,
  badges: item.badges || 0,
  status: item.status || "Inativo",
  iconFileName: item.iconFileName || "",
});