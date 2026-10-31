const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ProjetoMiddleware {
    validateBody = (request, response, next) => {
        console.log("ProjetoMiddleware.validateBody()");
        const body = request.body;

        if (!body.projeto) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'projeto' é obrigatório."}
            );
        }

        const projeto = body.projeto;

        const camposObrigatorios = ["titulo", "linkGitHub"];

        for (const campo of camposObrigatorios) {
            if (projeto[campo] === undefined ||
                projeto[campo] === null ||
                projeto[campo] === ""
            ) {
                throw new ErrorResponse(
                    400,
                    "Erro na validação de dados.",
                    { message: `O campo '${campo}' é obrigatório.`}
                );
            }
        }

        if (!projeto.usuario || typeof projeto.usuario !== "object") {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'usuario' é obrigatório e deve ser um objeto." }
            );
        }

        if (!Number.isInteger(projeto.usuario.idUsuario) || projeto.usuario.idUsuario <= 0) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'idUsuario' deve ser um número inteiro maior que zero."}
            );
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("ProjetoMiddleware.validateIdParam()");
        const { idProjeto } = request.params;
        const parsedId = Number(idProjeto)

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'idProjeto' deve ser um número inteiro maior que zero."}
            );
        }

        next();
    }
}