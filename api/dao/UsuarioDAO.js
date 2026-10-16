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
        const SQL = "DELETE FROM usuario WHERE idUsuario = ?;";

        const param = [objUsuario.idUsuario];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, param);

        return resultado.affectedRows > 0;
    };

    findAll = async () => {
        const SQL = "SELECT idUsuario, nomeUsuario, email FROM usuario;";

        const pool = await this.#database.getPool();
        const [matrizResultado] = await pool.execute(SQL);
        
        return matrizResultado.map(row => ({
            idUsuario: row.idUsuario,
            nomeUsuario: row.nomeUsuario,
            email: row.email,
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