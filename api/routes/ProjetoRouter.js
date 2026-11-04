const express = require("express");

module.exports = class ProjetoRouter {
    #router;
    #projetoController;
    #projetoMiddleware;
    #jwtMiddleware;
    #imagemController;

    constructor(router, projetoMiddleware, projetoController, jwtMiddleware, imagemController) {
        console.log("ProjetoRouter.constructor()");
        this.#router = router;
        this.#projetoMiddleware = projetoMiddleware;
        this.#projetoController = projetoController;
        this.#jwtMiddleware = jwtMiddleware;
        this.#imagemController = imagemController;
    }

    createRoutes = () => {
        this.#router.post("/imagem",
            this.#jwtMiddleware.validateToken,
            express.raw({ type: ["image/png", "image/jpeg"], limit: "2mb" }),
            this.#imagemController.store
        );

        this.#router.post("/",
            this.#projetoMiddleware.validateBody,
            this.#projetoController.store
        );

        this.#router.put("/:idProjeto",
            this.#projetoMiddleware.validateIdParam,
            this.#projetoMiddleware.validateBody,
            this.#projetoController.update
        );

        this.#router.delete("/:idProjeto",
            this.#projetoMiddleware.validateIdParam,
            this.#projetoController.destroy
        );

        this.#router.get("/", this.#projetoController.index);

        this.#router.get("/:idProjeto",
            this.#projetoMiddleware.validateIdParam,
            this.#projetoController.show
        );

        return this.#router;
    }
}