module.exports = class Usuario{
    #idUsuario;
    #nomeUsuario;
    #email;
    #senha;

    get idUsuario(){
        return this.#idUsuario;
    }

    set idUsuario(value){
        const id = Number(value);

        if(!Number.isInteger(id)){
            throw new Error("idUsuario deve ser um valor inteiro.");
        }

        if(id < 0){
            throw new Error("idUsuario não pode ser negativo.");
        }
        
        this.#idUsuario = id;
    }

    get nomeUsuario(){
        return this.#nomeUsuario;
    }

    set nomeUsuario(value){
        if(typeof value !== "string"){
            throw new Error("nomeUsuario deve ser uma string.");
        }

        const nome = value.trim();

        if(nome.length < 4){
            throw new Error("nomeUsuario deve ter pelo menos 4 caracteres.");
        }

        this.#nomeUsuario = nome;
    }

    get email(){
        return this.#email;
    }

    set email(value){
        if(typeof value !== "string"){
            throw new Error("email deve ser uma string.");
        }

        const email = value.trim();

        if(email === ""){
            throw new Error("email não pode ser vazio.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("email em formato inválido.");
        }

        this.#email = email;
    }

    get senha(){
        return this.#senha;
    }

    set senha(value){
        if(typeof value !== "string"){
            throw new Error("senha deve ser uma string.");
        }

        const senha = value.trim();

        if(senha.length < 6){
            throw new Error("senha deve ter pelo menos 6 caracteres.");
        }

        if(!/[A-Z]/.test(senha)){
            throw new Error("senha deve conter pelo menos uma letra maiúscula.");
        }

        if(!/[0-9]/.test(senha)){
            throw new Error("senha deve conter pelo menos um número");
        }

        if(!/[!@#$%^&*(),.?":{}|<>]/.test(senha)){
            throw new Error("senha deve conter pelo menos um caractere especial.");
        }

        this.#senha = senha;
    }
}