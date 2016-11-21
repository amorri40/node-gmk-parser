
var _ = require('lodash');

var possibilities_to_generate = {
    "equal":"===",
    'is_greater_than' : '>',
    "is_less_than" : "<",
    'is_greater_than_equal' : '>=',
    "is_less_than_equal" : "<="
}

var possible_versions=["400", "520", "530","600", "700", "710", "800"];

_.each(possibilities_to_generate, function(comparison_operator, name) {

    _.each(possible_versions, function(version) {
        var full_function_name = name+"_"+version;
        // console.error(full_function_name, comparison_operator,name);
        module.exports[full_function_name] = eval(`function comparison(all_vars) {
            var current_version = 0;
            //
            // # 800 is a special case as it spawns a new parser which won't have previous properties
            //
            if (!all_vars.GMFileHeader && !this.version)
            current_version = 800;
            else if (this.version)
            current_version=this.version;
            else
            current_version = all_vars.GMFileHeader.version;
            return  current_version ${comparison_operator} ${version}? 1:0;
        }; comparison`)
    })
})

module.exports.get_game_version = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader) return 800;
    return all_vars.GMFileHeader.version;
}

module.exports.is_greater_than_version = function(version,all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
    return 1;
    return all_vars.GMFileHeader.version > version
}

module.exports.is_greater_than_version_600 = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
    return 1;
    return all_vars.GMFileHeader.version > 600? 1:0;
}

module.exports.is_greater_than_version_530 = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
        return 1;
    return all_vars.GMFileHeader.version > 530? 1:0;
}

module.exports.is_smaller_than_version_800 = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
        return 0;
    return all_vars.GMFileHeader.version < 800? 1:0;
}

module.exports.is_less_than_version_800 = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
        return 0;
    return all_vars.GMFileHeader.version < 800? 1:0;
}

module.exports.is_greater_than_equal_version_800 = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
        return 1;
    return all_vars.GMFileHeader.version >= 800? 1:0;
}