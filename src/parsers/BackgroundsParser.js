var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ResourceName = "Background"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";

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
                //.nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);