'use strict';
var expect = require('chai').expect;
var assert = require('chai').assert;

var GMFileReader = require('../../src/gmk-file-header.js');
var GMKEncryption = require('../../src/parsers/GMKEncryption.js');

var game_header={ identifier: 1234321,
    version: 701,
    encryption: { s1: 1784, s2: 1019, seed: 16085, GameID: 3148371610 } };

var data = null;

beforeAll(function(done) {
    // expect.assertions(1);
    return GMFileReader.getFullByteDataFromFile('./tests/gm_files/fire_example.gmk').then(
        function(full_bytes_of_file) {
            data=full_bytes_of_file;
            done();
        }
    );
})

it('should exist', function() {
    expect(GMKEncryption).to.not.be.undefined;
});

it('should unencrypt full game', function() {
    var unencrypted_data = GMKEncryption.unencryptFullGame(game_header,data);
    expect(unencrypted_data.length).to.be.equal(44664);
});