'use strict';
var test = require('ava');
var expect = require('chai').expect;
var assert = require('chai').assert;

    var GMFileReader = require('../../src/gmk-file-header.js');
    var GMKEncryption = require('../../src/parsers/GMKEncryption.js');

    var game_header={ identifier: 1234321,
        version: 701,
        encryption: { s1: 1784, s2: 1019, seed: 16085, GameID: 3148371610 } };

    var data = null;

    test.before(function(t) {
        t.plan(1);
        return GMFileReader.getFullByteDataFromFile('./tests/gm_files/fire_example.gmk').then(
            function(full_bytes_of_file) {
                data=full_bytes_of_file;
                t.pass();
            }
        );
    })

    test('should exist', function(t) {
        expect(GMKEncryption).to.not.be.undefined;
    });

    test('should unencrypt full game', function(t) {
        var unencrypted_data = GMKEncryption.unencryptFullGame(game_header,data);
        t.is(unencrypted_data.length,44664);
    });