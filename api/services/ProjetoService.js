const Projeto = require("../models/Projeto");
const Usuario = require("../models/Usuario");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ProjetService {
    #projetoDAO
    #usuarioDAO

    constructor (projetoDAOInstance, usuarioDAOInstance) {
        this.#projetoDAO = projetoDAOInstance;
        this.#usuarioDAO = usuarioDAOInstance;
    }

    createService = async (jsonProjeto, idAutenticado) => {
        if (!Number.isInteger(idAutenticado) || idAutenticado <= 0) {
            throw new ErrorResponse(401, "Faça login novamente.");
        }
        if (Number(jsonProjeto.usuario?.idUsuario) !== idAutenticado) {
            throw new ErrorResponse(403, "Você só pode publicar projetos na sua conta.");
        }
        const objUsuario = new Usuario();
        objUsuario.idUsuario = idAutenticado;

        const objProjeto = new Projeto();

        const data = new Date();

        objProjeto.usuario = objUsuario;
        objProjeto.titulo = jsonProjeto.titulo;
        objProjeto.descricao = jsonProjeto.descricao;
        objProjeto.dataCriacao = new Date();
        objProjeto.imagem = jsonProjeto.imagem;
        objProjeto.linkGitHub = jsonProjeto.linkGitHub;

        const usuarioExiste = await this.#usuarioDAO.findById(objProjeto.usuario.idUsuario);
        if (!usuarioExiste) {
            throw new ErrorResponse(
                400,
                "O usuario informado não existe.",
                { message: `O id ${objProjeto.usuario.idUsuario} informado não é de um usuario existente.` }
            )
        }

        objProjeto.idProjeto = await this.#projetoDAO.create(objProjeto);

        return objProjeto;
    }

    updateService = async (idProjeto, requestBody, idAutenticado) => {
        const existente = await this.#projetoDAO.findById(idProjeto);
        if (!existente) {
            throw new ErrorResponse(404, "Projeto não encontrado.");
        }
        if (Number(existente.idUsuario) !== idAutenticado) {
            throw new ErrorResponse(403, "Somente o autor pode atualizar este projeto.");
        }
        const jsonProjeto = requestBody.projeto

        const objUsuario = new Usuario();
        objUsuario.idUsuario = idAutenticado;

        const objProjeto = new Projeto();

        objProjeto.idProjeto = idProjeto;
        objProjeto.usuario = objUsuario;
        objProjeto.titulo = jsonProjeto.titulo;
        objProjeto.descricao = jsonProjeto.descricao;
        objProjeto.imagem = jsonProjeto.imagem;
        objProjeto.linkGitHub = jsonProjeto.linkGitHub;

        return await this.#projetoDAO.update(objProjeto);
    }

    deleteService = async (idProjeto, idAutenticado) => {
        const existente = await this.#projetoDAO.findById(idProjeto);
        if (!existente) {
            throw new ErrorResponse(404, "Projeto não encontrado.");
        }
        if (Number(existente.idUsuario) !== idAutenticado) {
            throw new ErrorResponse(403, "Somente o autor pode excluir este projeto.");
        }
        const objProjeto = new Projeto();
        objProjeto.idProjeto = idProjeto;
        return await this.#projetoDAO.delete(objProjeto, idAutenticado);
    }

    findAllService = async () => {
        return this.#projetoDAO.findAll();
    }

    findByIdService = async (idProjeto) => {
        const objProjeto = new Projeto();

        objProjeto.idProjeto = idProjeto;

        const projeto = await this.#projetoDAO.findById(objProjeto.idProjeto);

        if (!projeto || projeto.length == 0) {
            throw new ErrorResponse(
                404,
                "Projeto não encontrado",
                { message: `Não existe projeto com o id ${idProjeto} `}
            );
        }

        return projeto;
    }
}