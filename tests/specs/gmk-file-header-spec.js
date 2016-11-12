'use strict';
var expect = require('chai').expect;

describe('Game Maker Header', function() {
    var GMFileReader = require('../../src/gmk-file-header.js');
    var gmk_file = GMFileReader.openGmFile('./tests/gm_files/fpsexample.gmk');
    it('should exist', function() {
        expect(GMFileReader).to.not.be.undefined;
    });

    it('should open a gmk file', function(done) {
        this.timeout(25000);

        gmk_file.then(function asserts (actual) {
            expect(actual).to.not.be.undefined;
            expect(actual).to.not.be.false;
            expect({ identifier: 1234321 }).to.have.all.keys("identifier");
            expect(actual).to.be.object;

            expect(actual).to.have.all.keys("identifier","version");
            expect(actual.version).to.be(800);
            done();
        }).catch(function() {done();});
    });
});