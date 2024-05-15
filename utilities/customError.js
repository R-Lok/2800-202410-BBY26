class CustomError extends Error {
    constructor(code, message) {
        super(`[${code}] ${message}`)
        this.code = Number(code)
        this.msg = message
    }
}

module.exports = { CustomError }
