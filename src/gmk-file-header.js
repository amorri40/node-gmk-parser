// flickr-fetcher.js
var fs = require('fs');
var util = require('util');
var Promise = require("bluebird");
var Parser = require("binary-parser").Parser;
var readFile = Promise.promisify(fs.readFile);

//
// # Parsers
//
var SkipParser = require('./parsers/SkipParser.js');
var GMKEncryption = require('./parsers/GMKEncryption.js');
var SettingsParser = require('./parsers/SettingsParser.js');

var GMFileReader;

var GMFile = Parser.start()
    .endianess('little')
    .uint32('identifier', {assert: 1234321})
    .uint32('version', {assert: function(value) {
        return value===530 || value === 610 || value === 701 || value===800 || value===810
    }})
    .choice('data', {
        tag: 'version',
        choices: {
            530: SkipParser.Skipped4Bytes,
            701: GMKEncryption.GMKEncryptionHeader,
        },
        defaultChoice: SettingsParser.GameID
    })

GMFileReader = {
    openGmFile: function(file_path) {
        return readFile(file_path).then( function(data) {
            console.error(typeof(data));
            var parsed_gm_file = GMFile.parse(data);
            console.error("GM File:",parsed_gm_file);
            return parsed_gm_file;
        });
    }
};

module.exports = GMFileReader;