
function Binary(left, operator, right){
    this.left = left;
    this.operator = operator;
    this.right = right;

    this.accept = function(visitor){
        return visitor.visitBinaryExpr(this);
    }
}

module.exports = Binary;