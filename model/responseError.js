class ResponseError {

    constructor(errorCode, erroreDescription) {

        this.errorCode = errorCode;
        this.erroreDescription = erroreDescription;
    }

    getErrorCode() {
        return this.errorCode;
    }

    setErrorCode(errorCode) {
        this.errorCode = errorCode
    }



    getErroreDescription() {
        return this.erroreDescription;
    }

    setErroreDescription(erroreDescription) {
        this.erroreDescription = erroreDescription
    }



}
module.exports.ResponseError = ResponseError;