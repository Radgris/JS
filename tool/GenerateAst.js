function GenerateAst(){


    this.main = function(){
        var args = process.argv.slice(2);
        if (args.length != 1) {
            console.log("Usage: GenerateAst [output_directory]");
            process.exit(65);
        }
        outputDir = args[0];
        this.defineAst(outputDir, "Expr", [
            "Binary   : Expr left, Token operator, Expr right",
            "Grouping : Expr expression",
            "Literal  : Object value",
            "Unary    : Token operator, Expr right"
        ]);
    }

    this.defineVisitor = function(logStream, baseName,  types) {
        logStream.write("  interface Visitor<R> {\n");
    
        types.forEach(function(type){
            typeName = type.split(":")[0].trim();
            logStream.write("    R visit" + typeName + baseName + "(" + 
            typeName + " " + baseName.toLowerCase() + ");\n");
        })



    
        logStream.write("  }\n");
    }

    this.defineAst = function(outputDir, baseName, types){
        path = outputDir + "/" + baseName + ".js";
        console.log(path);
        var fs = require('fs');
        //TODO 
        var logStream = fs.createWriteStream(path, {'flags': 'w'});
        logStream.write("package com.craftinginterpreters.lox;\n");
        logStream.write("\n");
        logStream.write("import java.util.List;\n");
        logStream.write("\n");
        logStream.write("abstract class " + baseName + " {\n");
        logStream.write("\n");


        this.defineVisitor(logStream, baseName, types);
        

        defType = this.defineType
        types.forEach(function(type) {
            var className = type.split(":")[0].trim();
            var fields = type.split(":")[1].trim(); 
            defType(logStream, baseName, className, fields);
        });


        
        logStream.write("\n");

         // The base accept() method.
         logStream.write("  abstract <R> R accept(Visitor<R> visitor);\n");
          
        logStream.end("}\n");
        
        
    }


    this.defineType = function(logStream, baseName, className, fieldList){
        logStream.write("\n\n");
        logStream.write("  static class " + className + " extends " +
        baseName + " {\n");

        // Constructor.
        logStream.write("    " + className + "(" + fieldList + ") {\n");
    
        // Store parameters in fields.
        var fields = fieldList.split(", ");
        fields.forEach(function(field){
            var name = field.split(" ")[1];
            logStream.write("      this." + name + " = " + name + ";\n");
        })
    
        logStream.write("    }\n\n");

        // Visitor pattern.
        logStream.write("    <R> R accept(Visitor<R> visitor) {\n");
        logStream.write("      return visitor.visit" +
            className + baseName + "(this);\n");
        logStream.write("    }\n");
    
        // Fields.
        logStream.write("\n");
        fields.forEach(function(field){
            logStream.write("    final " + field + ";\n");
        })
    
        logStream.write("  }\n");
    }

}
