var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ResourceName = "Sprite"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;


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

var GMSpriteData = Parser.start()
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
                // .buffer('stdout', {length: stdoutmessage})

var GMSprite = Parser.start()
                .endianess('little')
                .int32('isvalid')

                .choice('gmspritedata', {
                    tag: CommonFunctions.is_valid_check, // can't seem to change to Common.isValid...'
                    choices: {
                        1: Parser.start()
                            .endianess('little')
                            .nest('Name',{type:GMSpriteData})
                    },
                    defaultChoice: Common.NullParser
                })
module.exports.GMSprite = GMSprite;

var get_number_of_resources = eval(`function get_number_of_resources(all_vars) {
                                return all_vars.GMGameBody.${ResourcesName}.NumberOf${ResourcesName};
                            } get_number_of_resources`);

var GMSprites = Parser.start()
                 .endianess('little')
                 .int32('version')
                 .int32('NumberOf'+ResourcesName)
                //  each individual resource is deflated (compressed) in gm8
                .choice(ResourcesName, {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .array('Sprites',{ length:get_number_of_resources, type: GMSprite}),

                        1: Parser.start()
                            .endianess('little')
                            .array('GM8Sprites',{length:get_number_of_resources, type: Common.NewGMCompressedResource(GMResourceName)})
                    }
                })

module.exports.GMSprites = GMSprites;