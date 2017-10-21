//Aqui vamos a usar las classes de lib/ para leer un programa de scripts/

function Apple (type) {
    this.type = type;
    this.color = "red";
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
}

function main(args){
    if (args.length > 1) {
        console.log("Usage: up2u [script]");
      } else if (args.length == 1) {
        runFile(args[0]);
      } else {
        runPrompt();
      }
}


//TESTED
function runFile(file_name){
    var fs = require('fs');
    var path = process.cwd();
    var buffer = fs.readFileSync(path + "\\scripts\\" + file_name);

    run(buffer.toString());
}


function runPrompt(){
    

        const readline = require('readline');
        
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question('> ', (answer) => {
            console.log(answer);
            rl.close();            
        });

        console.log("done");
        
    
    
}

runPrompt();
