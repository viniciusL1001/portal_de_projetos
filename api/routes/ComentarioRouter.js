module.exports = class ComentarioRouter {
    #router;
    #comentarioController;
    #comentarioMiddleware;
    #jwtMiddleware;

    constructor(router, comentarioMiddleware, comentarioController, jwtMiddleware) {
        this.#router = router;
        this.#comentarioMiddleware = comentarioMiddleware;
        this.#comentarioController = comentarioController;
        this.#jwtMiddleware = jwtMiddleware;
    }

    createRoutes = () => {
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#comentarioMiddleware.validateBody,
            this.#comentarioController.store
        );

        this.#router.put("/:idComentario",
            this.#jwtMiddleware.validateToken,
            this.#comentarioMiddleware.validateIdParam,
            this.#comentarioMiddleware.validateBody,
            this.#comentarioController.update
        );

        this.#router.delete("/:idComentario",
            this.#jwtMiddleware.validateToken,
            this.#comentarioMiddleware.validateIdParam,
            this.#comentarioController.destroy
        );

        this.#router.get("/",
            this.#comentarioController.index
        );

        this.#router.get("/:idComentario",
            this.#comentarioMiddleware.validateIdParam,
            this.#comentarioController.show
        );

        this.#router.get("/projeto/:idProjeto",
            this.#comentarioMiddleware.validateProjetoIdParam,
            this.#comentarioController.showByProjeto
        );

        return this.#router;
    }
}