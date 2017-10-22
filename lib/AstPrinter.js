var Token = require('./Token');
var TokenEnum = require('./TokenType');
var Unary = require('../tool/test/Unary');
var Grouping = require('../tool/test/Grouping');
var Literal = require('../tool/test/Literal');
var Binary = require('../tool/test/Binary');


function AstPrinter(){
    this.print = function(expr){
        return expr.accept(this);
    }

    this.visitBinaryExpr = function(expr){
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);        
    }

    this.visitGroupingExpr = function(expr){
        return this.parenthesize("group", expr.expression);     
    }

    this.visitLiteralExpr = function(expr){
        if (expr.value == null){
            return "nil";
        }
        return expr.value.toString();       
    }

    this.visitUnaryExpr = function(expr){
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    this.parenthesize = function(name, ...exprs){
        builder = "(";
        builder+=name;
        myThis = this;

        exprs.forEach(function(expr) {
            builder+=" ";
            builder+=expr.accept(myThis)
        });
 
        builder+=")";
    
        return builder;
    }

    this.main = function(){
        expression = new Binary(
            new Unary(
                new Token(TokenEnum.MINUS, "-", null, 1),
                new Literal(123)),
            new Token(TokenEnum.STAR, "*", null, 1),
            new Grouping(
                new Literal(45.67)));

        console.log(this.print(expression));
    
    }

}
module.exports = AstPrinter;
