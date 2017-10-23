var RuntimeError = require('./RunTimeError')

function Environment(master){
    this.values = {
        pi: 3.141592653589793,
        e: 2.718281828459045
    };
    this.master = master;

    this.define = function(name,value) {
        this.values[name] = value;
    }

    this.assign = function(name, value) {
        if ( name.lexeme in this.values) {
          this.values[name.lexeme] = value;
          return;
        }
    
        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
      }

    this.get = function(name){
        if (name.lexeme in this.values) {
            return this.values[name.lexeme];
          }
      
          throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
        
    }
        
}

module.exports = Environment;