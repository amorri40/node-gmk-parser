var Parser = require("binary-parser").Parser;
var VersionCheck = require("../util/VersionChecks");
var Common = require("../util/CommonTypes");
var CommonFunctions = require("../util/CommonFunctions");

var ArgumentParser = Parser.start()
                .endianess('little')
                //
                // # TODO weird argnumber vs actual arg number
                //
                .nest('value',{type:Common.GMString})


var ArgumentKindParser = Parser.start()
                .endianess('little')
                .int32('kind')

var ActionParser = Parser.start()
                .endianess('little')
                .int32('skip')
                .int32('libraryId')
                .int32('actionId')
                .int32('actionKind')
                .int32('allowRelative')
                .int32('question')
                .int32('canApplyTo')
                .int32('execType')
                .nest('ExecFunction',{type:Common.GMString})
                .nest('ExecCode',{type:Common.GMString})
                .int32('argumentNumber')
                .int32('argumentKindNumber')
                .array('argumentKinds',{type:ArgumentKindParser,length:'argumentKindNumber'})
                .int32('appliesTo')
                .int32('relative')
                .int32('ActualNumberOfArguments')
                .array('arguments',{type:ArgumentParser,length:'ActualNumberOfArguments'})
                .int32('not')


module.exports.ActionsParser = Parser.start()
                .endianess('little')
                .uint32('version')
                .int32('numberOfActions')
                .array('actions',{type:ActionParser,length:'numberOfActions'})