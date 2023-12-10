var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
	{
		text: {type: String, required: true},
		comment_by: {type: String, required: true},
		comment_date_time: {type: Date, default: Date.now},
		votes: {type: Number, default: 0},
		voted_by: {type: [{type: Schema.Types.ObjectId, ref: "Account"}], default: []}
	}
);

// Virtual for account's URL
CommentSchema
    .virtual('url')
    .get(function () {
        return '/posts/comment/' + this._id;
    });

//Export model
module.exports = mongoose.model('Comment', CommentSchema);