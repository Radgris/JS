var TokenEnum = require('./TokenType');
var RuntimeError = require('./RunTimeError');
var Environment = require('./Environment');

function Interpreter(master){
    this.prompt = false;
    this.environment = new Environment(this);
    this.master = master;
    this.visitLiteralExpr = function(expr){
        return expr.value;
    }

    this.visitGroupingExpr = function(expr){
        return this.evaluate(expr.expression);
    }

    this.evaluate = function(expr){
        return expr.accept(this);
    }

    this.isTruthy = function(object){
        if (object == null){
            return false;
        }
        if (typeof(object) == "boolean"){
            return object;
        }

        return true;
    }

    this.visitBinaryExpr = function(expr){
        let left = this.evaluate(expr.left);
        let right = this.evaluate(expr.right); 
    
        switch (expr.operator.type) {
            case TokenEnum.BANG_EQUAL: return !this.isEqual(left, right);
            case TokenEnum.EQUAL_EQUAL: return this.isEqual(left, right);

            case TokenEnum.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return parseFloat(left) > parseFloat(right);
            case TokenEnum.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);        
                return parseFloat(left) >= parseFloat(right);
            case TokenEnum.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return parseFloat(left) < parseFloat(right);
            case TokenEnum.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);            
                return parseFloat(left) <= parseFloat(right);
            
            case TokenEnum.MINUS:
                this.checkNumberOperands(expr.operator, left, right);
                return parseFloat(left) - parseFloat(right);

            case TokenEnum.PLUS:
                if (typeof(left) == "number" && typeof(right) == "number") {
                    return parseFloat(left) + parseFloat(right);
                } 
                if (typeof(left) == "string" && typeof(right) == "string") {
                    return parseFloat(left) + parseFloat(right);
                } 

                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");

            case TokenEnum.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return parseFloat(left) / parseFloat(right);
            case TokenEnum.POWER:
                this.checkNumberOperands(expr.operator, left, right);
                let counter = 1;
                for (i = 0; i < parseFloat(right); i++) { 
                    counter *= parseFloat(left);
                }
                return counter;
            case TokenEnum.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return parseFloat(left) * parseFloat(right);
            case TokenEnum.MODULUS:
                this.checkNumberOperands(expr.operator, left, right);
                let myVar = Math.floor(parseFloat(left) /  parseFloat(right));
                return parseFloat(left) - (parseFloat(right) * myVar);
        }
    
        // Unreachable.
        return null;
    }

    this.checkNumberOperands = function(operator, left, right){
        if (typeof(left) == "number" && typeof(right) == "number"){
            return;
        }
        
        throw new RuntimeError(operator, "Operands must be numbers.");
    }

    this.checkNumberOperand = function(operator, operand){
        if (typeof(operand) == "number" ){
            return;
        }
        throw new RuntimeError(operator, "Operand must be a number.");
    }

    this.isEqual = function(a, b){
        // nil is only equal to nil.
        if (a === null && b === null) return true;
        if (a === null) return false;

        return a === b;
    }

    this.visitUnaryExpr = function(expr){
        let right = evaluate(expr.right);
        
            switch (expr.operator.type) {
                case TokenEnum.BANG:
                    return !this.isTruthy(right);
                case TokenEnum.MINUS:
                    this.checkNumberOperand(expr.operator, right);
                    return parseFloat(right);
            }
        
            // Unreachable.
            return null;
    }

    this.interpret = function(statements, prompt){
        this.prompt = prompt;


        try {
            for (i = 0; i < statements.length; i++) { 
                this.execute(statements[i])
            }
           
          } catch (error) {
            this.master.runtimeError(error);
          }
    }

    this.execute = function(stmt){
        stmt.accept(this);
    }

    this.visitIfStmt = function(stmt) {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
          this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
          this.execute(stmt.elseBranch);
        }
        return null;
      }

    this.visitExpressionStmt = function(stmt){
        let test = this.evaluate(stmt.expression);
        if (this.prompt){
            console.log(test);
        }
        
        return null; 
    }

    this.visitPrintStmt = function(stmt){
        let value = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        
        return null;
    }

    this.visitVarStmt = function(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.lexeme, value);
        return null;
    }

    this.visitVariableExpr = function(expr) {
        return this.environment.get(expr.name);
    }

    this.visitAssignExpr = function(expr) {
        let value = this.evaluate(expr.value);
    
        this.environment.assign(expr.name, value);
        return value;
    }

    this.visitBlockStmt = function(stmt) {
        this.executeBlock(stmt.statements, new Environment(environment));
        return null;
    }

    this.executeBlock = function(statements, environment){
        let previous = this.environment;
        try {
          this.environment = environment;

            for (i = 0; i < statements.length; i++) { 
                this.execute(statements[i])
            }
    
        } finally {
          this.environment = previous;
        }
    }



    this.stringify = function(object){
        if (object === null){
            return "nil";
        }
        
        // Hack. Work around Java adding ".0" to integer-valued doubles.
        // Our comm: maybe js doesnt do this but it doesnt hurt to have it
        if (typeof(object) == "number") {
            let text = String(object);
            if (text.endsWith(".0")) {
            text = text.substring(0, text.length - 2);
            }
            return text;
        }
    
        return object.toString();

    }
}

module.exports= Interpreter;