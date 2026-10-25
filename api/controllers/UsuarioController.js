const UsuarioService = require("../services/UsuarioService");

module.exports = class UsuarioController {
    #usuarioService;

    constructor(usuarioServiceInstance) {
        this.#usuarioService = usuarioServiceInstance;
    }

    store = async (request, response, next) => {
        try {
            const jsonUsuario = request.body.usuario;
            const resultado = await this.#usuarioService.createService(jsonUsuario);

            response.status(200).json({
                success: true,
                message: "Cadastro realizado com sucesso.",
                data: { usuario: resultado }
            });
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        try {
            const idUsuario = request.params.idUsuario;
            const usuarioAtualizado = await this.#usuarioService.updateService(idUsuario, request.body);

            response.status(200).json({
                success: true,
                message: "Atualizado com sucesso.",
                data: {
                    usuario: {
                        idUsuario: parseInt(request.params.idUsuario),
                        nomeUsuario: request.body.usuario.nomeUsuario
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        try {
            const idUsuario = request.params.idUsuario;
            const excluiu = await this.#usuarioService.deleteService(idUsuario);

            if (!excluiu) {
                return response.status(404).json({
                    success: false,
                    message: "Usuario não encontrado.",
                    error: { message: `não existe usuario com id ${idUsuario}.` }
                });
            }

            response.status(200).json({
                success: true,
                message: "Excluído com sucesso."
            });
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        try {
            const listaUsuarios = await this.#usuarioService.findAllService();

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso.",
                data: { usuarios: listaUsuarios }
            });
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        try {
            const idUsuario = request.params.idUsuario;
            const usuario = await this.#usuarioService.findByIdService(idUsuario);

            response.status(200).json({
                success: true,
                message: "Busca executada com sucesso.",
                data: { usuario: usuario }
            });
        } catch (error) {
            next(error);
        }
    }

    login = async (request, response, next) => {
        try {
            const jsonUsuario = request.body.usuario;
            const resultado = await this.#usuarioService.loginService(jsonUsuario);

            response.status(200).json({
                success: true,
                message: "Login efetuado com sucesso.",
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }
}