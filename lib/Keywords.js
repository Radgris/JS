var TokenEnum = require('./TokenType');

var keywords = {
    "and": TokenEnum.AND,
    "class": TokenEnum.CLASS,
    "else": TokenEnum.ELSE,
    "false": TokenEnum.FALSE,
    "for" : TokenEnum.FOR,
    "fun" : TokenEnum.FUN,
    "if" : TokenEnum.FOR,
    "nil" : TokenEnum.NIL,
    "or" : TokenEnum.OR,
    "print" : TokenEnum.PRINT,
    "return" : TokenEnum.RETURN,
    "super" : TokenEnum.SUPER,
    "this" : TokenEnum.THIS,
    "true" : TokenEnum.TRUE,
    "var" : TokenEnum.VAR,
    "while" : TokenEnum.WHILE
    //TODO anwar monkey work

};

module.exports = keywords;