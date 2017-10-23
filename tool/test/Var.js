function Var(name, initializer){

    this.name = name;
    this.initializer = initializer;
    
    this.accept = function(visitor){
        return visitor.visitVarStmt(this);
    }


        
    }
    
    module.exports = Var;