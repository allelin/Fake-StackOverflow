var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
    }
);

// Virtual for account's URL
AccountSchema
    .virtual('url')
    .get(function () {
        return '/posts/account/' + this._id;
    });

//Export model
module.exports = mongoose.model('Account', AccountSchema);
