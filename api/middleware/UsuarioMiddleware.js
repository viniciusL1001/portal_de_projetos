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

    // Alterar e excluir conta exige que o ID da URL seja o mesmo do token.
    validateOwnAccount = (request, response, next) => {
        const idToken = request.usuarioAutenticado?.idUsuario;
        if (!Number.isInteger(idToken) || idToken <= 0) {
            throw new ErrorResponse(401, "Faça login novamente.");
        }
        if (Number(request.params.idUsuario) !== idToken) {
            throw new ErrorResponse(403, "Você só pode alterar sua própria conta.");
        }
        next();
    }

    // Uma nova senha é opcional durante a edição do perfil.
    validateUpdateBody = (request, response, next) => {
        const usuario = request.body?.usuario;
        if (!usuario || typeof usuario !== "object" ||
            typeof usuario.nomeUsuario !== "string" || !usuario.nomeUsuario.trim() ||
            typeof usuario.email !== "string" || !usuario.email.trim()) {
            throw new ErrorResponse(400, "Preencha nome e e-mail para atualizar.");
        }
        if (usuario.senha !== undefined &&
            (typeof usuario.senha !== "string" || !usuario.senha)) {
            throw new ErrorResponse(400, "A nova senha não pode ser vazia.");
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