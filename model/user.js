class User {

    constructor(username, password, role, mail,token) {

        this.username = username;
        this.password = password;
        this.role = role;
        this.mail = mail;
        this.token = token;

    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password
    }

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role
    }

    getMail() {
        return this.mail;
    }

    setMail(mail) {
        this.mail = mail
    }
    
    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token
    }

}
module.exports.User = User;