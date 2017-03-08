var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ResourceName = "Sprite"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;

var GMSubImage = Parser.start()
                .endianess('little')
                .choice('data', {
                    tag: VersionCheck.is_greater_than_equal_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .int32('isvalid')
                            .choice('data', {
                                tag: Common.isValid,
                                choices: {
                                    1: Parser.start()
                                        .endianess('little')
                                        .nest('Image',{type:Common.GMString})
                                },
                                defaultChoice: Common.NullParser
                            }),

                        1: Parser.start()
                            .endianess('little')
                            .int32('subver')
                            .int32('width')
                            .int32('height')
                            .nest('Image',{type:Common.GMString})

                    }
                })

module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('Name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .uint32('version')
                .choice('data', {
                    tag: VersionCheck.is_less_than_800,
                    choices: {
                        0: Common.NullParser,
                        1: Parser.start()
                            .endianess('little')
                            .int32('width')
                            .int32('height')
                            .int32('bbLeft')
                            .int32('bbRight')
                            .int32('bbBottom')
                            .int32('bbTop')
                            .int32('transparent')
                            .int32('smoothEdges')
                            .int32('preload')
                            .int32('bbMode')
                            .int32('precise')
                    }
                })
                .int32('originX')
                .int32('originY')
                .int32('numberOfSubImages')
                .array('Sprites',{ length:'numberOfSubImages', type: GMSubImage})
                .choice('data', {
                    tag: VersionCheck.is_greater_than_equal_800,
                    choices: {
                        0: Common.NullParser,
                        1: Parser.start()
                            .endianess('little')
                            .int32('MaskShape')
                            .int32('AlphaTolerance')
                            .int32('SeperateMask')
                            .int32('SpriteBBMode')
                            .int32('bbLeft')
                            .int32('bbRight')
                            .int32('bbBottom')
                            .int32('bbTop')
                    } })
                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports.GMSprites = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);