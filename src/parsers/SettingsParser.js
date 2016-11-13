var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");

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

var get_game_version = function(all_vars) {
    return all_vars.GMFileHeader.version;
}

var MainSettings = Parser.start()
    .endianess('little')
    .uint32('StartFullscreen')
    .uint32('Interpolate')
    .uint32('DontDrawBorder')
    .uint32('DisplayCursor')
    .uint32('Scaling')
    .choice('WindowSettings', {
        tag: get_game_version,
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
        tag: get_game_version,
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
    //.zlib=require('zlib');

var GameSettings = Parser.start()
    .endianess('little')
    .uint32('version')
    .choice('data', {
        tag: function() {
            MainSettings.version=this.version;
       return this.version;
       },
        choices: {
            800: InflatedSettings
        },
        defaultChoice: MainSettings
    })
    .MainSettings = MainSettings;


module.exports.GameID = GameID;
module.exports.GameSettings = GameSettings;
module.exports.MainSettings = MainSettings;

console.error("CODE::",MainSettings.getCode());
