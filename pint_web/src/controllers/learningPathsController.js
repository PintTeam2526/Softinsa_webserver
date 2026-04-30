import axios from "axios";

const API_URL = "http://localhost:3000/api/learning-paths";

export const getLearningPaths = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter learning paths", error);
    throw error;
  }
};

export const createLearningPath = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar learning path", error);
    throw error;
  }
};

export const updateLearningPath = async (id, payload) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar learning path", error);
    throw error;
  }
};