module.exports = class ProjetoRouter {
    #router;
    #projetoController;
    #projetoMiddleware;

    constructor(router, projetoMiddleware, projetoController) {
        console.log("ProjetoRouter.constructor()");
        this.#router = router;
        this.#projetoMiddleware = projetoMiddleware;
        this.#projetoController = projetoController;
    }

    createRoutes = () => {
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