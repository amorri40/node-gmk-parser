var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");
var Actions = require("./ActionsParser")

var ResourceName = "Timeline"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";


var MomentsParser = Parser.start()
                .endianess('little')
                .int32('stepNumber')
                .nest('actions',{type:Actions.ActionsParser})

module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('Name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .uint32('version')
                .int32('numberOfMoments')
                .array('moments',{type:MomentsParser,length:'numberOfMoments'})
                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);