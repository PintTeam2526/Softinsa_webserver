const API_URL = "http://localhost:3000/api/learningPaths/get";

export const getLearningPaths = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Falha ao obter learning paths: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter learning paths", error);
    throw error;
  }
};

/*export const createLearningPath = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Falha ao criar learning path: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar learning path", error);
    throw error;
  }
};

export const updateLearningPath = async (id, payload) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Falha ao atualizar learning path: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar learning path", error);
    throw error;
  }
};*/
