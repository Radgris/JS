function Block(statements){
    this.statements = statements;

    this.accept = function(visitor){
        return visitor.visitBlockStmt(this);
    }
}


module.exports = Block;