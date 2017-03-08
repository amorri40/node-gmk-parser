var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ResourceName = "Font"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";

module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('Name',{type:Common.GMString})
                .nest('gm8',{type:Common.GM8LastChanged})
                .uint32('version')
                //
                // # TODO : Handle version 440 Data files
                //
                .nest('FontName',{type:Common.GMString})
                .int32('size')
                .int32('bold')
                .int32('italic')
                .int16('rangeMin')
                .int8('chatSet')
                .int8('antiAlias')
                .int32('range2')
                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);