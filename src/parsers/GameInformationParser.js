var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");
var Actions = require("./ActionsParser")

var ResourceName = "GameInformation"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";




module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .int32('backgroundColor')
                .int32('embedGameWindow')
                .choice('', {
                    tag: VersionCheck.is_greater_than_530,
                    choices: {
                        0: Parser.start()
                            .endianess('little'),

                        1: Parser.start()
                            .endianess('little')
                            .nest('caption',{type:Common.GMString})
                            .int32('left')
                            .int32('top')
                            .int32('width')
                            .int32('height')
                            .int32('showBorder')
                            .int32('allowResize')
                            .int32('stayOnTop')
                            .int32('pauseGame')
                    }
                })
                .nest('gm8',{type:Common.GM8LastChanged})
                .nest('text',{type:Common.GMString})


                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName]= Parser.start()
                 .endianess('little')
                 .int32('version')
                //  each individual resource is deflated (compressed) in gm8
                .choice('', {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .nest(ResourcesName,{ type: module.exports[GMResourceName+"Data"] }),

                        1: Parser.start()
                            .endianess('little')
                            .nest(ResourcesName,{type: Common.NewGMCompressedResource(GMResourceName)})
                    }
                })
// module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);