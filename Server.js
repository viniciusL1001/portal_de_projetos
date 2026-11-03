const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ErrorResponse = require("./api/utils/ErrorResponse");
const Logger = require("./api/utils/Logger");

const JwtMiddleware = require("./api/middleware/JwtMiddleware");

const UsuarioRouter = require("./api/routes/UsuarioRouter");
const ProjetoRouter = require("./api/routes/ProjetoRouter");
const ComentarioRouter = require("./api/routes/ComentarioRouter");

const UsuarioMiddleware = require("./api/middleware/UsuarioMiddleware");
const ProjetoMiddleware = require("./api/middleware/ProjetoMiddleware");
const ComentarioMiddleware = require("./api/middleware/ComentarioMiddleware");

const UsuarioController = require("./api/controllers/UsuarioController");
const ProjetoController = require("./api/controllers/ProjetoController");
const ComentarioController = require("./api/controllers/ComentarioController");

const UsuarioService = require("./api/services/UsuarioService");
const ProjetoService = require("./api/services/ProjetoService");
const ComentarioService = require("./api/services/ComentarioService");

const UsuarioDAO = require("./api/dao/UsuarioDAO");
const ProjetoDAO = require("./api/dao/ProjetoDAO");
const ComentarioDAO = require("./api/dao/ComentarioDAO");

const MysqlDatabase = require("./api/database/MysqlDatabase");

module.exports = class Server {
    #porta;
    #app;
    #router;

    #database;

    #jwtMiddleware;

    #usuarioRouter;
    #projetoRouter;
    #comentarioRouter;

    #usuarioMiddleware;
    #projetoMiddleware;
    #comentarioMiddleware;

    #usuarioController;
    #projetoController;
    #comentarioController;

    #usuarioService;
    #projetoService;
    #comentarioService;
    
    #usuarioDAO;
    #projetoDAO;
    #comentarioDAO;

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

        await this.#database.connect();

        this.beforeRouting();
        this.setupUsuario();
        this.setupProjeto();
        this.setupComentario();
        this.setupErrorMiddleware();
    };

    setupUsuario = () => {
        this.#usuarioMiddleware = new UsuarioMiddleware();

        this.#usuarioDAO = new UsuarioDAO(this.#database);

        this.#usuarioService = new UsuarioService(this.#usuarioDAO);

        this.#usuarioController = new UsuarioController(this.#usuarioService);

        this.#usuarioRouter = new UsuarioRouter(
            this.#router,
            this.#jwtMiddleware,
            this.#usuarioMiddleware,
            this.#usuarioController
        );

        this.#app.use("/api/usuarios", this.#usuarioRouter.createRoutes());
    };

    setupProjeto = () => {
        this.#projetoMiddleware = new ProjetoMiddleware();

        this.#projetoDAO = new ProjetoDAO(this.#database);

        this.#projetoService = new ProjetoService(this.#projetoDAO, this.#usuarioDAO);

        this.#projetoController = new ProjetoController(this.#projetoService);

        this.#projetoRouter = new ProjetoRouter(
            this.#router,
            this.#projetoMiddleware,
            this.#projetoController
        );

        this.#app.use("/api/projetos", this.#projetoRouter.createRoutes());
    };

    setupComentario = () => {
        this.#comentarioMiddleware = new ComentarioMiddleware();

        this.#comentarioDAO = new ComentarioDAO(this.#database);

        this.#comentarioService = new ComentarioService(this.#comentarioDAO, this.#usuarioDAO, this.#projetoDAO);

        this.#comentarioController = new ComentarioController(this.#comentarioService);

        this.#comentarioRouter = new ComentarioRouter(
            this.#router,
            this.#comentarioMiddleware,
            this.#comentarioController
        );

        this.#app.use("/api/comentarios", this.#comentarioRouter.createRoutes());
    }

    beforeRouting = () => {
        this.#app.use((req, res, next) => {
            console.log("------------------------------------------------------------------");
            next();
        });
    };

    setupErrorMiddleware = () => {
        this.#app.use((error, request, response, next) => {
            if (error instanceof ErrorResponse) {
                return response.status(error.httpCode).json({
                    success: false,
                    message: error.message,
                    error: error.error
                });
            }

            const resposta = {
                success: false,
                message: "Ocorreu um erro interno no servidor",
                data: { stack: error.stack },
                error: { message: error.message || "Erro interno", code: error.code }
            };
            console.error("ERRO CAPTURADO: ", resposta);
            Logger.log(resposta);
            response.status(500).json(resposta);
        });
    };

    run = () => {
        this.#app.listen(this.#porta, () => {
            console.log(`Server rodando em http://localhost:${this.#porta}/Login.html`);
        });
    };
}