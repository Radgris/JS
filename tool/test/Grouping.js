

function Grouping(expression){
    this.expression = expression;

    this.accept = function(visitor){
        return visitor.visitGroupingExpr(this);
    }
}


module.exports = Grouping;