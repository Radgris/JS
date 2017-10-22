

function Literal(value){
    this.value = value;

    this.accept = function(visitor){
        return visitor.visitLiteralExpr(this);
    }
}


module.exports = Literal;