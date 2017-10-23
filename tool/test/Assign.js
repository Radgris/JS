function Assign(name, value){
    this.name = name;
    this.value = value;

    this.accept = function(visitor) {
        return visitor.visitAssignExpr(this);
      }
}

module.exports = Assign;