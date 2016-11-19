
module.exports.is_valid_check = function(all_vars,offset) {
    if (this.isvalid !== 1 && this.isvalid !== 0)
    console.error("ISVALID :: ",this.isvalid,offset,JSON.stringify(all_vars));
    return this.isvalid;
}