const ClientError = require("./ClientError");

class AuthencationError extends ClientError {
    constructor(message) {
        super(message, 401)
        this.name = 'AuthenticationError'
    }
}

module.exports = AuthencationError