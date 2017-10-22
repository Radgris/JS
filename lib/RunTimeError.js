
function RunTimeError(token, message){
    Error.call(this, message);
    this.token = token;
}

module.exports = RunTimeError;