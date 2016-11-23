var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");
var Actions = require("./ActionsParser")

var ResourceName = "Object"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";

var EventParser = Parser.start()
                .endianess('little')
                .int32('isvalid')
                .choice('actions', {
                    tag: 'isvalid',
                    choices: {"-1": Common.NullParser},
                    defaultChoice: Parser.start()
                                .endianess('little')
                                .nest('actions',{type:Actions.ActionsParser})
                })


var EventsParser = Parser.start()
                .endianess('little')
                .array('events',{type:EventParser, readUntil: function(item,buffer) {
                    // console.error("Read ahead :: ",item, item.isvalid === -1);
                    return item.isvalid === -1;
                }})


module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('Name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .uint32('version')
                .int32('sprite')
                .int32('solid')
                .int32('visible')
                .int32('depth')
                .int32('persistant')
                .int32('parent')
                .int32('mask')
                .int32('numberOfEvents')
                .array('events',{type:EventsParser,length: function(all_vars) {
                    return this.numberOfEvents+1;
                }

                })
                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);