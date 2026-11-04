const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ImagemService {
    salvar = async (conteudo, tipo) => {
        const formatoInvalido = () => new ErrorResponse(400, "Imagem inválida.", {
            message: "Envie somente um PNG ou JPG válido."
        });
        if (!Buffer.isBuffer(conteudo) || conteudo.length === 0) {
            throw formatoInvalido();
        }
        if (conteudo.length > 2 * 1024 * 1024) {
            throw new ErrorResponse(413, "Imagem muito grande.", {
                message: "O tamanho máximo é 2 MB."
            });
        }
        const png = conteudo.length >= 8 && conteudo.subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        const jpg = conteudo.length >= 3 &&
            conteudo[0] === 255 && conteudo[1] === 216 && conteudo[2] === 255;
        const tipoRecebido = (tipo || "").split(";")[0].trim().toLowerCase();
        let extensao;
        if (png && tipoRecebido === "image/png") extensao = "png";
        else if (jpg && tipoRecebido === "image/jpeg") extensao = "jpg";
        else throw formatoInvalido();
        const pasta = path.join(__dirname, "../../static/uploads");
        await fs.mkdir(pasta, { recursive: true });
        const nome = randomUUID() + "." + extensao;
        await fs.writeFile(path.join(pasta, nome), conteudo, { flag: "wx" });
        return "/uploads/" + nome;
    }
}
