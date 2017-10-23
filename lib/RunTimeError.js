
function RunTimeError(token, message){
    Error.call(this, message);
    this.token = token;
    this.message = message;
}

module.exports = RunTimeError;