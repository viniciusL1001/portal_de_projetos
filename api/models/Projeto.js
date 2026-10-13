const Usuario = require("./Usuario");

module.exports = class Projeto{
    #idProjeto;
    #usuario;
    #titulo;
    #descricao;
    #dataCriacao;
    #imagem;
    #linkGitHub;

    get idProjeto(){
        return this.#idProjeto;
    }

    set idProjeto(value){
        if (
            value === null || 
            value === undefined || 
            typeof value === "boolean" || 
            (typeof value === "string" && value.trim() === "")) {
                throw new Error("idProjeto deve ser um valor inteiro.");
        }

        const id = Number(value);

        if(!Number.isInteger(id)){
            throw new Error("idProjeto deve ser um valor inteiro.");
        }

        if(id <= 0){
            throw new Error("idProjeto não pode ser negativo.");
        }

        this.#idProjeto = id;
    }

    get usuario(){
        return this.#usuario;
    }

    set usuario(value){
        if(!(value instanceof Usuario)){
            throw new Error("usuario deve ser uma instancia valida de Usuario.");
        }

        this.#usuario = value;
    }   

    get titulo(){
        return this.#titulo;
    }

    set titulo(value){
        if (typeof value !== "string") {
            throw new Error("titulo deve ser uma string.");
        }

        const titulo = value.trim();

        if (titulo === "") {
            throw new Error("titulo não pode ser vazio.");
        }

        if (titulo.length > 100) {
            throw new Error("titulo não pode ter mais de 100 caracteres");
        }

        this.#titulo = titulo;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(value){
        if(value !== null){
            if(typeof value !== "string"){
                throw new Error("descricao deve ser uma string.");
            }

            this.#descricao = descricao === "" ? null : descricao;
        } else {
            this.#descricao = null;
        }
    }

    get dataCriacao(){
        return this.#dataCriacao;
    }

    set dataCriacao(value){
        if (value === null || value === undefined || typeof value === "boolean") {
            throw new Error("dataCriacao deve ser uma data válida.");
        }

        const data = value instanceof Date ? new Date(value.GetTime()) : new Date(value);

        if(isNaN(data.getTime())){
            throw new Error("dataCriacao deve ser uma data válida.")
        }

        this.#dataCriacao = data;
    }

    get imagem(){
        return this.#imagem;
    }

    set imagem(value){
        if(value !== null){
            if(typeof value !== "string"){
                throw new Error("imagem deve ser uma string.");
            }

            const imagem = value.trim();

            if(imagem === ""){
                throw new Error("imagem não pode ser vazia.");
            }
        
            this.#imagem = imagem;
        } else {
            this.#imagem = null;
        }
    }


    get linkGitHub(){
        return this.#linkGitHub;
    }

    set linkGitHub(value){
        if(value !== null){
            if(typeof value !== "string"){
                throw new Error("linkGitHub deve ser uma string.");
            }

            const link = value.trim();
            
            if(link === ""){
                throw new Error("linkGitHub não pode ser vazio.");
            }

            let url;
            try {
                url = new URL(link);
            } catch {
                throw new Error("linkGitHub deve ser uma URL válida.");
            }

            if (
                url.protocol !== "https:" ||
                !["github.com", "www.github.com"].includes(url.hostname)
            ) {
                throw new Error("linkGitHub deve ser uma URL https do github.com.");
            }

            this.#linkGitHub = link;
        } else {
            this.#linkGitHub = null;
        }
    }
}