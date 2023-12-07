// Application server
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const app = express()
const port = 8000

let Answer = require('./models/answers');
let Question = require('./models/questions');
let Tag = require('./models/tags');

//connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
  console.log('Connected to MongoDB database');
});

app.use(cors());
app.use(express.json());

// get questions
app.get('/questions/:sortby', (req, res) => {
	switch(req.params.sortby) {
		case "newest":
			Question.find()
			.populate('tags')
			.sort({ ask_date_time: -1 })
			.exec()
			.then(questionList => {
				res.send(questionList);
			})
			.catch(err => console.error(err));
			break;
		case "active":
			Question.aggregate([
				{
				  $lookup: {
					from: 'answers',  // The name of the 'Answer' collection
					localField: 'answers',
					foreignField: '_id',
					as: 'answers',
				  },
				},
				{
				  $addFields: {
					mostRecentAnswer: {
					  $cond: {
						if: { $ne: ['$answers', []] }, // Check if 'answers' array is not empty
						then: { $max: '$answers.ans_date_time' }, // If not empty, find the max date
						else: null, // If empty, set to null
					  },
					},
				  },
				},
				{
				  $sort: {
					mostRecentAnswer: -1,
					ask_date_time: -1
				  },
				},
			])
			.exec()
			.then(questionList => {
				const promise = questionList.map(question => {
					const tagPromises = question.tags.map(tagid => Tag.findById(tagid).exec());
					return Promise.all(tagPromises)
					.then(populatedTags => {
						question.tags = populatedTags;
						return question;
					});
				});

				Promise.all(promise)
				.then(populatedQuestionList => {
					res.send(populatedQuestionList);
				})
				.catch(err => console.error(err));
			})
			.catch(err => console.error(err));
			break;
		case "unanswered":
			Question.find({ answers: { $size: 0 } })
			.sort({ ask_date_time: -1 })
			.populate('tags')
			.exec()
			.then(questionList => {
				res.send(questionList);
			})
			.catch(err => console.error(err));
			break;
		case "tag":
			const tagName = req.query.tagName;
			Question.find()
			.sort({ ask_date_time: -1 })
			.populate("tags")
			.exec()
			.then(questionList => {
				const qList = []; 
				questionList.forEach(question => {
					question.tags.forEach(tag => {
						if(tag.name == tagName) {
							qList.push(question);
						}
					})
				});
				res.send(qList);
			})
			.catch(err => console.error(err))
			break;
		case "search":
			const searchQuery = req.query.search.split(',');
			if(!searchQuery[0]) {
				res.send([]);
			} else {
				const acc = [];
				Question.find()
				.populate('tags')
				.sort({ ask_date_time: -1 })
				.exec()
				.then(questionList => {
					searchQuery.forEach((searchItem) => {
						if(searchItem.startsWith("[") && searchItem.endsWith("]")) {
							let tagName = searchItem.slice(1, -1);

							questionList.forEach(question => {
								question.tags.forEach(tag => {
									if(tag.name == tagName) {
										if(!acc.includes(question)) {
											acc.push(question);
										}
									}
								})
							});
						} else {
							let qFromWord = getQuestionsByWord(searchItem, questionList);

							qFromWord.forEach((question) => {
								if(!acc.includes(question)) {
									acc.push(question);
								}
							});
						}
					});

					res.send(acc);
				})
				.catch(err => console.error(err));
			}
			break;
	}
});

function getQuestionsByWord(word, questions) {
	return questions.filter(question => question.title.toLowerCase().split(" ").filter(Boolean).map(word => word.trim()).some((w) => w == word)
	|| question.text.toLowerCase().split(" ").filter(Boolean).map(word => word.trim()).some((w) => {
		const linkMatch = w.match(/\[([^\]]*)\]\(([^)]*)\)/);

		if(w == word) {
			return true;
		} else if(linkMatch) {
			if(word == "http") {
				return linkMatch[2].slice(0, 5) == "http:";
			} else if(word == "https") {
				return linkMatch[2].startsWith(word);
			} else {
				return linkMatch[1] == word || linkMatch[2] == word;
			}

		}
		return false;
	}));
}

//middleware get all tags
const getTags = function(req, res, next) {
	const tagsArr = req.body.tags;

	const promises = tagsArr.map(tagName => {
		return Tag.findOne({ name: tagName })
		.then(tag => {
			if(tag) {
				return tag;
			} else {
				let newTag = new Tag({ name: tagName });
				return newTag.save()
			}
		})
		.catch(err => {
			console.log('Error:', err);
		});
	});

	Promise.all(promises)
	.then(tags => {
		req.body.tags = tags;
		next();
	})
	.catch(err => {
		console.error('Error:', err);
		next();
	});
}

app.use('/postquestion', getTags);

app.post('/postquestion', (req, res) => {
	// console.log(req.body);
	let newQuestion = Question({
		title: req.body.title,
		text: req.body.text,
		tags: req.body.tags,
		asked_by: req.body.username,
	});

	newQuestion.save()
	.then(newQ => res.send("Success"));
});



app.get('/tags', async (req, res) => {
	let questionList = await Question.find()
	.populate('tags')
	.exec();
	Tag.find()
	.exec()
	.then(tagsList => {
		// res.send(tagsList)
		const tagsListObj = []; 
		tagsList.forEach(tag => {
			let count = 0;
			questionList.forEach(question => {
				question.tags.forEach(tagQ => {
					if(tagQ.name == tag.name) {
						count++;
					}
				})
			});

			tagsListObj.push({ tag: tag, count: count });

			});

			res.send(tagsListObj);
	})
	.catch(err => console.log('Error:', err));
});


app.get('/answer/:id', (req, res) => {
	Answer.findById(req.params.id)
	.then(answer => {
		res.send(answer);
	})
	.catch(err => console.error(err));
});

app.post(`/question/updateviews`, (req, res) => {
	Question.findById(req.body.id)
	.then(question => {
		question.views += 1;
		question.save()
		.then((question) => {
			res.send(question);
		})
		.catch(err => console.error(err));
	})
});

app.post(`/postanswer`, (req, res) => {
	const newAnswer = Answer({
		text: req.body.text,
		ans_by: req.body.ans_by,
	});
	newAnswer.save()
	.then((newAns) => {
		Question.findById(req.body.qid)
		.then(question => {
			question.answers.push(newAns._id);
			question.save()
			.then((question) => {
				res.send(question);
			})
			.catch(err => console.error(err));
	})
	.catch(err => console.error(err));
	})
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

//terminate on ctrl c for server
process.on('SIGINT', () => {
	if(db) {
		db.close()
		.then((result) => {
			console.log('Server closed. Database instance disconnected');
			process.exit(0);
		})
		.catch((err) => console.log(err));
	}
});