function If(condition, thenBranch, elseBranch){
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;

    this.accept = function(visitor) {
        return visitor.visitIfStmt(this);
      }
}

module.exports = If;