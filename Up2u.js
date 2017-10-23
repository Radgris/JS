var Scanner = require('./lib/Scanner');
var TokenEnum = require('./lib/TokenType');
var Parser = require('./lib/Parser');
var AstPrinter = require('./lib/AstPrinter');
var Interpreter = require('./lib/Interpreter');


function Up2u(){
    this.hadError = false;
    this.hadRuntimeError  = false;
    this.interpreter = new Interpreter(this);
    
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
        if (this.hadRuntimeError){
            process.exit(70);
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

        let scanner = new Scanner(source, this);
        let tokens = scanner.scanTokens();
    

        var parser = new Parser(tokens, this);
        let statements = parser.parse();


    
        // Stop if there was a syntax error.
        if (this.hadError) return;
    
        this.interpreter.interpret(statements);
    
    }

    this.runtimeError = function(error){
        //throw error;
        console.log(error.message + "\n[line " + error.token.line + "]");
        this.hadRuntimeError = true;
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


