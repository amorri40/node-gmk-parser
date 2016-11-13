var Parser = require("binary-parser").Parser;
var fs=require('fs');
var _=require('lodash');

var decodeTable = null,decodeTable2=null;

var makeDecodeTable = function (seed) {
    var encTable = makeEncodeTable(seed);
	//
    // # turn encode table into decode table
    //
    var table = [];
    for (var i = 1; i < 256; i++)
        table[encTable[i]] = i;
    console.error("DecodeTable ::",table);
	return table;
}

var makeEncodeTable = function (seed) {
    var table = [];
		var a = 6 + (seed % 250);
		var b = seed / 250;
		for (var i = 0; i < 256; i++)
			table[i] = i;
		for (var i = 1; i < 10001; i++)
			{
			var j = 1 + ((i * a + b) % 254);
			var t = table[j];
			table[j] = table[j + 1];
			table[j + 1] = t;
			}
		return table;
}

//
// Python version to js
//
var generateSwapTable = function(seed) {
	a = 6 + (seed % 250)
	b = seed / 250
	var table = [_.range(256), _.range(256) ];
	for (var i = 1; i < 10001; i++)
		{
        j = Math.round(1 + ((i * a + b) % 254))
        var temp_var = table[0][j]
		table[0][j]=table[0][j + 1];
        table[0][j + 1] = temp_var;
    }
	for (var i = 0; i < 256; i++)
		{
            table[1][table[0][i]] = i
        }
    console.error("TABLE :: ",JSON.stringify(table));
	return table
}

var decodeByte2 = function(_byte,pos) {
    if (decodeTable != null)
			{
            // console.error(_byte,pos,decodeTable[1][+_byte])
            _byte = (decodeTable[1][_byte] - pos) & 0xFF;
            // console.error(_byte)
			//_byte = (decodeTable2[_byte] - pos) //& 0xFF;
			}
            else {
                console.error("Decode table was null");
            }
            return _byte
};

// var decodeByte = function(_byte,pos) {
//     if (decodeTable != null)
// 			{
// 			_byte = (decodeTable[_byte] - pos) //& 0xFF;
// 			}
//             else {
//                 console.error("Decode table was null");
//             }
//             return _byte
// };

// var decodeBytes = function(bytes,position_in_file) {
//     if (decodeTable != null)
// 			{
//             var off=0;
// 			for (var i = 0; i < len; i++)
// 				{
// 				var t = bytes[off + i] & 0xFF;
// 				var x = (decodeTable[t] - position_in_file - i) & 0xFF;
// 				bytes[off + i] = x;
// 				}
// 			}
//     return bytes;
// }

var unencryptFullGame = function (game_header,data) {
    console.error("UNEncrypt full game",game_header, typeof(data));
    var file_offset=0;
    if (data.readInt32LE() !== 1234321) {
        throw "Not a valid Game Maker File";
    }
    file_offset+=4;
    var version = data.readInt32LE(file_offset);
    file_offset+=4;
    console.error("Version",version);
    file_offset+=8;
    file_offset+=4*game_header.encryption.s1;
    //
    // # verify seed is correct
    //

    var seed = data.readInt32LE(file_offset);
    file_offset+=4;
    if (seed !== game_header.encryption.seed) {
        throw "Seed not equal to seed in game_header"
    }

    //decodeTable = makeDecodeTable(seed);
    decodeTable = generateSwapTable(seed);

    //
    // # Now skip again
    //
    file_offset+=4*game_header.encryption.s2;
    //var GameID=data.readUInt32LE(file_offset);
    file_offset+=1;

    var remaining_bytes_in_file = data.length-file_offset;

    for (; file_offset<=remaining_bytes_in_file; file_offset+=1) {
        // console.error("GameID ::",data[file_offset], decodeByte(data[file_offset],file_offset));
        // console.error("before",data[file_offset]);
        data[file_offset]=decodeByte2(data[file_offset],file_offset);
        // console.error("Compare ::",decodeByte(data[file_offset],file_offset),decodeByte2(data[file_offset],file_offset))
        // console.error("after",data[file_offset]);
        // break

    }
    console.error("FULL DATA::",data);
    fs.writeFile('./test',data);

    return data;
}


var GMKEncryptionHeader = Parser.start()
    .endianess('little')
    .uint32('s1')
    .uint32('s2')
    .skip(function() {return this.s1*4;})
    .uint32('seed')
    .skip(function() {return this.s2*4;})
    .uint32('GameID')

module.exports.GMKEncryptionHeader = GMKEncryptionHeader;
module.exports.unencryptFullGame = unencryptFullGame;