const bcypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const MysqlDataBase = require("../database/MysqlDatabase");

module.exports = class UsuarioDAO {
    #database;

    constructor(databaseInstance){
        console.log(" UsuarioDAO.constructor()")
        this.#database = databaseInstance;
    }

    create = async (objUsuario) => {
        objUsuario.senha = await bcrypt.hash(objUsuario.senha, 12);

        const sql = "INSERT INTO usuario (nomeUsuario, email, senha) VALUES (?, ?, ?);";

        const param = [
            objUsuario.nomeUsuario,
            objUsuario.email,
            objUsuario.senha
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(sql, params);

        if (!resultado.insertId) {
            throw new Error("Falha ao inserir usuario");
        }

        return resultado.insertId;
    };

    update = async (objUsuario) => {
        let sql;
        let params;

        if (objUsuario.senha) {
            const senhaHash = await bcrypt.hash(objUsuario.senha, 12);
        

            sql = "UPDATE usuario SET nomeUsuario = ?, email = ?, senha = ? WHERE idUsuario = ?;";

            params = [
                objUsuario.nomeUsuario,
                objUsuario.email,
                senhaHash
            ];
        } else {
            sql = "UPDATE usuario SET nomeUsuario = ?, email = ? WHERE idUsuario = ?;";

            params = [
            objUsuario.nomeUsuario,
            objUsuario.email,
            ];
        }

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    delete = async (objUsuario) => {
        const sql = "DELETE FROM usuario WHERE idUsuario = ?;";

        param = [
            objUsuario.idUsuario
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(sql, params);

        return resultado.affectedRows > 0;
    };

    findAll = async () => {
        const sql = "SELECT * FROM usuario;";

        const pool = await this.#database.getPool();
        const [matrizResultado] = await pool.execute(sql, params);
        
        return matrizResultado.map(row => ({
            idUsuario: row.idUsuario,
            nomeUsuario: row.nomeUsuario,
            email: row.email,
        }));
    };

    findByField = async(idUsuario) => {
        const sql = "SELECT * FROM usuario WHERE idUsuario = ?;";

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(sql, [idUsuario]);

        return resultado[0];
    };

    login = async (objUsuario) => {

        const sql = "SELECT * FROM usuario WHERE email = ?;";

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(sql, [objUsuario.email]);

        if (resultado.lenght !== 1) {
            console.log("USUÁRIO NÃO ENCONTRADO");
            return null;
        }

        const usuarioDB = resultado[0];

        const senhaValida = await bcrypt.compara(objUsuario.senha, usuarioDB.senha);
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