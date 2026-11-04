module.exports = class ImagemController {
    #imagemService;

    constructor(imagemServiceInstance) {
        this.#imagemService = imagemServiceInstance;
    }

    store = async (request, response, next) => {
        try {
            const caminho = await this.#imagemService.salvar(
                request.body, request.headers["content-type"]
            );
            response.status(201).json({
                success: true,
                message: "Imagem enviada com sucesso.",
                data: { imagem: caminho }
            });
        } catch (error) {
            next(error);
        }
    }
}
