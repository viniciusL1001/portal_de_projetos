module.exports = class ErrorReponse extends Error {
    #httpCode;
    #error;
    #name;

    constructor(httpCode, message, error = null) {
        super(message);
        this.#httpCode = httpCode;
        this.#error = error;
        this.#name = "ErrorResponse";
    }

    get httpCode() {
        return this.#httpCode;
    }

    get error() {
        return this.#error;
    }

    get name() {
        return this.#name;
    }
}