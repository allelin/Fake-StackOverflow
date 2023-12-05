// Tag Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = new Schema(
    {
        name: {type: String, required: true},
    }
    );

// Virtual for tag's URL
TagSchema
    .virtual('url')
    .get(function () {
        return '/posts/tag/' + this._id;
    });

//Export model
module.exports = mongoose.model('Tag', TagSchema);
