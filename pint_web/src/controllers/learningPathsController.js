const API_URL = "http://localhost:3000/api/learningPaths/get";

export const getLearningPaths = async () => {
  try {
    const token = localStorage.getItem("token");


    const response = await axios.get(API_URL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao obter learning paths", error);
    throw error;
  }
};
