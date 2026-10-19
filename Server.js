const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ErrorReponse = require("./api/utils/ErrorResponse");
const Logger = require("./api/utils/Logger");

const JwtMiddleware = require("./api/middleware/JwtMiddleware");

const UsuarioRouter = require("./api/routes/UsuarioRouter");

const UsuarioMiddleware = require("./api/middleware/UsuarioMiddleware");

const UsuarioController = require("./api/controllers/UsuarioController");

const UsuarioService = require("./api/services/UsuarioService");

const UsuarioDAO = require("./api/dao/UsuarioDAO");

const MysqlDatabase = require("./api/database/MysqlDatabase");

module.exports = class Server {
    #porta;
    #app;
    #router;

    #database;

    #jwtMiddleware;

    #usuarioRouter;
    #usuarioMiddleware;
    #usuarioController;
    #usuarioService;
    #usuarioDAO;

    constructor(porta) {
        this.#porta = porta ?? 8000;
    }

    init = async () => {
        this.#app = express();
        this.#router = express.Router();
        this.#app.use(express.json());
        this.#app.use(express.static("static"));

        this.#app.use(cors({ origin: "*" }));

        this.#jwtMiddleware = new JwtMiddleware();

        this.#database = new MysqlDatabase({
            host: "localhost",
            user: "root",
            password: process.env.DB_PASSWORD,
            database: "portal_de_projetos"
        });

        this.#database.connect();

        this.beforeRouting();
        this.setupUsuario();
        this.setupErrorMiddleware();
    }

    setupUsuario = () => {
        this.#usuarioMiddleware = new UsuarioMiddleware();

        this.#usuarioDAO = new UsuarioDAO(this.#database);

        this.#usuarioService = new UsuarioService(this.#usuarioDAO);

        this.#usuarioController = new UsuarioController(this.#usuarioService);

        this.#usuarioRouter = new UsuarioRouter(
            this.#router,
            this.#jwtMiddleware,
            this.usuarioMiddleware,
            this.usuarioController
        );

        this.#app.use("/api/usuarios", this.#usuarioRouter.createRouter());
    }
}