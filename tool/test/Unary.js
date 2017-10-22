
function Unary(operator, right){
    this.operator = operator;
    this.right = right;

    this.accept = function(visitor){
        return visitor.visitUnaryExpr(this);
    }
}

module.exports = Unary;