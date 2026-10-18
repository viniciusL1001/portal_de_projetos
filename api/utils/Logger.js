const fs = require("fs");
const path = require("path");

module.exports = class Logger {
    static LOG_FILE = "api/system/log.log";

    static logError(errorMessage) {
        this.writeLog("ERROR", errorMessage);
    }

    static log(error) {
        this.writeLog("error", JSON.stringfy(error));
    }

    static writeLog(type, message) {
        const directoryPath = path.dirname(this.LOG_FILE);

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirsync(directoryPath, { recursive: true });
        }

        const dateTime = new Date().toISOString();
        const entry = `[${dateTime}] [${type}] [${message}]\n`;

        try {
            fs.appendFileSync(this.LOG_FILE, entry, { encoding: "utf8" });
            console.log("Erro gravado em log");
        } catch (error) {
            console.error("Falha ao gravar log: ", error);
        }
    }
}