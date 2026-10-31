const Projeto = require("../models/Projeto");
const Usuario = require("../models/Usuario");

module.exports = class ProjetoDAO {
    #database;

    constructor(databaseInstance) {
        console.log("ProjetoDAO.constructor()")
        this.database = databaseInstance;
    }

    create = async (objProjeto) => {
        const SQL = `INSERT INTO projeto 
            (idUsuario, titulo, descricao, dataCriacao, imagem, linkGitHub) 
            VALUES (?, ?, ?, ?, ?, ?);`;

        const params = [
            objProjeto.usuario.idUsuario,
            objProjeto.titulo,
            objProjeto.descricao,
            objProjeto.dataCriacao,
            objProjeto.imagem,
            objProjeto.linkGitHub
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        if (!resultado.insertId) {
            throw new Error("Falha ao inserir projeto.");
        }

        return resultado.insertId;
    }

    update = async (objProjeto) => {
        const SQL = `UPDATE projeto 
            SET titulo = ?, descricao = ?, imagem = ?, linkGitHub = ?
            WHERE idProjeto = ?;`;
        
        const params = [
            objProjeto.titulo,
            objProjeto.descricao,
            objProjeto.imagem,
            objProjeto.linkGitHub,
            objProjeto.idProjeto
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    }

    delete = async (objProjeto) => {
        const SQL = "DELETE FROM projeto WHERE idProjeto = ?;";
        
        const params = [objProjeto.idProjeto];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    }

    findAll = async () => {
        const SQL = `SELECT projeto.*, usuario.idUsuario, usuario.nomeUsuario 
            FROM projeto
            JOIN usuario ON projeto.idUsuario = usuario.idUsuario;`;
        
        const pool = await this.#database.getPool();
        const [matrizResultado] = await pool.execute(SQL, params);

        return matrizResultado.map(row => ({
            idProjeto: row.idProjeto,
            titulo: row.titulo,
            descricao: row.descricao,
            dataCriacao: row.dataCriacao,
            imagem: row.imagem,
            linkGitHub: row.linkGitHub,
            usuario: {
                idUsuario: row.idUsuario,
                nomeUsuario: row.nomeUsuario
            }
        }));
    }

    findById = async (idProjeto) => {
        const SQL = `SELECT projeto.*, usuario.idUsuario, usuario.nomeUsuario 
            FROM projeto
            JOIN usuario ON projeto.idUsuario = usuario.idUsuario
            WHERE projeto.idProjeto = ?;`;

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, idProjeto);

        return resultado[0];
    }
}