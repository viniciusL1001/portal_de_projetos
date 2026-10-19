const mysql = require("mysql2/promise");
require("dotenv").config();

module.exports = class MysqlDatabase {
    static #pool;

    #host;
    #user;
    #password;
    #database;
    #port;
    #waitForConnection;
    #connectionLimit;
    #queueLimit;

    constructor(config = {}) {
        this.#host = config.host || "127.0.0.1";
        this.#user = config.user || "root";
        this.#password = config.password ?? process.env.DB_PASSWORD ?? "";
        this.#database = config.database || "portal_de_projetos";
        this.#port = config.port || 3306;
        this.#waitForConnection = config.waitForConnection ?? true;
        this.#connectionLimit = config.connectionLimit || 10;
        this.#queueLimit = config.queueLimit || 10;
    }

    async connect() {
        if (!MysqlDatabase.#pool) {
            MysqlDatabase.#pool = mysql.createPool({
                host: this.#host,
                user: this.#user,
                password: this.#password,
                database: this.#database,
                port: this.#port,
                waitForConnection: this.#waitForConnection,
                connectionLimit: this.#connectionLimit,
                queueLimit: this.#queueLimit
            });

            try {
                const connection = await MysqlDatabase.#pool.getConnection();
                console.log("Conectado ao MySQL com sucesso.");
                connection.release();
            } catch (error) {
                console.error("Falha ao conectar ao MySQL: ", error.message);
                process.exit(1);
            }
        }
        return MysqlDatabase.#pool;
    }

    async getPool() {
        return await this.connect();
    }
}