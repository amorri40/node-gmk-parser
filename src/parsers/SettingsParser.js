var Parser = require("binary-parser").Parser;

var GameID = Parser.start()
    .endianess('little')
    .uint32('GameID')

module.exports.GameID = GameID;