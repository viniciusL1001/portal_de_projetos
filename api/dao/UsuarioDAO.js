const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

module.exports = class UsuarioDAO {
    #database;

    constructor(databaseInstance){
        console.log("UsuarioDAO.constructor()")
        this.#database = databaseInstance;
    }

    create = async (objUsuario) => {
        objUsuario.senha = await bcrypt.hash(objUsuario.senha, 12);

        const SQL = "INSERT INTO usuario (nomeUsuario, email, senha) VALUES (?, ?, ?);";

        const params = [
            objUsuario.nomeUsuario,
            objUsuario.email,
            objUsuario.senha
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        if (!resultado.insertId) {
            throw new Error("Falha ao inserir usuario");
        }

        return resultado.insertId;
    };

    update = async (objUsuario) => {
        let SQL;
        let params;

        if (objUsuario.senha) {
            const senhaHash = await bcrypt.hash(objUsuario.senha, 12);
        

            SQL = "UPDATE usuario SET nomeUsuario = ?, email = ?, senha = ? WHERE idUsuario = ?;";

            params = [
                objUsuario.nomeUsuario,
                objUsuario.email,
                senhaHash,
                objUsuario.idUsuario
            ];
        } else {
            SQL = "UPDATE usuario SET nomeUsuario = ?, email = ? WHERE idUsuario = ?;";

            params = [
            objUsuario.nomeUsuario,
            objUsuario.email,
            objUsuario.idUsuario
            ];
        }

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    delete = async (objUsuario) => {
        const pool = await this.#database.getPool();
        const conexao = await pool.getConnection();
        try {
            await conexao.beginTransaction();
            const id = objUsuario.idUsuario;
            // Remove comentarios do usuario e comentarios dos seus projetos.
            await conexao.execute(
                "DELETE FROM Comentario WHERE idUsuario = ? OR idProjeto IN (SELECT idProjeto FROM Projeto WHERE idUsuario = ?)",
                [id, id]
            );
            await conexao.execute("DELETE FROM Projeto WHERE idUsuario = ?", [id]);
            const [resultado] = await conexao.execute("DELETE FROM Usuario WHERE idUsuario = ?", [id]);
            await conexao.commit();
            return resultado.affectedRows > 0;
        } catch (erro) {
            await conexao.rollback();
            throw erro;
        } finally {
            conexao.release();
        }
    };

    findAll = async () => {
        const SQL = "SELECT idUsuario, nomeUsuario FROM usuario;";

        const pool = await this.#database.getPool();
        const [matrizResultado] = await pool.execute(SQL);
        
        return matrizResultado.map(row => ({
            idUsuario: row.idUsuario,
            nomeUsuario: row.nomeUsuario,
        }));
    };

    findById = async(idUsuario) => {
        const SQL = "SELECT idUsuario, nomeUsuario, email FROM usuario WHERE idUsuario = ?;";

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, [idUsuario]);

        return resultado[0];
    };

    findByEmail = async (email) => {
        const SQL = "SELECT idUsuario FROM usuario WHERE email = ?;";

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, [email])

        return resultado.length > 0;
    }

    login = async (objUsuario) => {

        const SQL = "SELECT * FROM usuario WHERE email = ?;";

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, [objUsuario.email]);

        if (resultado.length !== 1) {
            console.log("USUÁRIO NÃO ENCONTRADO");
            return null;
        }

        const usuarioDB = resultado[0];

        const senhaValida = await bcrypt.compare(objUsuario.senha, usuarioDB.senha);
        if (!senhaValida) {
            console.log("SENHA INVÁLIDA");
            return null;
        }

        const usuario = new Usuario();
        usuario.idUsuario = usuarioDB.idUsuario;
        usuario.nomeUsuario = usuarioDB.nomeUsuario;
        usuario.email = usuarioDB.email;

        return usuario;
    };
}