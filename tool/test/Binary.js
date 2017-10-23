
function Binary(left, operator, right){
    this.left = left;
    this.operator = operator;
    this.right = right;

    this.accept = function(visitor){
        let result = visitor.visitBinaryExpr(this);
        return result;
    }
}

module.exports = Binary;