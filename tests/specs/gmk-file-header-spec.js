'use strict';
var expect = require('chai').expect;
var assert = require('chai').assert;

describe('Game Maker Header', function() {
    var GMFileReader = require('../../src/gmk-file-header.js');

    it('should exist', function() {
        expect(GMFileReader).to.not.be.undefined;
    });

    it('should open a v800 gmk file', function(done) {
        this.timeout(25000);
        var gmk_file = GMFileReader.openGmFile('./tests/gm_files/fpsexample.gmk');

        gmk_file.then(function asserts (actual) {
            expect(actual).to.not.be.undefined;
            expect(actual).to.not.be.false;
            expect({ identifier: 1234321 }).to.have.all.keys("identifier");
            expect(actual).to.be.object;

            expect(actual).to.have.all.keys("identifier","version");
            expect(actual.version).to.be.equal(800);
            done();
        }).catch(function(err) {
            throw err;
            // done();
        });
    });

    it('should open a gm6 (600) file', function(done) {
        this.timeout(50000);
        var gmk_file = GMFileReader.openGmFile('./tests/gm_files/1945v3.gm6');

        gmk_file.then(function asserts (actual) {
            expect(actual).to.not.be.undefined;
            expect(actual).to.not.be.false;
            expect({ identifier: 1234321 }).to.have.all.keys("identifier");
            expect(actual).to.be.object;

            expect(actual).to.have.property("identifier");
            expect(actual.version).to.be.equal(600);
            done();
        }).catch(function(err) {
            console.error("Something bad happened:",err);

            assert.fail(err);
            done();
        });
    });

    it('should open a gm7 (701) obfuscated file', function(done) {
        this.timeout(50000);
        var gmk_file = GMFileReader.openGmFile('./tests/gm_files/fire_example.gmk');

        gmk_file.then(function asserts (actual) {
            expect(actual).to.not.be.undefined;
            expect(actual).to.not.be.false;
            expect({ identifier: 1234321 }).to.have.all.keys("identifier");
            expect(actual).to.be.object;

            expect(actual).to.have.property("identifier");
            expect(actual.version).to.be.equal(701);
            expect(actual.encryption.seed).to.be.equal(16085);
            done();
        }).catch(function(err) {
            console.error("Something bad happened:",err);
            throw err;
            // expect(false).to.be.equal(true);
            // assert.fail(err);
            // done();
        });
    });
});