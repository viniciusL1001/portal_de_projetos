const MeuTokenJWT = require("../http/MeuTokenJWT");

module.exports = class JwtMiddleware {
    validateToken = (request, response, next) => {
        console.log("JwtMiddleware.validateToken()");
        const authorization = request.headers.authorization;

        const jwt = new MeuTokenJWT();

        const autorizado = jwt.validarToken(authorization);

        if (autorizado === true) {
            const payload = jwt.payload;
            // Usa somente o ID que veio do token verificado.
            // Nunca confia no ID informado pelo navegador para autorizar alterações.
            request.usuarioAutenticado = {
                idUsuario: Number(payload.idUsuario),
                email: payload.email,
                nomeUsuario: payload.name
            };
            next();
        } else {
            const objResposta = {
                status: false,
                msg: "token inválido"
            };

            response.status(401).send(objResposta);
        }
    }
}