class Response {

    constructor(payload={},error={}) {

        this.payload = payload;
        this.error = error;
    }

    getPayload() {
        return this.payload;
    }

    setPayload(payload) {
        this.payload = payload
    }



    getErrore() {
        return this.error;
    }

    setErrore(error) {
        this.error = error
    }



}
module.exports.Response = Response;