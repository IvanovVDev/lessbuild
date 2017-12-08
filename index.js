var less = require('less');
var fs = require('fs');
var path = require('path');
var log = require('loglevel');

log.setLevel(log.levels.DEBUG);

function buildFile(sourceFile, targetFile, paths) {
    fs.readFile(sourceFile, 'utf8', function (err, inputLess) {
            if (err) throw err;

            less.render(inputLess,
                {
                    paths: paths,  // Specify search paths for @import directives
                    filename: sourceFile // Specify a filename, for better error messages
                },
                function (e, output) {
                    if (e || !output) {
                        log.error("Could not process file", {
                            input: inputLess,
                            output: output,
                            source: sourceFile,
                            error: e
                        });
                    }
                    fs.writeFile(targetFile, (output.css), function (err) {
                            if (err) throw err;
                            log.info("Built less: ", {
                                source: sourceFile,
                                target: targetFile
                            });
                        }
                    );
                }
            );
        }
    );
}

function fromDir(startPath,filter, result){

    if (!fs.existsSync(startPath)){
        log.error("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter,result); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            log.info("Found file: " + filename);
            result.push(filename);
        }
    }
}

function getFilesForSubstring(folder, substring) {
    var result = [];
    fromDir(folder,substring, result);
    return result;
}

exports.build = function(folder, paths) {
    var files = getFilesForSubstring(folder,'.less');
    for (var i = 0; i < files.length; i++) {
        var sourceFile = files[i];
        var targetFile = sourceFile.replace(".less", ".css");
        log.debug("Processing file: ", {
            source: sourceFile,
            target: targetFile
        });
        buildFile(sourceFile, targetFile);
    }
}

