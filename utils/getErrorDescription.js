const { ERROR_DESCRIPTION } = require("../constant/ErroreDescription")

function getErrorDescription(errorCode){
    return ERROR_DESCRIPTION[errorCode]

}

module.exports.getErrorDescription = getErrorDescription;