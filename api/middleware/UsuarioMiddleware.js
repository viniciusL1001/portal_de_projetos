const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class UsuarioMiddleware {
    validateBody = (request, response, next) => {
        console.log("UsuarioMiddleware.validateBody()");
        const body = request.body;

        if (!body.usuario) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'usuario' é obrigatório."}
            );
        }

        const usuario = body.usuario;

        const camposObrigatorios = ["nomeUsuario", "email", "senha"];
        for (const campo of camposObrigatorios) {
            if (usuario[campo] === undefined || 
                usuario[campo] === null || 
                usuario[campo] === "") {
                throw new ErrorResponse(
                    400,
                    "Erro na validação de dados.",
                    { message: `O campo ${campo} é obrigatório.`}
                );
            }
        }
        next();
    }

    validateLoginBody = (request, response, next) => {
        console.log("UsuarioMiddleware.validateLoginBody()");
        const body = request.body;

        if (!body.usuario) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'usuario' é obrigatório."}
            );
        }

        const usuario = body.usuario;

        const camposObrigatorios = ["email", "senha"];
        for (const campo of camposObrigatorios) {
            if (!usuario[campo] || usuario[campo].toString().trim() === "") {
                throw new ErrorResponse(
                    400,
                    "Erro na validação de dados.",
                    { message: `O campo '${campo}' é obrigatório.` }
                );
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuario.email)) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'email' não é um e-mail valido"}
            );
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("UsuarioMiddleware.validateIdParam()");
        const { idUsuario } = request.params;

        if (!idUsuario) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O parâmetro 'idUsuario' é obrigatório." }
            );
        }

        next();
    }
}