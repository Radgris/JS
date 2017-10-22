function Print(expression){
    
        this.expression = expression;
        this.accept = function(visitor){
            return visitor.visitPrintStmt(this);
        }
        
    }
    
    module.exports = Print;