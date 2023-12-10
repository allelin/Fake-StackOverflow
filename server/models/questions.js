// Question Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 50},
		summary: {type: String, required: true, maxlength: 140},
        text: {type: String, required: true},
        tags: {type: [{type: Schema.Types.ObjectId, ref: 'Tag', required: true}], default: []},
        answers: {type: [{type: Schema.Types.ObjectId, ref: 'Answer'}], default: []},
        asked_by: {type: String, maxlength: 100, default: 'Anonymous'},
        ask_date_time: {type: Date, default: Date.now},
        views: {type: Number, default: 0},
		comments: {type: [{type: Schema.Types.ObjectId, ref: "Comment"}], default: []},
		votes: {type: Number, default: 0},
		voted_by: {type: [{type: Schema.Types.ObjectId, ref: "Account"}], default: []}
    }
    );

// Virtual for question's URL
QuestionSchema
    .virtual('url')
    .get(function () {
        return '/posts/question/' + this._id;
    });

//Export model
module.exports = mongoose.model('Question', QuestionSchema);
