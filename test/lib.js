var fs = require('fs');

exports.expect=function expect(content, targetFilepath) {
    function removeSpaces(string) {
        return string.replace(/(\r\n|\n|\r|\s|\\n)/gm, "");
    }
    removeSpaces(content).should.be.equal(removeSpaces(fs.readFileSync(targetFilepath, 'utf-8')));
}