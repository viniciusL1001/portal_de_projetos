const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ComentarioMiddleware {
    validateBody = (request, response, next) => {
        console.log("ComentarioMiddleware.validateBody()");
        const body = request.body;

        if (!body.comentario) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'comentario' é obrigatório."}
            );
        }

        const comentario = body.comentario;

        if (comentario.texto === undefined ||
            comentario.texto === null ||
            comentario.texto === ""
        ) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: `O campo 'texto' é obrigatório.`}
            );
        }

        if (!comentario.projeto || typeof comentario.projeto !== "object") {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'projeto' é obrigatório e deve ser um objeto." }
            );
        }

        if (!comentario.usuario || typeof comentario.usuario !== "object") {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'usuario' é obrigatório e deve ser um objeto." }
            );
        }

        if (!Number.isInteger(comentario.projeto.idProjeto) || comentario.projeto.idProjeto <= 0) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'idProjeto' deve ser um número inteiro maior que zero."}
            );
        }

        if (!Number.isInteger(comentario.usuario.idUsuario) || comentario.usuario.idUsuario <= 0) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'idUsuario' deve ser um número inteiro maior que zero."}
            );
        }

        next();
    }

    validateIdParam = (request, response, next) => {
        console.log("ComentarioMiddleware.validateIdParam()");
        const { idComentario } = request.params;
        const parsedId = Number(idComentario)

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new ErrorResponse(
                400,
                "Erro na validação de dados.",
                { message: "O campo 'idComentario' deve ser um número inteiro maior que zero."}
            );
        }

        next();
    }

    validateProjetoIdParam = (request, response, next) => {
        console.log("ComentarioMiddleware.validateProjetoIdParam()");
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