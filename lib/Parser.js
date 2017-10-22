var TokenEnum = require('./TokenType');
var Unary = require('../tool/test/Unary');
var Grouping = require('../tool/test/Grouping');
var Literal = require('../tool/test/Literal');
var Binary = require('../tool/test/Binary');

function Parser(tokens, master){
    this.tokens = tokens;
    this.current = 0;
    this.master = master;

    this.expression = function(){
        return this.equality();
    }

    this.equality = function(){
        let expr = this.comparison();
        let prev = this.previous;
        let comp = this.comparison;
    
        while (this.match(TokenEnum.BANG_EQUAL, TokenEnum.EQUAL_EQUAL)) {
            let operator = prev();
            let right = comp();
    
            expr = new Binary(expr, operator, right);
          }
    
        return expr;
    }

    this.comparison = function(){
        let expr = this.addition();



        while (this.match(TokenEnum.GREATER, TokenEnum.GREATER_EQUAL, TokenEnum.LESS, TokenEnum.LESS_EQUAL)) {
            let operator = this.previous();
            let right = this.addition();

            expr = new Binary(expr, operator, right);
          }
      
          return expr;
    }

    this.addition = function(){
        let expr = this.multiplication();

       
        
            while (this.match(TokenEnum.MINUS, TokenEnum.PLUS)) {
              let operator = this.previous();
              let right = this.multiplication();
              
              expr = new Binary(expr, operator, right);

            }
        
        return expr;
    }

    this.multiplication = function(){
        let expr = this.unary();

            while (this.match(TokenEnum.SLASH, TokenEnum.STAR)) {
              let operator = this.previous();
              let right = this.unary();

              expr = new Binary(expr, operator, right);
            }

            
            return expr;
            
    }

    this.unary = function(){
        if (this.match(TokenEnum.BANG, TokenEnum.MINUS)) {
            let operator = this.previous();
            let right = this.unary();

            return new Unary(operator, right);
          }
      
          return this.primary();
    }

    this.primary = function(){
        if (this.match(TokenEnum.FALSE)){
            return new Literal(false);
        }
        if (this.match(TokenEnum.TRUE)){
            return new Literal(true);
        }
        if (this.match(TokenEnum.NIL)){
            return new Literal(null);
        }
    
        if (this.match(TokenEnum.NUMBER, TokenEnum.STRING)) {
          return new Literal(this.previous().literal);
        }
    
        if (this.match(TokenEnum.LEFT_PAREN)) {
          expr = this.expression();
          this.consume(TokenEnum.RIGHT_PAREN, "Expect ')' after expression.");


          return new Grouping(expr);
        }
        throw this.error(this.peek(), "Expect expression.");
    }

    this.parse = function(){
        var myThis = this;
        try {
            return this.expression();
        }
        catch (err) {
            return null;
        }
    }

    this.match = function(...types){
        //var ch = this.check;
        //var adv = this.advance;
        var master = this;

        for (i = 0; i < types.length; i++) { 
            if (this.check(types[i], master)) {
                this.advance(master);
                return true;
              }
        }

        
        return false;
    }

    this.consume = function(type, message){
        if (this.check(type, this)){
            return this.advance(this);
        }
        throw this.error(this.peek(), message);
    }

    this.error = function(token, message){
        this.master.error(token, message);
        try{
            throw "parsing error";
        }
        catch(err){
            return err;
        }
    }

    this.synchronize = function(){
        this.advance();
        
        while (!this.isAtEnd()) {
            if (this.previous().type == TokenEnum.SEMICOLON){
                return;
            }
    
            switch (this.peek().type) {
            case CLASS:
            case FUN:
            case VAR:
            case FOR:
            case IF:
            case WHILE:
            case PRINT:
            case RETURN:
                return;
            }
    
            this.advance();
        }
    }

    

    this.advance = function(master){
        if (!master.isAtEnd()){
            master.current+=1;
        }
        return master.previous();
    }

    this.isAtEnd = function(){
        var myBool = this.peek().type == TokenEnum.EOF;
        return myBool;
    }

    this.check = function(tokenType, master){
        if (master.isAtEnd()){
            return false;
        }
        return (master.peek().type == tokenType);
    }

    this.peek = function(){
        return this.tokens[this.current];
    }

    this.previous = function(){
        return this.tokens[this.current - 1];
    }

   
}

module.exports = Parser;