const Projeto = require("./Projeto");
const Usuario = require("./Usuario");

module.exports = class Comentario{
    #idComentario;
    #projeto;
    #usuario;
    #texto;
    #dataComentario;

    get idComentario(){
        return this.#idComentario;
    }

    set idComentario(value){
        const id = Number(value);
        
        if(!Number.isInteger(id)){
            throw new Error("idComentario deve ser um número inteiro.");
        }

        if(id < 0){
            throw new Error("idComentario não pode ser negativo.");
        }

        this.#idComentario = id;
    }

    get projeto(){
        return this.#projeto;
    }

    set projeto(value){
        if(!(value instanceof Projeto)){
            throw new Error("projeto deve ser uma instância de Projeto.");
        }

        this.#projeto = value;
    }

    get usuario(){
        return this.#usuario;
    }

    set usuario(value){
        if(!(value instanceof Usuario)){
            throw new Error("usuario deve ser uma instância de Usuario.");
        }

        this.#usuario = value;
    }

    get texto(){
        return this.#texto;
    }

    set texto(value){
        if(typeof value !== "string"){
            throw new Error("texto deve ser uma string.");
        }

        const texto = value.trim();

        if(texto === ""){
            throw new Error("texto não pode estar vazio.");
        }

        this.#texto = texto;
    }

    get dataComentario(){
        return this.#dataComentario;
    }

    set dataComentario(value){
        const data = new Date(value);

        if(isNaN(data.getTime())){
            throw new Error("dataComentario deve ser uma data válida.");
        }

        this.#dataComentario = data;
    }
}