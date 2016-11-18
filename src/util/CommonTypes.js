var Parser = require("binary-parser").Parser;
var VersionCheck = require("./VersionChecks");

var GMString = Parser.start()
    .endianess('little')
    .int32('length')
    .string('Value',{length:'length'})
module.exports.GMString=GMString

module.exports.NullParser = Parser.start().endianess('little');

module.exports.isValid = function(all_vars) {
                            return this.isvalid !== -1?1:0
                        }


module.exports.GM8LastChanged = Parser.start()
                .endianess('little')
                .choice('lastChanged', {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: module.exports.NullParser,
                        1: Parser.start()
                            .endianess('little')
                            .buffer('LastChanged',{length:8})
                    }
                })