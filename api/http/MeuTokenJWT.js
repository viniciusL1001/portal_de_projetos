const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require("dotenv").config();

module.exports = class MeuTokenJWT {
    #key;
    #alg;
    #type;
    #iss;
    #aud;
    #sub;
    #duracaoToken;
    #payload;

    constructor() {
        this.#key = process.env.JWT_SECRET;
        this.#alg = "HS256";
        this.#type = "JWT";
        this.#iss = "http://localhost";
        this.#aud = "http://localhost";
        this.#sub = "acesso_sistema";
        this.#duracaoToken = 3600 * 24 * 60;
        this.#payload = null;
    }

    gerarToken = (claims) => {
        const headers = {
            alg: this.#alg,
            typ: this.#type,
        };

        const payload = {
            iss: this.#iss,
            aud: this.#aud,
            sub: this.#sub,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this.#duracaoToken,
            nbf: Math.floor(Date.now() / 1000),
            jti: crypto.randomBytes(16).toString("hex"),

            email: claims.email,
            name: claims.name,
            idUsuario: claims.idUsuario
        };

        return jwt.sign(payload, this.#key, {
            algorithm: this.#alg,
            header: headers,
        });
    };

    validarToken = (stringToken) => {
        if (!stringToken) {
            console.error("Token não encontrado");
            return false;
        }

        if (stringToken.trim() === "") {
            console.error("Token em branco");
            return false;
        }

        const token = stringToken.replace("Bearer ", "").trim();

        try {
            const decoded = jwt.verify(token, this.#key, {
                algortihms: [this.#alg],
            });
            this.#payload = decoded;
            return true;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error("Token expirado");
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error("Token inválido");
            } else {
                console.error("Erro geral", error);
            }
            return false;
        } 
    };

    get key() { return this.#key }
    set key(value) { this.#key = value; }

    get alg() { return this.#alg; }
    set alg(value) { this.#alg = value; }

    get type() { return this.#type; }
    set type(value) { this.#type = value; }

    get iss() { return this.#iss; }
    set iss(value) { this.#iss = value; }

    get aud() { return this.#aud; }
    set aud(value) { this.#aud = value; }

    get sub() { return this.#sub; }
    set sub(value) { this.#sub = value; }

    get duracaoToken() { return this.#duracaoToken; }
    set duracaoToken(value) { this.#duracaoToken = value; }

    get payload() { return this.#payload; }
    set payload(value) { this.#payload = value; }
}