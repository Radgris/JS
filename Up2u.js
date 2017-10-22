var Scanner = require('./lib/Scanner');
var TokenEnum = require('./lib/TokenType');
var Parser = require('./lib/Parser');
var AstPrinter = require('./lib/AstPrinter');


function Up2u(){
    this.hadError = false;

    this.main = function (){
        var args = process.argv.slice(2);
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
    
        /*
        // For now, just print the tokens.
        tokens.forEach(function(element) {
            console.log(element)
        });
        */

        var parser = new Parser(tokens, this);
        expression = parser.parse();


    
        // Stop if there was a syntax error.
        if (this.hadError) return;
    
        console.log(new AstPrinter().print(expression));
    
    }

    this.error = function (line, message){
        if (Number.isInteger(line)){
            this.report(line, "", message);
        }
        else{
            if (line.type == TokenEnum.EOF) {
                this.report(line.line, " at end", message);
              } else {
                this.report(line.line, " at '" + line.lexeme + "'", message);
              }
        }
        
    }

    this.report = function (line, where, message){
        console.log("[line " + line + "] Error" + where + ": " + message)
        this.hadError = true;
    }

}


var myProgram = new Up2u();

myProgram.main();


