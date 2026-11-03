const Comentario = require("../models/Comentario");
const Projeto = require("../models/Projeto");
const Usuario = require("../models/Usuario");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ComentarioService {
    #comentarioDAO;
    #projetoDAO;
    #usuarioDAO;
    
    constructor(comentarioDAOInstance, projetoDAOInstance, usuarioDAOInstance) {
        this.#comentarioDAO = comentarioDAOInstance;
        this.#projetoDAO = projetoDAOInstance;
        this.#usuarioDAO = usuarioDAOInstance;
    }

    createService = async (jsonComentario) => {
        const objProjeto = new Projeto();
        objProjeto.idProjeto = jsonComentario.projeto.idProjeto;

        const objUsuario = new Usuario();
        objUsuario.idUsuario = jsonComentario.usuario.idUsuario;

        const objComentario = new Comentario();
        objComentario.projeto = objProjeto;
        objComentario.usuario = objUsuario;
        objComentario.nota = jsonComentario.nota ?? null;
        objComentario.texto = jsonComentario.texto;
        objComentario.dataComentario = new Date();
        
        const projetoExiste = await this.#projetoDAO.findById(objComentario.projeto.idProjeto);
        if (!projetoExiste || projetoExiste.length == 0) {
            throw new ErrorResponse(
                400,
                "O projeto informado não existe.",
                { message: `O id ${objComentario.projeto.idProjeto} não é de um projeto existente.` }
            );
        }

        const usuarioExiste = await this.#usuarioDAO.findById(objComentario.usuario.idUsuario);
        if (!usuarioExiste || usuarioExiste.length == 0) {
            throw new ErrorResponse(
                400,
                "O usuario informado não existe.",
                { message: `O id ${objComentario.usuario.idUsuario} não é de um usuario existente.` }
            );
        }

        return await this.#comentarioDAO.create(objComentario);
    }

    updateService = async (idComentario, requestBody) => {
        const comentarioExistente = await this.#comentarioDAO.findById(idComentario);

        if (!comentarioExistente) {
            throw new ErrorResponse(
                404,
                "Comentario não encontrado.",
                { message: `Não existe comentário com o id ${idComentario}.` }
            );
        }

        const objComentario = new Comentario();

        objComentario.idComentario = idComentario;

        objComentario.nota = requestBody.nota === undefined ? comentarioExistente.nota : requestBody.nota;

        objComentario.texto = requestBody.texto;

        return await this.#comentarioDAO.update(objComentario);
    }

    deleteService = async (idComentario) => {
        const objComentario = new Comentario();
        objComentario.idComentario = idComentario;
        return await this.#comentarioDAO.delete(objComentario);
    }

    findAllService = async () => {
        return await this.#comentarioDAO.findAll();
    }

    findByIdService = async (idComentario) => {
        const objComentario = new Comentario();
        objComentario.idComentario = idComentario;
        const comentario = await this.#comentarioDAO.findById(objComentario.idComentario);

        if (!comentario || comentario.length == 0) {
            throw new ErrorResponse(
                400,
                "O comentario informado não existe.",
                { message: `O id ${objComentario.idComentario} não é de um comentario existente.` }
            );
        }

        return comentario
    }

    findByIdProjetoService = async (idProjeto) => {
        const objProjeto = new Projeto();
        objProjeto.idProjeto = idProjeto;

        const objComentario = new Comentario();
        objComentario.projeto = objProjeto;

        const projetoExiste = await this.#projetoDAO.findById(objComentario.projeto.idProjeto);

        if (!projetoExiste || projetoExiste.length == 0) {
            throw new ErrorResponse(
                400,
                "O projeto informado não existe.",
                { message: `O id ${objComentario.projeto.idProjeto} não é de um projeto existente.` }
            );
        }

        const comentarios = await this.#comentarioDAO.findByIdProjeto(objComentario);

        if (!comentarios || comentarios.length == 0) {
            throw new ErrorResponse(
                400,
                "Sem comentarios no projeto.",
                { message: `O projeto de id ${idProjeto} não possui comentarios ainda.` }
            );
        }

        return comentarios;
    }
}