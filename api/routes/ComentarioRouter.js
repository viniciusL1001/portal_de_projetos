module.exports = class ComentarioRouter {
    #router;
    #comentarioController;
    #comentarioMiddleware;

    constructor(router, comentarioController, comentarioMiddleware) {
        this.#router = router;
        this.#comentarioController = comentarioController;
        this.#comentarioMiddleware = comentarioMiddleware;
    }

    createRoutes = () => {
        this.#router.post("/",
            this.#comentarioMiddleware.validateBody,
            this.#comentarioController.store
        );

        this.#router.put("/:idComentario",
            this.#comentarioMiddleware.validateIdParam,
            this.#comentarioMiddleware.validateBody,
            this.#comentarioController.update
        );

        this.#router.delete("/:idComentario",
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
            this.#comentarioMiddleware.validateIdProjetoParam,
            this.#comentarioController.show
        );

        return this.#router;
    }
}