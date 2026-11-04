module.exports = class UsuarioRouter {
    #router;
    #usuarioController;
    #usuarioMiddleware;
    #jwtMiddleware;

    constructor(router, jwtMiddleware, usuarioMiddleware, usuarioController) {
        console.log("UsuarioRouter.constructor()");
        this.#router = router;
        this.#jwtMiddleware = jwtMiddleware;
        this.#usuarioMiddleware = usuarioMiddleware;
        this.#usuarioController = usuarioController;
    }

    createRoutes = () => {
        this.#router.post("/",
            this.#usuarioMiddleware.validateBody,
            this.#usuarioController.store
        );

        this.#router.put("/:idUsuario",
            this.#jwtMiddleware.validateToken,
            this.#usuarioMiddleware.validateIdParam,
            this.#usuarioMiddleware.validateOwnAccount,
            this.#usuarioMiddleware.validateUpdateBody,
            this.#usuarioController.update
        );

        this.#router.delete("/:idUsuario",
            this.#jwtMiddleware.validateToken,
            this.#usuarioMiddleware.validateIdParam,
            this.#usuarioMiddleware.validateOwnAccount,
            this.#usuarioController.destroy
        );

        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#usuarioController.index
        );

        this.#router.get("/me",
            this.#jwtMiddleware.validateToken,
            this.#usuarioController.me
        );

        this.#router.get("/:idUsuario",
            this.#jwtMiddleware.validateToken,
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