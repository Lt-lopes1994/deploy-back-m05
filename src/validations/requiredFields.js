const { errors } = require('../scripts/error-messages')

const fieldsToUser = ({ name, email, password }) => {
    if (!name) {
        const response = {
            message: errors.nameX,
            ok: false
        }
        return response;
    }

    if (!email) {
        const response = {
            message: errors.emailX,
            ok: false
        }
        return response;
    }

    if (!password) {
        const response = {
            message: errors.passwordX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

const fieldsToLogin = ({ email, password }) => {
    if (!email) {
        const response = {
            message: errors.emailX,
            ok: false
        }
        return response;
    }

    if (!password) {
        const response = {
            message: errors.passwordX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}


module.exports = {
    fieldsToUser,
    fieldsToLogin
}