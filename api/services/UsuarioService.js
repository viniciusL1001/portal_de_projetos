const UsuarioDAO = require("../dao/UsuarioDAO");
const Usuario = require("../models/Usuario");
const ErrorResponse = require("../utils/ErrorResponse");
const MeuTokenJWT = require("../http/MeuTokenJWT");

module.exports = class UsuarioService {
    #usuarioDAO;

    constructor(usuarioDAOInstance) {
        this.#usuarioDAO = usuarioDAOInstance;
    }

    createService = async (jsonUsuario) => {
        const objUsuario = new Usuario();

        objUsuario.nomeUsuario = jsonUsuario.nomeUsuario;
        objUsuario.email = jsonUsuario.email;
        objUsuario.senha = jsonUsuario.senha;

        const emailExiste = await this.#usuarioDAO.findByEmail(objUsuario.email);

        if (emailExiste) {
            throw new ErrorResponse(
                400,
                "Já existe um Usuario com o email fornecido",
                { message: `O email ${jsonUsuario.email} já está cadastrado`}
            );
        }

        const resultado = this.#usuarioDAO.create(objUsuario);

        return resultado;
    }

    updateService = async (idUsuario, requestBody) => {
        const jsonUsuario = requestBody.usuario;

        const objUsuario = new Usuario();
        
        objUsuario.idUsuario = idUsuario;
        objUsuario.nomeUsuario = jsonUsuario.nomeUsuario;
        objUsuario.email = jsonUsuario.email;
        objUsuario.senha = jsonUsuario.senha;

        return await this.#usuarioDAO.update(objUsuario);
    }

    deleteService = async (idUsuario) => {
        const objUsuario = new Usuario();
        objUsuario.idUsuario = idUsuario;
        return await this.#usuarioDAO.delete(objUsuario);
    }

    findAllService = async () => {
        return this.#usuarioDAO.findAll();
    }

    findByIdService = async (idUsuario) => {
        const objUsuario = new Usuario();

        objUsuario.idUsuario = idUsuario;

        const usuario = await this.#usuarioDAO.findById(objUsuario.idUsuario);

        if (!usuario) {
            throw new ErrorResponse(
                400,
                "Usuario não encontrado",
                { message: `Não um funcionario com id ${idUsuario}`}
            );
        }

        return usuario;
    }

    loginService = async (jsonUsuario) => {
        const objUsuario = new Usuario();
        objUsuario.email = jsonUsuario.email;
        objUsuario.senha = jsonUsuario.senha;

        const encontrado = await this.#usuarioDAO.login(objUsuario);

        if (!encontrado) {
            throw new ErrorResponse(
                401,
                "Usuario ou senha inválidos",
                { message: "Não foi possivel realizar autenticação"}
            );
        }

        const jwt = new MeuTokenJWT();
        const user = {
            usuario: {
                email: encontrado.email,
                name: encontrado.nomeUsuario || null,
                idUsuario: encontrado.idUsuario
            }
        }

        return { user, token: jwt.gerarToken(user.usuario) };
    }
}