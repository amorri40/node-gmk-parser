var Parser = require("binary-parser").Parser;
var VersionCheck = require("./VersionChecks");
var CommonFunctions = require("./CommonFunctions");

var GMString = Parser.start()
    .endianess('little')
    .int32('length')
    .string('Value',{length:'length'})
module.exports.GMString=GMString

module.exports.NullParser = Parser.start().endianess('little');

module.exports.isValid = function(all_vars) {
                            return this.isvalid !== -1?1:0
                        }

module.exports.GMDouble = Parser.start()
                .endianess('little')
                .buffer('value',{length:8, formatter: function doubleFormatter(buffer) {
                    var double_value = buffer.readDoubleLE(0);
                    return double_value;
                }} )

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

module.exports.NewGMCompressedResource = function(GMResourceName) {
    //
    // # Deal with GM8 compression
    //
    var uncompress_formatter = eval(`function uncompress_formatter(buffer) {
                            var inflated_buffer = this.zlib.inflateSync(buffer);
                            var parsed_data = this.Parsers.${GMResourceName}.parse(inflated_buffer);
                            return parsed_data
                        } uncompress_formatter`);

    var GMCompressedResource = Parser.start()
                    .endianess('little')
                    .int32('limit')
                    .buffer('inflated_data',{
                        length: 'limit',
                        formatter: uncompress_formatter
                    })
    return GMCompressedResource;
}

var StdoutMessage = function(ResourcesName) {
    //
    // # stdoutmessage - used for debugging
    //  e.g .buffer('stdout', {length: stdoutmessage})
    //
    var stdoutmessage = eval(`function stdoutmessage (all_vars) {
        if (all_vars.GMGameBody)
            console.error("${ResourcesName} Status so far :: ",JSON.stringify(all_vars.GMGameBody.${ResourcesName}), " :: ${ResourcesName} Status so far");
        else
            console.error("${ResourcesName} Status so far :: ",JSON.stringify(all_vars), " :: ${ResourcesName} Status so far");
        return 0;
    }; stdoutmessage;`);
    return stdoutmessage;
}

module.exports.NewStdoutMessage = function(ResourcesName) {
        var STDOutMessage = Parser.start()
                .endianess('little')
                .buffer('stdout', {length: StdoutMessage(ResourcesName)})
        return STDOutMessage;
}

//
//
//
module.exports.NewGMResource = function(ResourceName, ResourcesName, GMResourceName,GMResourceParser) {

    var get_number_of_resources = eval(`function get_number_of_resources(all_vars) {
                                return all_vars.GMGameBody.${ResourcesName}.NumberOf${ResourcesName};
                            } get_number_of_resources`);

    var GMResourceList = Parser.start()
                 .endianess('little')
                 .int32('version')
                 .int32('NumberOf'+ResourcesName)
                //  each individual resource is deflated (compressed) in gm8
                .choice(ResourcesName, {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .array(ResourcesName,{ length:get_number_of_resources, type: GMResourceParser}),

                        1: Parser.start()
                            .endianess('little')
                            .array(ResourcesName,{length:get_number_of_resources, type: module.exports.NewGMCompressedResource(GMResourceName)})
                    }
                })
    return GMResourceList;

}


//
// # The valid checker is part of the GM format where each deleted resource will be 4 bytes of 0 (invalid)
//   and each valid resource will be of the value 1 (4 bytes Integer)
//
module.exports.NewValidCheckerForGMResource = function(GMResourceDataParser){
    var ValidCheckParser = Parser.start()
                .endianess('little')
                .int32('isvalid')
                .choice('data', {
                    tag: CommonFunctions.is_valid_check, // can't seem to change to Common.isValid...'
                    choices: {
                        1: Parser.start()
                            .endianess('little')
                            .nest('data',{type:GMResourceDataParser})
                    },
                    defaultChoice: module.exports.NullParser
                })
    return ValidCheckParser;
}