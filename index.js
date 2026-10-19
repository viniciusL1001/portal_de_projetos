const Server = require("./Server");

/**
 * Arquivo principal de inicialização do servidor.
 * 
 * Responsabilidades:
 * - Cria a instância do servidor
 * - Inicializa todas as dependências (banco, middlewares, rotas)
 * - Inicia o servidor na porta especificada
 * 
 * Observação sobre async/await:
 * - server.init() retorna uma Promise, pois inicializa conexões assíncronas (ex: MySQL)
 * - É necessário usar await para garantir que o servidor só comece a ouvir requisições após a inicialização completa
 */
(async () => {
    try {

        const server = new Server(8000);

        await server.init();

        server.run();

        console.log("✅ Servidor iniciado com sucesso");
    } catch (error) {
        console.error("❌ Erro ao iniciar o servidor:", error);
    }
})();