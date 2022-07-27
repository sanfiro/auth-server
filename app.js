require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");
const { User } = require("./model/user");
const { Response } = require("./model/response");
const { ResponseError } = require("./model/responseError");
const db = require('./config/connectionToDB');
const { ERROR_TYPE } = require("./constant/ErrorType");
const { getErrorDescription } = require("./utils/getErrorDescription");
const app = express();
app.use(express.json());




// Register
app.post("/register", async (req, res) => {
  const registeredUser = new User();
  var response = new Response();
  var responseError = new ResponseError();


  // Our register logic starts here
  try {
    // Get user input
    const { username, password, mail, role } = req.body;

    // Validate user input
    if (!(username && password && mail && role)) {
      console.log(username, password, mail, role)
      responseError.setErrorCode(ERROR_TYPE.COD_400)
      responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_400))
      response.setErrore(responseError)
      return res.status(400).send(response);
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await (await db.collection('users').where(`username`, '==', username).get()).docs[0]
    if (oldUser) {
      responseError.setErrorCode(ERROR_TYPE.COD_401)
      responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_401))
      response.setErrore(responseError)
      return res.status(409).send(response);
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const newUser = await db.collection("users").add({
      username: username,
      password: encryptedPassword,
      mail: mail,
      role: role
    })

    // Create token
    const token = jwt.sign(
      { user_id: newUser._id, mail, role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    //Create registeredUser
    // save user token
    registeredUser.setUsername(username)
    registeredUser.setPassword(password)
    registeredUser.setMail(mail)
    registeredUser.setToken(token)

    //set payload
    response.setPayload(registeredUser)
    // return new user
    res.status(201).json(response);
  } catch (err) {
    responseError.setErrorCode(ERROR_TYPE.COD_100)
    responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_100))
    response.setErrore(responseError)
    res.status(200).json(response);
  }
  // Our register logic ends here
});

app.post("/login", async (req, res) => {
  var response = new Response();
  var responseError = new ResponseError();
  const loggedUser = new User();


  // Our login logic starts here
  try {
    // Get user input
    const { mail, password, username } = req.body;

    // Validate user input
    if (!((mail || username) && password)) {
      responseError.setErrorCode(ERROR_TYPE.COD_400)
      responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_400))
      response.setErrore(responseError)
      return res.status(400).send(response);
    }
    // Validate if user exist in our database
    var user
    if (mail) { user = await (await db.collection('users').where(`mail`, '==', mail).get()).docs[0].data() }
    if (username) { user = await (await db.collection('users').where(`username`, '==', username).get()).docs[0].data() }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, mail, role: user.role },
        process.env.TOKEN_KEY,
        {
          expiresIn: "30s",
        }
      );
      // save user token
      user.token = token;

      // user
      loggedUser.setUsername(user.username)
      loggedUser.setMail(user.mail)
      loggedUser.setToken(token)
      loggedUser.setRole(user.role)
      response.setPayload(loggedUser)
      res.status(200).json(response);
    }
    else {
      responseError.setErrorCode(ERROR_TYPE.COD_402)
      responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_402))
      response.setErrore(responseError)
      return res.status(400).send(response);
    }
  } catch (err) {
    responseError.setErrorCode(ERROR_TYPE.COD_100)
    responseError.setErroreDescription(getErrorDescription(ERROR_TYPE.COD_100))
    response.setErrore(responseError)
    res.status(200).json(response);
  }
});



app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  jwt.verify(refreshToken, process.env.TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})


function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: '150s' })
}



app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = app;