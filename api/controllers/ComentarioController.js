module.exports = class ComentarioController {
    #comentarioService;

    constructor(comentarioServiceInstance) {
        this.#comentarioService = comentarioServiceInstance;
    }

    store = async (request, response, next) => {
        try {
            const jsonComentario = request.body.comentario;
            const resultado = await this.#comentarioService.createService(jsonComentario);

            response.status(200).json({
                success: true,
                message: "Criado com sucesso",
                data: { comentario: resultado }
            });
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        try {
            const idComentario = request.params.idComentario;
            const jsonComentario = request.body.comentario;

            const resultado = await this.#comentarioService.updateService(idComentario, jsonComentario);

            response.status(200).json({
                success: true,
                message: "Comentario atualizado com sucesso",
                data: {
                    idComentario: parseInt(idComentario),
                    usuario: {
                        idUsuario: jsonComentario.usuario.idUsuario,
                        nomeUsuario: jsonComentario.usuario.nomeUsuario
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        try {
            const idComentario = request.params.idComentario;
            
            const excluiu = await this.#comentarioService.deleteService(idComentario);

            if (!excluiu) {
                return response.status(404).json({
                    success: false,
                    message: "comentario não encontrado.",
                    error: { message: `Não existe comentario com o ${idComentario}`}
                });
            }

            response.status(200).json({
                success: true,
                message: "Excluído com sucesso"
            });
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        try {
            const listaComentarios = await this.#comentarioService.findAllService();

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso",
                data: { resultado: listaComentarios }
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        try {
            const idComentario = request.params.idComentario;
            const comentario = await this.#comentarioService.findByIdService(idComentario);

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso",
                data: { comentario: comentario}
            });
        } catch (error) {
            next(error);
        }
    }

    showByProjeto = async (request, response, next) => {
        try {
            const idProjeto = request.params.idProjeto;
            const comentarios = await this.#comentarioService.findByIdProjetoService(idProjeto);

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso.",
                data: { comentarios: comentarios }
            })
        } catch (error) {
            next(error);
        }
    }
}