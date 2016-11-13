var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");

var GameID = Parser.start()
    .endianess('little')
    .uint32('GameID')

var MainSettings = Parser.start()
    .endianess('little')
    .uint32('StartFullscreen')
    .uint32('Interpolate')
    .uint32('DontDrawBorder')

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
        tag: 'version',
        choices: {
            800: InflatedSettings
        },
        defaultChoice: MainSettings
    })


module.exports.GameID = GameID;
module.exports.GameSettings = GameSettings;
module.exports.MainSettings = MainSettings;
