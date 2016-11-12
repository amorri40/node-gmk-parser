var Parser = require("binary-parser").Parser;

var Skipped4Bytes = Parser.start()
    .endianess('little')
    .uint32('skipped')

module.exports.Skipped4Bytes = Skipped4Bytes;