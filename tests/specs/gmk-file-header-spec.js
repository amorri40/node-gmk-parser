'use strict';
var expect = require('chai').expect;
var assert = require('chai').assert;

describe('Game Maker Header', function() {
    var GMFileReader = require('../../src/gmk-file-header.js');
    var common_catch_block = function(err) {
        throw err;
    }

    var common_expects = function(actual,file_path) {
        expect(actual).to.not.be.undefined;
        expect(actual).to.not.be.false;
        expect(actual).to.be.object;
        expect(actual.GMFileHeader).to.have.all.keys("identifier","version","encryption");

        var did_save = GMFileReader.saveJSONOutput(file_path+'.json', actual);
        expect(did_save).to.be.equal(true);
    }

    it('should exist', function() {
        expect(GMFileReader).to.not.be.undefined;
    });

it('should open a 530 gmd file', function(done) {
        this.timeout(25000);
        var file_path = './tests/gm_files/pathtracer.gmd';
        var gmk_file = GMFileReader.openGmFile(file_path);

        gmk_file.then(function asserts (actual) {
            common_expects(actual, file_path);
            expect(actual.GMFileHeader.version).to.be.equal(530);
            done();
        }).catch(common_catch_block);
    });

    it('should open a gm6 (600) file', function(done) {
        this.timeout(50000);
        var file_path = './tests/gm_files/1945v3.gm6';
        var gmk_file = GMFileReader.openGmFile(file_path);

        gmk_file.then(function asserts (actual) {
            common_expects(actual, file_path);
            expect(actual.GMFileHeader.version).to.be.equal(600);
            done();
        }).catch(common_catch_block);
    });

    it('should open a gm7 (701) obfuscated file', function(done) {
        this.timeout(50000);
        var file_path = './tests/gm_files/fire_example.gmk';
        var gmk_file = GMFileReader.openGmFile(file_path);

        gmk_file.then(function asserts (actual) {
            common_expects(actual,file_path);
            expect(actual.GMFileHeader.version).to.be.equal(701);
            expect(actual.GMFileHeader.encryption.seed).to.be.equal(16085);
            done();
        }).catch(common_catch_block);
    });

    it('should open a v800 gmk file', function(done) {
        this.timeout(25000);
        var file_path = './tests/gm_files/fpsexample.gmk';
        var gmk_file = GMFileReader.openGmFile(file_path);

        gmk_file.then(function asserts (actual) {
            common_expects(actual,file_path);
            expect(actual.GMFileHeader.version).to.be.equal(800);
            // console.error("\n\nActual GM8 :: ",JSON.stringify(actual));
            done();
        }).catch(common_catch_block);
    });
});