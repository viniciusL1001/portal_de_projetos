const MeuTokenJwt = require("../http/MeuTokenJWT");

module.exports = class JwtMiddleware {
    validateToken = (request, response, next) => {
        console.log("JwtMiddleware.validateToken()");
        const authorization = request.headers.authorization;

        const jwt = new MeuTokenJWT();

        const autorizado = jwt.validarToken(authorization);

        if (autorizado === true) {
            const payload = jwt.payload;
            const obj = {
                email: payload.email,
                name: payload.name
            };

            request.headers.authorization = jwt.gerarToken(obj);

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