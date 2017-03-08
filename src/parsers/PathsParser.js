var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ResourceName = "Path"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";

var GMPathPoint =  Parser.start()
                        .endianess('little')
                        .nest('x',{type:Common.GMDouble})
                        .nest('y',{type:Common.GMDouble})
                        .nest('speed',{type:Common.GMDouble})

module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('Name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .uint32('version')
                .int32('smooth')
                .int32('closed')
                .int32('precision')
                .int32('backgroundRoom')
                .int32('snapX')
                .int32('snapY')
                .int32('numberOfPoints')
                .array('Points',{length:'numberOfPoints', type: GMPathPoint})
                .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);