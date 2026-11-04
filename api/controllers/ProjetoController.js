module.exports = class ProjetoController {
    #projetoService;

    constructor(projetoServiceInstance) {
        this.#projetoService = projetoServiceInstance;
    }

    store = async (request, response, next) => {
        try {
            const jsonProjeto = request.body.projeto;
            const resultado = await this.#projetoService.createService(jsonProjeto, request.usuarioAutenticado.idUsuario);

            response.status(200).json({
                success: true,
                message: "Criado com sucesso",
                data: { projeto: resultado }
            });
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        try {
            const idProjeto = request.params.idProjeto;
            const jsonProjeto = request.body.projeto;

            const projetoAtualizado = await this.#projetoService.updateService(idProjeto, request.body, request.usuarioAutenticado.idUsuario);

            response.status(200).json({
                success: true,
                message: "Atualizado com sucesso",
                data: {
                    projeto: {
                        idProjeto: parseInt(idProjeto),
                        titulo: jsonProjeto.titulo
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        try {
            const idProjeto = request.params.idProjeto;
            const excluiu = await this.#projetoService.deleteService(idProjeto, request.usuarioAutenticado.idUsuario);

            if (!excluiu) {
                return response.status(404).json({
                    success: false,
                    message: "Projeto não encontrado",
                    error: { message: `Não existe projeto com o id ${idProjeto}`}
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
            const listaProjetos = await this.#projetoService.findAllService();

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso",
                data: { message: listaProjetos }
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        try {
            const idProjeto = request.params.idProjeto;
            const projeto = await this.#projetoService.findByIdService(idProjeto);

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso",
                data: { message: projeto }
            });
        } catch (error) {
            next(error);
        }
    }
}