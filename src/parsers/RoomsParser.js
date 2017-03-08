var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");
var Actions = require("./ActionsParser")

var ResourceName = "Room"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";

var BackgroundParser = Parser.start()
                .endianess('little')
                .int32('visible')
                .int32('foreground')
                .int32('backgroundId')
                .int32('backgroundX')
                .int32('bacxkgroundY')
                .int32('tileH')
                .int32('tileV')
                .int32('hspeed')
                .int32('vspeed')
                .int32('stretch')

var ViewParser = Parser.start()
                .endianess('little')
                .int32('visible')
                .int32('viewX')
                .int32('viewY')
                .int32('viewW')
                .int32('viewH')
                .int32('viewPortX')
                .int32('viewPortY')
                .choice('', {
                    tag: VersionCheck.is_greater_than_530,
                    choices: {
                        0: Common.NullParser,

                        1: Parser.start()
                            .endianess('little')
                            .int32('portWidth')
                            .int32('portHeight')

                    },
                    defaultChoice: Parser.start()
                })
                .int32('borderH')
                .int32('borderV')
                .int32('hspeed')
                .int32('vspeed')
                .int32('object')

var InstanceParser = Parser.start()
                .endianess('little')
                .int32('x')
                .int32('y')
                .int32('object')
                .int32('id')
                .nest('creationCode',{type:Common.GMString})
                .int32('locked')

var TileParser = Parser.start()
                .endianess('little')
                .int32('x')
                .int32('y')
                .int32('background')
                .int32('backgroundX')
                .int32('backgroundY')
                .int32('width')
                .int32('height')
                .int32('depth')
                .int32('id')
                .int32('locked')

module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .int32('version')
                .nest('caption',{type:Common.GMString})
                .int32('width')
                .int32('height')
                .int32('snapY')
                .int32('snapX')
                .int32('isometric')
                .int32('speed')
                .int32('persistent')
                .int32('backgroundColor')
                .int32('drawBackgroundColor')
                .nest('creationCode',{type:Common.GMString})

                .int32('numberOfBackgrounds')
                .array('backgrounds',{type:BackgroundParser,length:'numberOfBackgrounds'})
                .int32('viewsEnabled')
                .int32('numberOfViews')
                .array('views',{type:ViewParser,length:'numberOfViews'})
                .int32('numberOfInstances')
                .array('instances',{type:InstanceParser,length:'numberOfInstances'})
                .int32('numberOfTiles')
                .array('tiles',{type:TileParser,length:'numberOfTiles'})
                .int32('rememberWindowSize')
                .int32('editorWidth')
                .int32('editorHeight')
                .int32('showGrid')
                .int32('showObjects')
                .int32('showTiles')
                .int32('showBackgrounds')
                .int32('showForegrounds')
                .int32('showViews')
                .int32('deleteUnderlyingObjects')
                .int32('deleteUnderlyingTiles')
                .choice('tileInfo', {
                    tag: function() {
                        return this.version === 520?1:0;
                    },
                    choices: {
                        0: Common.NullParser,

                        1: Parser.start()
                            .endianess('little')
                            .int32('tile1')
                            .int32('tile2')
                            .int32('tile3')
                            .int32('tile4')
                            .int32('tile5')
                            .int32('tile6')
                    },
                    defaultChoice: Parser.start()
                })
                .int32('currentTab')
                .int32('scrollBarX')
                .int32('scrollBarY')
                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);