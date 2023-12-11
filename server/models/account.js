var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
		questions: {type: [{type: Schema.Types.ObjectId, ref: "Question"}], default: []},
		answers: {type: [{type: Schema.Types.ObjectId, ref: "Answer"}], default: []},
		tags: {type: [{type: Schema.Types.ObjectId, ref: "Tag"}], default: []},
		comments: {type: [{type: Schema.Types.ObjectId, ref: "Comment"}], default: []},
		reputation: {type: Number, default: 0},
		accType: {type: String, enum: ["Admin", "User"], default: 'User'},
		acc_date_created: {type: Date, default: Date.now}
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
