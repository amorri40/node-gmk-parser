var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");

var ResourceName = "Sprite"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;

var NullParser = Parser.start()
                            .endianess('little')
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
                            .uint32('isvalid')
                            .choice('data', {
                                tag: function(all_vars) {
                            return this.isvalid !== -1?1:0
                            },
                                choices: {
                                    1: Parser.start()
                                        .endianess('little')
                                        .nest('Image',{type:Common.GMString})
                                },
                                defaultChoice:
                                    Parser.start()
                                            .endianess('little')
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
                .choice('lastChanged', {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little'),

                        1: Parser.start()
                            .endianess('little')
                            .buffer('LastChanged',{length:8})
                    }
                })
                .uint32('version')
                .choice('data', {
                    tag: VersionCheck.is_less_than_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little'),

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
                        0: NullParser,
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
                .uint32('isvalid')

                .choice('gmspritedata', {
                    tag: function(all_vars) {
                        return this.isvalid;
                    },
                    choices: {
                        1: Parser.start()
                            .endianess('little')
                            .nest('Name',{type:GMSpriteData})
                    },
                    defaultChoice: NullParser
                })
module.exports.GMSprite = GMSprite;

var GMCompressedSprite = Parser.start()
                .endianess('little')
                .int32('limit')
                .buffer('inflated_data',{
                    length: 'limit',
                    formatter: function(buffer) {
                        var inflated_buffer = this.zlib.inflateSync(buffer);
                        var parsed_data = this.Parsers.GMSprite.parse(inflated_buffer);
                        return parsed_data
                    }
                })

var GMSprites = Parser.start()
                 .endianess('little')
                 .int32('version')
                 .int32('NumberOfSprites')
                //  each individual resource is deflated (compressed) in gm8
                .choice('Sprites', {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .array('Sprites',{ length:function(all_vars) {
                                return all_vars.GMGameBody.Sprites.NumberOfSprites;
                            }, type: GMSprite}),

                        1: Parser.start()
                            .endianess('little')
                            .array('GM8Sprites',{length:function(all_vars) {
                                return all_vars.GMGameBody.Sprites.NumberOfSprites;
                            }, type: GMCompressedSprite})
                    }
                })

module.exports.GMSprites = GMSprites;