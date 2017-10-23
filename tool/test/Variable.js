function Variable(name){
    this.name = name;
    

    this.accept = function(visitor){
        return visitor.visitVariableExpr(this);
    }

}

module.exports = Variable;