var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");

var GameID = Parser.start()
    .endianess('little')
    .uint32('GameID')

var ColorDepth = Parser.start()
    .endianess('little')
    .choice('ColorDepth', {
        tag: 'version',
        choices: {
            530: Parser.start()
                .endianess('little')
                .uint32('ColorDepth')
                .uint32('ExclusiveGraphics')
                .uint32('Resolution')
                .uint32('Frequency')
                .uint32('VBlank')
                .uint32('CaptionInFullscreen')
        },
        defaultChoice: Parser.start()
                        .endianess('little')
                        .uint32('ColorDepth')
                        .uint32('Resolution')
                        .uint32('Frequency')
    })



var GMString = Parser.start()
    .endianess('little')
    .int32('length')
    .string('Value',{length:'length'})

var GMConstant = Parser.start()
    .endianess('little')
    .nest('Name',{type:GMString})
    .nest('Value',{type:GMString})

var GMInclude = Parser.start()
    .endianess('little')
    .nest('FilePath',{type:GMString})

var GMIncludes = Parser.start()
                 .endianess('little')
                 .int32('NumberOfIncludes')
                 .array('Includes',{length:function() {
                     return this['NumberOfIncludes'];
                 }, type: GMInclude})
                 .int32('IncludeFolders')
                 .int32('OverwriteExisting')
                 .int32('RemoveAtGameEnd')

var GMConstants = Parser.start()
                 .endianess('little')
                 .int32('NumberOfConstants')
                 .array('Constants',{length:function() {
                     return this['NumberOfConstants'];
                 }, type: GMConstant})
module.exports.GMConstants=GMConstants;

var GMCompressedTrigger = Parser.start()
                 .endianess('little')
                .uint32('limit')
                .buffer('inflated_data',{
                    length:function() {
                        return this.limit
                    },
                    formatter: function(buffer) {
                        // var inflated_buffer = this.zlib.inflateSync(buffer);
                        // var parsed_data = this.MainSettings.parse(inflated_buffer);
                        // return parsed_data
                        return "TODO Compressed Triggers";
                    }
                })

var GMTriggers = Parser.start()
                 .endianess('little')
                 .int32('version')
                 .int32('NumberOfTriggers')
                //  each individual trigger is deflated (compressed)
                 .array('Includes',{length:function() {
                     return this['NumberOfTriggers'];
                 }, type: GMCompressedTrigger})


var MainSettings = Parser.start()
    .endianess('little')
    .uint32('StartFullscreen')
    .uint32('Interpolate')
    .uint32('DontDrawBorder')
    .uint32('DisplayCursor')
    .int32('Scaling')
    .choice('WindowSettings', {
        tag: VersionCheck.get_game_version,
        choices: {
            530: Parser.start()
                .endianess('little')
                .uint32('FullscreenScale')
                .uint32('OnlyScaleWithHardwareSupport')
        },
        defaultChoice: Parser.start()
                        .endianess('little')
                        .uint32('AllowWindowResize')
                        .uint32('AlwaysOnTop')
                        .uint32('ColorOutsideRoom')

    })
    .uint32('SetResolution')
    .choice('ColorDepth', {
        tag: VersionCheck.get_game_version,
        choices: {
            530: Parser.start()
                .endianess('little')
                .uint32('ColorDepth')
                .uint32('ExclusiveGraphics')
                .uint32('Resolution')
                .uint32('Frequency')
                .uint32('VBlank')
                .uint32('CaptionInFullscreen')
        },
        defaultChoice: Parser.start()
                        .endianess('little')
                        .uint32('ColorDepth')
                        .uint32('Resolution')
                        .uint32('Frequency')
    })
    .uint32('DontShowButtons')
    .choice('UseSynchronization', {
        tag: VersionCheck.is_greater_than_version_530,
        choices: {
            1: Parser.start()
                 .endianess('little')
                 .uint32('UseSynchronization')
        },
        defaultChoice: Parser.start()
    })
    .choice('gm8', {
        tag: VersionCheck.get_game_version,
        choices: {
            800: Parser.start()
                 .endianess('little')
                 .uint32('DisableScreenSavers')
        },
        defaultChoice: Parser.start()
    })
    .uint32('LetF4SwitchFullScreen')
    .uint32('LetF1ShowGameInfo')
    .uint32('LetEscEndGame')
    .uint32('LetF5SaveF6Load')
    .choice('gm53', {
        tag: VersionCheck.get_game_version,
        choices: {
            530: Parser.start()
                 .endianess('little')
                 .uint32('Ignore')
                 .uint32('Ignore2')
        },
        defaultChoice: Parser.start()
    })
    .choice('gm6', {
        tag: VersionCheck.is_greater_than_version_600,
        choices: {
            1: Parser.start()
                 .endianess('little')
                 .uint32('LetF9ScreenShot')
                 .uint32('TreatCloseAsEscape')
        },
        defaultChoice: Parser.start()
    })
    .uint32('GamePriority')
    .uint32('FreezeOnLoseFocus')
    .uint32('LoadBarMode')
    .choice('LoadingBar', {
        tag: 'LoadBarMode',
        choices: {
            0: Parser.start()
                 .endianess('little'),
            1: Parser.start()
                 .endianess('little'),
            2: Parser.start()
                 .endianess('little')
        },
        defaultChoice: Parser.start()
    })
    .uint32('ShowCustomLoadImage')
    .choice(
        'LoadImage', {
            tag: 'ShowCustomLoadImage',
            choices: {
                0: Parser.start(),
                1: Parser.start()
                .endianess('little')
                .int32('Something')
                .int32('imageLength')
                .buffer('Image', {
                    length:function(a) {
                        // console.log('ImageLength::',this.imageLength,a)
                        return this.imageLength;
                    }})

            }
        }
    )
    .uint32('ImagePartiallyTransparent')
    .uint32('LoadImageAlpha')
    .int32('ScaleProgressBar')
    .int32('IconLength')
    .buffer('Icon', {
            length:function(a) {
                return this.IconLength;
            }})
    .int32('DisplayErrors')
    .int32('WriteToLog')
    .int32('AbortOnError')
    .int32('ErrorsBitField')
    .int32('AuthorLength')
    .string('Author',{length:'AuthorLength'})
    .choice('version', {
        tag: VersionCheck.is_greater_than_version_600,
        choices: {
            0: Parser.start()
                 .endianess('little')
                 .int32('Version'),

            1: Parser.start()
                 .endianess('little')
                 .nest('Version',{type:GMString})
        },
        defaultChoice: Parser.start()
    })
    .buffer('LastChanged',{length:8})
    .nest('Information',{type:GMString})
    .choice('Constants', {
        tag: VersionCheck.is_smaller_than_version_800,
        choices: {
            0: Parser.start()
                 .endianess('little'),

            1: Parser.start()
                 .endianess('little')
                 .int32('NumberOfConstants')
                 .array('Constants',{length:function() {
                     return this['NumberOfConstants'];
                 }, type: GMConstant})
        },
        defaultChoice: Parser.start()
    })
    .choice('buildInformation', {
        tag: VersionCheck.is_greater_than_version_600,
        choices: {
            0: Parser.start()
                 .endianess('little')
                 .choice('Includes', {
                     tag: VersionCheck.is_greater_than_version_530,
                     choices: {
                            0: Parser.start()
                                .endianess('little'),

                            1: Parser.start()
                                .endianess('little')
                                .nest('Includes',{type:GMIncludes}),
                 } }),

            1: Parser.start()
                 .endianess('little')
                 .int32('VersionMajor')
                 .int32('VersionMinor')
                 .int32('VersionRelease')
                 .int32('VersionBuild')
                 .nest('Company',{type:GMString})
                 .nest('Product',{type:GMString})
                 .nest('Copyright',{type:GMString})
                 .nest('Description',{type:GMString})
        },
        defaultChoice: Parser.start()
    })
    .choice('lastChanged', {
        tag: VersionCheck.is_greater_than_equal_version_800,
        choices: {
            0: Parser.start()
                 .endianess('little'),

            1: Parser.start()
                 .endianess('little')
                 .int32('LastChanged')
                 .int32('LastChanged2')
        },
        defaultChoice: Parser.start()
    })
    //
    // # Remember the end of this is also the end of the zlib buffer in GM8!
    //






var InflatedSettings = Parser.start()
    .endianess('little')
    .uint32('limit')
    .buffer('inflated_data',{
        length:function() {
            return this.limit
        },
        formatter: function(buffer) {
            var inflated_buffer = this.zlib.inflateSync(buffer);
            var parsed_data = this.MainSettings.parse(inflated_buffer);
            return parsed_data
        }
    })

var GameSettings = Parser.start()
    .endianess('little')
    .uint32('version')
    .choice('data', {
        tag: function() {
            return this.version;
       },
        choices: {
            800: InflatedSettings
        },
        defaultChoice: MainSettings
    })


module.exports.GameID = GameID;
module.exports.GameSettings = GameSettings;
module.exports.MainSettings = MainSettings;
module.exports.GMTriggers = GMTriggers;

// console.error("CODE::",MainSettings.getCode());
