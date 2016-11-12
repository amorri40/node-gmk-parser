var Parser = require("binary-parser").Parser;

var GameID = Parser.start()
    .endianess('little')
    .uint32('GameID')

var MainSettings = Parser.start()
    .uint32('StartFullscreen')
    .uint32('Interpolate')
    .uint32('DONT_DRAW_BORDER')

var InflatedSettings = Parser.start()
    .uint32('limit')
    .buffer('inflated_data',{
        length:function() {
            console.error(this,this.limit);
            return this.limit
        }
    })

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
