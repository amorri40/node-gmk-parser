var Parser = require("binary-parser").Parser;

var GMKEncryptionHeader = Parser.start()
    .endianess('little')
    .uint32('s1')
    .uint32('s2')

module.exports.GMKEncryptionHeader = GMKEncryptionHeader;