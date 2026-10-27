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

    createService = async (jsonProjeto) => {
        const objUsuario = new Usuario();
        objUsuario.idUsuario = jsonProjeto.usuario.idUsuario;

        const objProjeto = new Projeto();

        const data = new Date();

        objProjeto.usuario = objUsuario;
        objProjeto.titulo = jsonProjeto.titulo;
        objProjeto.descricao = jsonProjeto.descricao;
        objProjeto.dataCricao = data.toLocaleDateString('pt-BR');
        objProjeto.imagem = jsonProjeto.imagem;
        objProjeto.linkGitHub = jsonProjeto.linkGithub;

        objProjeto.idProjeto = await this.#projetoDAO.create(objProjeto);

        return objProjeto;
    }

    updateService = async (idProjeto, requestBody) => {
        const jsonProjeto = requestBody.projeto

        const objUsuario = new Usuario();
        objUsuario.idUsuario = requestBody.usuario.idUsuario;

        const objProjeto = new Projeto();

        objProjeto.idProjeto = idProjeto;
        objProjeto.usuario = objUsuario;
        objProjeto.titulo = jsonProjeto.titulo;
        objProjeto.descricao = jsonProjeto.descricao;
        objProjeto.imagem = jsonProjeto.imagem;
        objProjeto.linkGitHub = jsonProjeto.linkGitHub;

        return await this.#projetoDAO.update(objProjeto);
    }

    deleteService = async (idProjeto) => {
        const objProjeto = new Projeto();
        objProjeto.idProjeto = idProjeto;
        return await this.#projetoDAO.delete(objProjeto);
    }

    findAllService = async () => {
        return this.#projetoDAO.findAll();
    }

    findByIdService = async (idProjeto) => {
        const objProjeto = new Projeto();

        objProjeto.idProjeto = idProjeto;

        const projeto = await this.#projetoDAO.findById(objProjeto.idProjeto);

        if (!projeto) {
            throw new ErrorResponse(
                404,
                "Projeto não encontrado",
                { message: `Não existe projeto com o id ${idProjeto} `}
            );
        }

        return projeto;
    }
}