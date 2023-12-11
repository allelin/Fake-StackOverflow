// Answer Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AnswerSchema = new Schema(
    {
        text: {type: String, required: true},
        ans_by: {type: String, required: true},
        ans_date_time: {type: Date, default: Date.now},
		comments: {type: [{type: Schema.Types.ObjectId, ref: "Comment"}], default: []},
		votes: {type: Number, default: 0},
		// voted_by: {type: [{type: Schema.Types.ObjectId, ref: "Account"}], default: []}
		voted_by: {type: [{
			account: {type: Schema.Types.ObjectId, ref: "Account"},
			vote: {type: Number, enum: [1, -1] }
		}], default: []}
    }
    );

// Virtual for answer's URL
AnswerSchema
    .virtual('url')
    .get(function () {
        return '/posts/answer/' + this._id;
    });

//Export model
module.exports = mongoose.model('Answer', AnswerSchema);
