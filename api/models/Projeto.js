const Categoria = require("./Categoria");
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
        const id = Number(value);

        if(!Number.isInteger(id)){
            throw new Error("idProjeto deve ser um valor inteiro.");
        }

        if(id < 0){
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
        if(typeof value !== "string"){
            throw new Error("titulo deve ser uma string.");
        }

        const titulo = value.trim();

        if(titulo === ""){
            throw new Error("titulo não pode ser vazio.");
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

            this.#descricao = value;
        } else {
            this.#descricao = null;
        }
    }

    get dataCriacao(){
        return this.#dataCriacao;
    }

    set dataCriacao(value){
        const data = new Date(value);

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

            this.#linkGitHub = link;
        } else {
            this.#linkGitHub = null;
        }
    }
}