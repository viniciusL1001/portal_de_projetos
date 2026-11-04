module.exports = class ComentarioDAO {
    #database;

    constructor(databaseInstance) {
        this.#database = databaseInstance;
    }

    create = async (objComentario) => {
        const SQL = `INSERT INTO comentario (idProjeto, idUsuario, nota, texto, dataComentario) 
            VALUES (?, ?, ?, ?, ?);`;
        const params = [
            objComentario.projeto.idProjeto,
            objComentario.usuario.idUsuario,
            objComentario.nota,
            objComentario.texto,
            objComentario.dataComentario
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);
        
        if (!resultado.insertId) {
            throw Error("Falha ao inserir comentario");
        }

        return resultado.insertId;
    }

    update = async (objComentario, idAutenticado) => {
        const SQL = `UPDATE comentario SET nota = ?, texto = ? WHERE idComentario = ? AND idUsuario = ?;`;
        
        const params = [
            objComentario.nota,
            objComentario.texto,
            objComentario.idComentario,
            idAutenticado
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    }

    delete = async (objComentario, idAutenticado) => {
        const SQL = `DELETE FROM comentario WHERE idComentario = ? AND idUsuario = ?;`;

        const params = [
            objComentario.idComentario,
            idAutenticado
        ];  

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    }

    findAll = async () => {
        const SQL = `
            SELECT 
                usuario.idUsuario, 
                usuario.nomeUsuario, 
                projeto.idProjeto, 
                projeto.titulo, 
                comentario.* 
            FROM comentario 
            JOIN usuario 
            ON comentario.idUsuario = usuario.idUsuario
            JOIN projeto
            ON comentario.idProjeto = projeto.idProjeto`;
        
        const pool = await this.#database.getPool();
        const [matrizResultado] = await pool.execute(SQL);
        
        return matrizResultado.map(row => ({
            usuario: {
                idUsuario: row.idUsuario,
                nomeUsuario: row.nomeUsuario
            },
            projeto: {
                idProjeto: row.idProjeto,
                titulo: row.titulo
            },
            idComentario: row.idComentario,
            nota: row.nota,
            texto: row.texto,
            dataComentario: row.dataComentario
        }));
    }

    findById = async (idComentario) => {
        const SQL = `
            SELECT 
                usuario.idUsuario, 
                usuario.nomeUsuario, 
                projeto.idProjeto, 
                projeto.titulo, 
                comentario.* 
            FROM comentario 
            JOIN usuario 
            ON comentario.idUsuario = usuario.idUsuario
            JOIN projeto
            ON comentario.idProjeto = projeto.idProjeto
            WHERE comentario.idComentario = ?`;

        const params = [
            idComentario
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado[0];
    }

    findByIdProjeto = async (objComentario) => {
        const SQL = `SELECT usuario.nomeUsuario, comentario.* 
            FROM comentario 
            JOIN usuario 
            ON comentario.idUsuario = usuario.idUsuario
            WHERE comentario.idProjeto = ?;`;
        
        const params = [
            objComentario.projeto.idProjeto
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado;
    }
}