const jwt = require("jsonwebtoken");
const { ERROR_TYPE } = require("../constant/ErrorType");
const { Response } = require("../model/response");
const { ResponseError } = require("../model/responseError");
const { getErrorDescription } = require("../utils/getErrorDescription");

const config = process.env;

const verifyToken = (req, res, next) => {
  var response = new Response();
  var responseError = new ResponseError();
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    responseError.setErrorCode(ERROR_TYPE.COD_403)
    responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_403))
    response.setErrore(responseError)
    return res.status(403).send(response);
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;