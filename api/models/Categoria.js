module.exports = class Categoria{
    #idCategoria;
    #nomeCategoria;

    get idCategoria(){
        return this.#idCategoria;
    }

    set idCategoria(value){
        const id = Number(value);

        if(!Number.isInteger(id)){
            throw new Error("idCategoria deve ser um valor inteiro.");
        }

        if(id < 0){
            throw new Error("idCategoria não pode ser negativo.");
        }

        this.#idCategoria = id;
    }

    get nomeCategoria(){
        return this.#nomeCategoria;
    }
    
    set nomeCategoria(value){
        if(typeof value !== "string"){
            throw new Error("nomeCategoria deve ser uma string.");
        }

        const nome = value.trim();

        if(nome.length < 4){
            throw new Error("nomeCategoria deve ter pelo menos 4 caracteres.");
        }

        this.#nomeCategoria = nome;
    }
}