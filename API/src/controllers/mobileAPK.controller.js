const fs = require("fs");
const path = require("path");

const controllers = {};
const APK_FILE_NAME = "Softinsa-mobile.apk";
const APK_DIRECTORY = path.resolve(__dirname, "../../files/android-apk");
const APK_FILE_PATH = path.join(APK_DIRECTORY, APK_FILE_NAME);

controllers.downloadAPK = async (req, res) => {
    try {
        if (!fs.existsSync(APK_FILE_PATH)) {
            return res.status(404).json({
                error: "APK não encontrado no servidor. Coloque o ficheiro na pasta de entrega do APK.",
            });
        }

        return res.download(APK_FILE_PATH, APK_FILE_NAME, (error) => {
            if (error) {
                console.error("Erro ao enviar o APK:", error);

                if (!res.headersSent) {
                    return res.status(500).json({ error: "Erro ao enviar o APK." });
                }
            }
        });
    } catch (error) {
        console.error("Erro ao preparar o download do APK:", error);
        return res.status(500).json({ error: "Erro interno ao obter o APK." });
    }
};

module.exports = controllers;