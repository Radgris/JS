var TokenEnum = require('./TokenType');
var Unary = require('../tool/test/Unary');
var Grouping = require('../tool/test/Grouping');
var Literal = require('../tool/test/Literal');
var Binary = require('../tool/test/Binary');
var Expression = require('../tool/test/Expression');
var Print = require('../tool/test/Print');
var Var = require('../tool/test/Var');
var Variable = require('../tool/test/Variable');
var Assign = require('../tool/test/Assign');

function Parser(tokens, master){
    this.tokens = tokens;
    this.current = 0;
    this.master = master;

    this.expression = function(){
        return this.assignment();
    }

    this.assignment = function(){
        let expr = this.equality();
        
            if (this.match(TokenEnum.EQUAL)) {
              let equals = this.previous();
              let value = this.assignment();
        
              if (expr instanceof Variable) {
                let name = expr.name;
                return new Assign(name, value);
              }
        
              this.error(equals, "Invalid assignment target.");
            }
        
            return expr;
    }

    this.equality = function(){
        let expr = this.comparison();

    
        while (this.match(TokenEnum.BANG_EQUAL, TokenEnum.EQUAL_EQUAL)) {
            let operator = this.previous();
            let right = this.comparison();

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
        let expr = this.power();

            while (this.match(TokenEnum.SLASH, TokenEnum.STAR, TokenEnum.MODULUS)) {
              let operator = this.previous();
              let right = this.power();

              expr = new Binary(expr, operator, right);
            }

            
            return expr;
            
    }

    this.power = function(){
        let expr = this.unary();

            while (this.match(TokenEnum.POWER)) {
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

        if (this.match(TokenEnum.IDENTIFIER)) {
            return new Variable(this.previous());
          }
    
        if (this.match(TokenEnum.LEFT_PAREN)) {
          expr = this.expression();
          this.consume(TokenEnum.RIGHT_PAREN, "Expect ')' after expression.");


          return new Grouping(expr);
        }
        throw this.error(this.peek(), "Expect expression.");
    }

    this.parse = function(){

        let statements = [];
        while (!this.isAtEnd()) {
          statements.push(this.declaration());
        }
    
        return statements;

    }

    this.declaration = function(){
        try {
            if (this.match(TokenEnum.VAR)){
                return this.varDeclaration();
            }
      
            return this.statement();
          } catch (error) {
            this.synchronize();
            return null;
          }
    }

    this.varDeclaration = function(){
        let name = this.consume(TokenEnum.IDENTIFIER, "Expect variable name.");
        
            let initializer = null;
            if (this.match(TokenEnum.EQUAL)) {
              initializer = this.expression();
            }
        
            this.consume(TokenEnum.SEMICOLON, "Expect ';' after variable declaration.");
            return new Var(name, initializer);
    }

    this.ifStatement = function(){
        this.consume(TokenEnum.LEFT_PAREN, "Expect '(' after 'if'.");
        let condition = this.expression();
        this.consume(TokenEnum.RIGHT_PAREN, "Expect ')' after if condition."); 
    
        let thenBranch = this.statement();
        let elseBranch = null;
        if (this.match(TokenEnum.ELSE)) {
          elseBranch = this.statement();
        }
    
        return new If(condition, thenBranch, elseBranch);
    }

    this.statement = function(){
        if (this.match(TokenEnum.IF)){
            return this.ifStatement();
        }
        if (this.match(TokenEnum.PRINT)){
            return this.printStatement();
        }
        if (this.match(TokenEnum.LEFT_BRACE)){
            return new Block(this.block());
        }
        
        return this.expressionStatement();
    }

    this.block = function(){
        let statements = [];
        
        while (!this.check(TokenEnum.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
    
        this.consume(TokenEnum.RIGHT_BRACE, "Expect '}' after block.");
        return statements;

    }

    

    this.printStatement = function() {
        let value = this.expression();
        this.consume(TokenEnum.SEMICOLON, "Expect ';' after value.");
        return new Print(value);
      }

    this.expressionStatement = function(){
        let expr = this.expression();
        this.consume(TokenEnum.SEMICOLON, "Expect ';' after expression.");
        return new Expression(expr);
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
        this.advance(this);
        
        while (!this.isAtEnd()) {
            if (this.previous().type == TokenEnum.SEMICOLON){
                return;
            }
    
            switch (this.peek().type) {
            case TokenEnum.CLASS:
            case TokenEnum.FUN:
            case TokenEnum.VAR:
            case TokenEnum.FOR:
            case TokenEnum.IF:
            case TokenEnum.WHILE:
            case TokenEnum.PRINT:
            case TokenEnum.RETURN:
                return;
            }
    
            this.advance(this);
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