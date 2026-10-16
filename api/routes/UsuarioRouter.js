const express = require("express");

module.exports = class UsuarioRouter {
    #router;
    #usuarioController;
    #usuarioMiddleware;
    #jwtMiddleware;

    constructor(jwtMiddleware, usuarioMiddleware, usuarioController) {
        console.log("UsuarioDAO.constructor()");
        this.#router = express.Router();

        this.#jwtMiddleware = jwtMiddleware;
        this.#usuarioMiddleware = usuarioMiddleware;
        this.#usuarioController = usuarioController;
    }

    createRouter = () => {
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#usuarioMiddleware.validateBody,
            this.#usuarioController.store
        );

        this.#router.put("/:idUsuario",
            this.#jwtMiddleware.validateToken,
            this.#usuarioMiddleware.validateIdParam,
            this.#usuarioMiddleware.validateBody,
            this.#usuarioController.update
        );

        this.#router.delete("/:idUsuario",
            this.#jwtMiddleware.validateToken,
            this.#usuarioMiddleware.validateIdParam,
            this.#usuarioController.destroy
        );

        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#usuarioController.index
        );

        this.#router.get("/:idUsuario",
            this.#usuarioMiddleware.validateIdParam,
            this.#usuarioController.show
        );

        this.#router.post("/login",
            this.#usuarioMiddleware.validateLoginBody, 
            this.#usuarioController.login
        );

        return this.#router;
    }
}