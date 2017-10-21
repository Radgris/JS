//TODO import TokenType

function Scanner(source){
    this.source = source;
    this.tokens = []
    this.start = 0;
    this.current = 0;
    this.line = 1;
    
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
        //TODO is .length attained correctly?
        return this.current >= this.source.length;
    }

    this.scanToken = function(){
        var c = this.advance();

        switch(c) {
            case '(': this.addToken([TokenEnum.LEFT_PAREN]); break;
            case ')': this.addToken([TokenEnum.RIGHT_PAREN]); break;
            case '{': this.addToken([TokenEnum.LEFT_BRACE]); break;
            case '}': this.addToken([TokenEnum.RIGHT_BRACE]); break;
            case ',': this.addToken([TokenEnum.COMMA]); break;
            case '.': this.addToken([TokenEnum.DOT]); break;
            case '-': this.addToken([TokenEnum.MINUS]); break;
            case '+': this.addToken([TokenEnum.PLUS]); break;
            case ';': this.addToken([TokenEnum.SEMICOLON]); break;
            case '*': this.addToken([TokenEnum.STAR]); break;
            case '!': this.addToken(this.match('=') ? BANG_EQUAL : BANG); break;
            case '=': this.addToken(this.match('=') ? EQUAL_EQUAL : EQUAL); break;
            case '<': this.addToken(this.match('=') ? LESS_EQUAL : LESS); break;
            case '>': this.addToken(this.match('=') ? GREATER_EQUAL : GREATER); break;
      
            default: var myProgram = new Up2u();
                    myProgram.error(this.line, "Unexpected character.");
                    break;
        }

    }

    this.addToken = function(args){
        var literal = null;
        var type = args;
        if (args.length == 2){
            literal = args[1];
            type = args[0];
        }

        text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));

    }

    this.advance = function(){
        this.current+=1;
        return this.source[current - 1];
    }

    this.match = function(expected){
        if (this.isAtEnd()){
            return false;
        } 
        if (this.source[this.current] != expected){
            return false;
        }
    
        current+=1;
        return true;
    }
}

module.exports = Scanner;
