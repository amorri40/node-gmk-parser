var Parser = require("binary-parser").Parser;
var GMKZlib = require("./GMKZlib.js");
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");
var Actions = require("./ActionsParser")

var ResourceName = "Include"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";


module.exports[GMResourceName+"Data"] = Parser.start()
                .endianess('little')
                .nest('gm8',{type:Common.GM8LastChanged})
                .int32('version')
                .nest('fileName',{type:Common.GMString})
                .nest('filePath',{type:Common.GMString})
                .int32('isOriginal')
                .int32('size')
                .int32('storeInEditable')
                .choice('data', {
                    tag: function() {
                        return this.storeInEditable === 1?1:0;
                    },
                    choices: {
                        0: Common.NullParser,

                        1: Parser.start()
                            .endianess('little')
                            .nest('data',{type:Common.GMString})

                    },
                    defaultChoice: Parser.start()
                })
                .int32('export')
                .nest('exportFolder',{type:Common.GMString})
                .int32('overwriteExisting')
                .int32('freeMemAfterExport')
                .int32('removeAtGameEnd')
                // .nest('stdout', {type: Common.NewStdoutMessage(ResourcesName)})

module.exports[GMResourceName] = Common.NewValidCheckerForGMResource(module.exports[GMResourceName+"Data"]);
module.exports[GMResourcesName] = Common.NewGMResource(ResourceName, ResourcesName, GMResourceName, module.exports[GMResourceName]);