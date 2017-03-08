var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");
var Actions = require("./ActionsParser")

var ResourceName = "Package"
var ResourcesName = ResourceName+"s";
var GMResourceName = "GM"+ResourceName;
var GMResourcesName = GMResourceName+"s";


module.exports[GMResourceName] = Parser.start()
                .endianess('little')
                .int32('version')
                .int32('NumberOfPackages')
                .array('packages',{type:Common.GMString,length:'NumberOfPackages'})