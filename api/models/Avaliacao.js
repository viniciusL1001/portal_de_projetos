const Projeto = require("./Projeto");
const Usuario = require("./Usuario");

module.exports = class Avaliacao{
    #idAvaliacao;
    #projeto;
    #usuario;
    #nota;

    get idAvaliacao(){
        return this.#idAvaliacao;
    }

    set idAvaliacao(value){
        const id = Number(value);
        
        if(!Number.isInteger(id)){
            throw new Error("idAvaliacao deve ser um número inteiro.");
        }

        if(id < 0){
            throw new Error("idAvaliacao não pode ser negativo.");
        }

        this.#idAvaliacao = id;
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

    get nota(){
        return this.#nota;
    }

    set nota(value){
        const nota = Number(value);

        if(!Number.isInteger(nota)){
            throw new Error("nota deve ser um número inteiro.");
        }

        if(nota < 1 || nota > 5){
            throw new Error("nota deve estar entre 1 e 5.");
        }

        this.#nota = nota;
    }
}