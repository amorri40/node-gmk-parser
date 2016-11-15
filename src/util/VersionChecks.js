
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

module.exports.is_greater_than_equal_version_800 = function(all_vars) {
    //
    // # 800 is a special case as it spawns a new parser which won't have previous properties
    //
    if (!all_vars.GMFileHeader)
        return 1;
    return all_vars.GMFileHeader.version >= 800? 1:0;
}