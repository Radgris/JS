function Expression(expression){

    this.expression = expression;
    this.accept = function(visitor){
        return visitor.visitExpressionStmt(this);
    }
    
}

module.exports = Expression;