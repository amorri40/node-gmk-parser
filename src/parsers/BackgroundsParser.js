var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ResourceName = "Background"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";

//
// # stdoutmessage - used for debugging
//  e.g .buffer('stdout', {length: stdoutmessage})
//
var stdoutmessage = eval(`function stdoutmessage (all_vars) {
    if (all_vars.GMGameBody)
    console.error("${ResourcesName} Status so far :: ",JSON.stringify(all_vars.GMGameBody.${ResourcesName}));
    else
        console.error("${ResourcesName} Status so far :: ",JSON.stringify(all_vars));

    return 0;
}; stdoutmessage;`);

var TileSettingsParser = Parser.start()
                .endianess('little')
                .int32('useAsTileSet')
                .int32('tileWidth')
                .int32('tileHeight')
                .int32('hOffset')
                .int32('vOffset')
                .int32('hSep')
                .int32('vSep')

var BackgroundImage = Parser.start()
                        .endianess('little')
                        .nest('Image',{type:Common.GMString})

module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('Name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .uint32('version')
                // .buffer('stdout', {length: stdoutmessage})
                .choice('data', {
                    tag: VersionCheck.is_less_than_710,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .nest('TileSettings',{type:TileSettingsParser})
                            .int32('version')
                            .int32('width')
                            .int32('height')
                            .choice('data', {
                                tag: function() {
                                    return (this.width !==0 && this.height !==0)?1:0
                                }, choices: {
                                    0:Common.NullParser,
                                    1:BackgroundImage
                                }
                            }),
                        1: Parser.start()
                            .endianess('little')
                            .int32('width')
                            .int32('height')
                            .int32('transparent')
                            .int32('smoothEdges')
                            .int32('preload')
                            .nest('Name',{type:TileSettingsParser})
                            .int32('isvalid')
                            .choice('data', {
                                tag: 'isvalid',
                                choices: {
                                    1: Parser.start()
                                        .endianess('little')
                                        .int32('isvalid')
                                        .choice('data', {tag:'isvalid',
                                        choices: {
                                            10: BackgroundImage
                                        }
                                    })
                                },
                                defaultChoice: Common.NullParser
                            }),
                    }
                })

                // .buffer('stdout', {length: stdoutmessage})

module.exports[GMResourceName] = Parser.start()
                .endianess('little')
                .int32('isvalid')

                .choice('data', {
                    tag: CommonFunctions.is_valid_check, // can't seem to change to Common.isValid...'
                    choices: {
                        1: Parser.start()
                            .endianess('little')
                            .nest('Name',{type:module.exports[GMResourceName+"Data"]})
                    },
                    defaultChoice: Common.NullParser
                })

var get_number_of_resources = eval(`function get_number_of_resources(all_vars) {
                                return all_vars.GMGameBody.${ResourcesName}.NumberOf${ResourcesName};
                            } get_number_of_resources`);

module.exports[GMResourcesName] = Parser.start()
                 .endianess('little')
                 .int32('version')
                 .int32('NumberOf'+ResourcesName)
                //  each individual resource is deflated (compressed) in gm8
                .choice(ResourcesName, {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .array(ResourcesName,{ length:get_number_of_resources, type: module.exports[GMResourceName]}),

                        1: Parser.start()
                            .endianess('little')
                            .array(ResourcesName,{length:get_number_of_resources, type: Common.NewGMCompressedResource(GMResourceName)})
                    }
                })