var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");

var GMSoundData = Parser.start()
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
                .uint32('kind')
                .nest('FileType',{type:Common.GMString})
                .nest('FileName',{type:Common.GMString})
                .uint32('hasData')
                .choice('data', {
                    tag: 'hasData',
                    choices: {
                        0: Parser.start()
                            .endianess('little'),

                        1: Parser.start()
                            .endianess('little')
                            .nest('Buffer',{type:Common.GMString})
                    }
                })
                .uint32('effects')
                .buffer('Volume',{length:8})
                .buffer('Pan',{length:8})
                .uint32('preload')

var GMSound = Parser.start()
                .endianess('little')
                .uint32('isvalid')

                .choice('data', {
                    tag: function(all_vars) {
                        console.error("SOUND",JSON.stringify(all_vars), this.isvalid);
                        return this.isvalid;
                    },//'isvalid',
                    choices: {
                        0: Parser.start()
                            .endianess('little'),

                        1: Parser.start()
                            .endianess('little')
                            .nest('Name',{type:GMSoundData})
                    }
                })

var GMCompressedSound = Parser.start()
                .endianess('little')
                .uint32('limit')
                // .buffer('inflated_data',{
                //     length:function() {
                //         return this.limit
                //     },
                //     formatter: function(buffer) {
                //         var inflated_buffer = this.zlib.inflateSync(buffer);
                //         var parsed_data = this.GMSound.parse(inflated_buffer);
                //         return parsed_data
                //         // return "TODO Compressed GM8 Resource";
                //     }
                // }).GMSound=GMSound;

var GMSounds = Parser.start()
                 .endianess('little')
                 .int32('version')
                 .int32('NumberOfSounds')
                //  each individual resource is deflated (compressed) in gm8
                .choice('Sounds', {
                    tag: VersionCheck.is_greater_than_equal_version_800,
                    choices: {
                        0: Parser.start()
                            .endianess('little')
                            .array('Sounds',{ length:function(all_vars) {
                                console.error("ALL VARS ::",all_vars.GMGameBody.Sounds.NumberOfSounds);
                                return all_vars.GMGameBody.Sounds.NumberOfSounds;
                            }, type: GMSound}),

                        1: Parser.start()
                            .endianess('little')
                            .array('GM8Sounds',{length:function(all_vars) {
                                console.error("ALL VARS ::",all_vars.GMGameBody.Sounds.NumberOfSounds);
                                return all_vars.GMGameBody.Sounds.NumberOfSounds;
                            }, type: GMCompressedSound})
                    }
                    // defaultChoice: Parser.start()
                })

module.exports.GMSounds = GMSounds;