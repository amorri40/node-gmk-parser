var Parser = require("binary-parser").Parser;

var decodeTable = null;

var makeDecodeTable = function (seed) {
    var encTable = makeEncodeTable(seed);
	//
    // # turn encode table into decode table
    //
    var table = [];
    for (var i = 1; i < 256; i++)
        table[encTable[i]] = i;
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

var decodeByte = function(_byte,pos) {
    if (decodeTable != null)
			{
			_byte = (decodeTable[_byte] - pos) //& 0xFF;
			}
            return _byte
};

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
    console.error("Version",version);
    file_offset+=8;
    file_offset+=4*game_header.encryption.s1;
    //
    // # verify seed is correct
    //
    file_offset+=4;
    var seed = data.readUInt32LE(file_offset);

    if (seed !== game_header.encryption.seed) {
        throw "Seed not equal to seed in game_header"
    }

    decodeTable = makeDecodeTable(seed);

    //
    // # Now skip again
    //
    file_offset+=4*game_header.encryption.s2;
    file_offset+=4;
    var GameID=data.readUInt32LE(file_offset);
    file_offset+=4;

    var remaining_bytes_in_file = data.length-file_offset;

    for (; file_offset<=remaining_bytes_in_file; file_offset+=1) {
        // console.error("GameID ::",data[file_offset], decodeByte(data[file_offset],file_offset));
        // console.error("before",data[file_offset]);
        data[file_offset]=decodeByte(data[file_offset],file_offset);
        // console.error("after",data[file_offset]);
    }




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