var Up2u = require('../Up2u');
var Token = require('./Token');
var TokenEnum = require('./TokenType');
var keywords = require('./Keywords')



function Scanner(source, master){
    this.source = source;
    this.tokens = []
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.master = master

    this.scanTokens = function(){
        while (!this.isAtEnd()) {
            // We are at the beginning of the next lexeme.
            this.start = this.current;
            this.scanToken();
          }
      
          this.tokens.push(new Token(TokenEnum.EOF, "", null, this.line));
          return this.tokens;
    }

    this.isAtEnd = function(){
        return this.current >= this.source.length;
    }

    this.scanToken = function(){
        var c = this.advance();

        switch(c) {
            case '(': this.addToken(TokenEnum.LEFT_PAREN); break;
            case ')': this.addToken(TokenEnum.RIGHT_PAREN); break;
            case '{': this.addToken(TokenEnum.LEFT_BRACE); break;
            case '}': this.addToken(TokenEnum.RIGHT_BRACE); break;
            case ',': this.addToken(TokenEnum.COMMA); break;
            case '.': this.addToken(TokenEnum.DOT); break;
            case '-': this.addToken(TokenEnum.MINUS); break;
            case '+': this.addToken(TokenEnum.PLUS); break;
            case ';': this.addToken(TokenEnum.SEMICOLON); break;
            case '*': this.addToken(TokenEnum.STAR); break;
            case '%': this.addToken(TokenEnum.MODULUS); break;
            case '!': this.addToken(this.match('=') ? TokenEnum.BANG_EQUAL : TokenEnum.BANG); break;
            case '=': this.addToken(this.match('=') ? TokenEnum.EQUAL_EQUAL : TokenEnum.EQUAL); break;
            case '<': this.addToken(this.match('=') ? TokenEnum.LESS_EQUAL : TokenEnum.LESS); break;
            case '>': this.addToken(this.match('=') ? TokenEnum.GREATER_EQUAL : TokenEnum.GREATER); break;
            case '/':
                if (this.match('/')) {
                // A comment goes until the end of the line.
                    while (this.peek() != '\n' && !this.isAtEnd()){
                        this.advance();
                    }
                } else {
                    this.addToken(TokenEnum.SLASH);
                }
            break;
            case ' ':
            case '\r':
            case '\t':
              // Ignore whitespace.
              break;
      
            case '\n': this.line+=1; break;

            case '"': this.string(); break;
      
            default: 
                if (this.isDigit(c)) {
                    this.number();
                    }
                    else if (this.isAlpha(c)){
                    this.identifier();
                    } 
                    else {
                    this.master.error(this.line, "Unexpected character.");
                    }
                
                break;
        }

    }

    this.isAlphaNumeric = function(c){
        return this.isAlpha(c) || this.isDigit(c);
    }

    this.isAlpha = function(c){
        return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
         c == '_';
    }

    this.identifier = function(){

        while (this.isAlphaNumeric(this.peek())){
            this.advance();
        }

        var text = this.source.substring(this.start, this.current);
        type = keywords[text];
        if (type == null){
            type = TokenEnum.IDENTIFIER;
        }
        this.addToken(type);
    }

    this.isDigit = function(c){
        return c >= '0' && c <= '9';
    }

    this.number = function(){
        while (this.isDigit(this.peek())){
            this.advance();
        }
        
            // Look for a fractional part.
            if (this.peek() == '.' && this.isDigit(this.peekNext())) {
              // Consume the "."
              this.advance();
        
              while (this.isDigit(this.peek())){
                this.advance();
              } 
            }
        
            strNum = this.source.substring(this.start, this.current);
            this.addToken(TokenEnum.NUMBER, parseFloat(strNum));
    }

    this.peekNext = function(){
        if (this.current + 1 >= this.source.length){
            return '\0';
        }
        return this.source[this.current + 1];
    }

    this.string = function(){
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n'){
                this.line+=1;
            }
            this.advance();
          }
      
        // Unterminated string.
        if (this.isAtEnd()) {
            this.master.error(this.line, "Unterminated string.");
            return;
        }
    
        // The closing ".
        this.advance();
    
        // Trim the surrounding quotes.
        var value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenEnum.STRING, value);
    }

    this.addToken = function(...args){
        var literal = null;
        var type = args[0];
        if (args.length == 2){
            literal = args[1];
        }

        text = this.source.substring(this.start, this.current);
        if (text == "/"){
        }
        this.tokens.push(new Token(type, text, literal, this.line));


    }

    this.advance = function(){
        this.current+=1;
        return this.source[this.current - 1];
    }

    this.match = function(expected){
        if (this.isAtEnd()){
            return false;
        } 
        if (this.source[this.current] != expected){
            return false;
        }
    
        this.current+=1;
        return true;
    }

    this.peek = function(){
        //TODO verificar que el nul char jale
        if (this.isAtEnd()){
            return '\0';
        }
        return this.source[this.current];
    }


}

module.exports = Scanner;
