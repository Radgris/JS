var Scanner = require('./lib/Scanner');

function Up2u(){
    this.hadError = false;

    this.main = function (args){
        if (args.length > 1) {
            console.log("Usage: up2u [script]");
        } else if (args.length == 1) {
            this.runFile(args[0]);
        } else {
            this.runPrompt();
        }
    }

    //TESTED
    this.runFile = function (file_name){
        var fs = require('fs');
        var path = process.cwd();
        var buffer = fs.readFileSync(path + "\\scripts\\" + file_name);
    
        this.run(buffer.toString());
    
        if (this.hadError){
            process.exit(65);
        } 
    }

    //TESTED
    this.runPrompt = function (){
        
        while(true){
            const readlineSync = require('readline-sync');
            this.run( readlineSync.question('> '));
            this.hadError = false;
        }
        
    }

    this.run = function (source){
        var scanner = new Scanner(source);
        var tokens = scanner.scanTokens();
    
        // For now, just print the tokens.
        tokens.forEach(function(element) {
            console.log(element)
        });
    
    }

    this.error = function (line, message){
        this.report(line, "", message);
    }

    this.report = function (line, where, message){
        console.log("[line " + line + "] Error" + where + ": " + message)
        this.hadError = true;
    }

}
module.exports = Up2u;


var myProgram = new Up2u();

myProgram.runPrompt();


