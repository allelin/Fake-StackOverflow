// Application server
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session')

const app = express()
const port = 8000

let Answer = require('./models/answers');
let Question = require('./models/questions');
let Tag = require('./models/tags');
let Account = require('./models/account');
let Comment = require('./models/comment');

//connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/fake_so", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
	console.log('Connected to MongoDB database');
});

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));
app.use(express.json());
app.use(
	session({
		secret: "nxS3SzvbSwFf830RahYxjIWbmh6HTH9O",
		// cookie:  { httpOnly: true, secure: false},
		cookie: {},
		// cookie: {secure: false},
		resave: false,
		saveUninitialized: false
	})
);

// get questions
app.get('/questions/:sortby', (req, res) => {
	// if(req.session) {
	// 	console.log(req.session);
	// }

	switch (req.params.sortby) {
		case "newest":
			Question.find()
				.populate('tags')
				.sort({ ask_date_time: -1 })
				.exec()
				.then(questionList => {
					// console.log(questionList);
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
							if (tag.name == tagName) {
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
			if (!searchQuery[0]) {
				res.send([]);
			} else {
				const acc = [];
				Question.find()
					.populate('tags')
					.sort({ ask_date_time: -1 })
					.exec()
					.then(questionList => {
						searchQuery.forEach((searchItem) => {
							if (searchItem.startsWith("[") && searchItem.endsWith("]")) {
								let tagName = searchItem.slice(1, -1);

								questionList.forEach(question => {
									question.tags.forEach(tag => {
										if (tag.name == tagName) {
											if (!acc.includes(question)) {
												acc.push(question);
											}
										}
									})
								});
							} else {
								let qFromWord = getQuestionsByWord(searchItem, questionList);

								qFromWord.forEach((question) => {
									if (!acc.includes(question)) {
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

			if (w == word) {
				return true;
			} else if (linkMatch) {
				if (word == "http") {
					return linkMatch[2].slice(0, 5) == "http:";
				} else if (word == "https") {
					return linkMatch[2].startsWith(word);
				} else {
					return linkMatch[1] == word || linkMatch[2] == word;
				}

			}
			return false;
		}));
}

app.post('/verifytags', (req, res) => {
	let tags = [];
	// console.log(req.body.tags);
	const promises = req.body.tags.map(tagName => {
		return Tag.findOne({ name: tagName})
		.then(tag => {
			if(tag) {
				tags.push(tag);
			}
			return tag;
		})
		.catch(err => {
			console.error(err);
		})
	});

	Promise.all(promises)
	.then(() => {
		res.send(tags);
	}).catch(err => {
		console.error(err);
		// res.status(500).send('Internal Server Error');
	});
});

//middleware get all tags
const getTags = function (req, res, next) {
	const tagsArr = req.body.tags;

	const promises = tagsArr.map(tagName => {
		return Tag.findOne({ name: tagName })
			.then(tag => {
				if (tag) {
					return tag;
				} else {
					let newTag = new Tag({ name: tagName });
					return newTag.save()
					.then(newTag => {
						return Account.findOne({ email: req.session.email })
						.then(account => {
							account.tags.push(newTag);
							return account.save();
						});
					});
					// return Account.findOne({ email: req.body.email })
					// .then(account => {
					// 	if(account.reputation >= 50) {
					// 		let newTag = new Tag({ name: tagName });
					// 		return newTag.save()
					// 		.then(newTag => {
					// 			account.tags.push(newTag);
					// 			return account.save();
					// 		})
					// 	} else {
					// 		// res.status(403).send("Insufficient reputation to create a new tag.");
					// 		return Promise.reject(new Error("Insufficient reputation to create a new tag."));
					// 	}
					// });
				}
			})
			.catch(err => {
				console.error(err);
				return Promise.reject(new Error("An error occurred while processing tags."));
			});
	});

	Promise.all(promises)
		.then(tags => {
			req.body.tags = tags;
			next();
		})
		// .then(results => {
		// 	// Check if any promises were rejected
		// 	// const errors = results.filter(result => result.status === 'rejected');
		// 	console.log(results);
	  
		// 	// if (errors.length > 0) {
		// 	//   // If there are errors, prevent the creation of a new question
		// 	//   res.status(403).send("Question creation failed. Insufficient reputation to create a new tag.");
		// 	//   req.body.tagsProcessed = false;
		// 	// } else {
		// 	  // If no errors, continue processing and pass tags to the next middleware or route
		// 	const tags = results.map(result => result.value);
		// 	req.body.tags = tags;
		// 	req.body.tagsProcessed = true;
		// 	  next();
		// 	// }
		//   })
		.catch(err => {
			console.error(err);
			// console.log("hi");
			// req.body.tagsProcessed = false;
			// res.status(403).send("Question creation failed. Insufficient reputation to create a new tag.");
			next();
		});
}

app.use('/postquestion', getTags);

app.post('/postquestion', (req, res) => {
	// console.log(req.body);
	// if(req.body.tagsProcessed) {
	let newQuestion = Question({
		title: req.body.title,
		summary: req.body.summary,
		text: req.body.text,
		tags: req.body.tags,
		asked_by: req.session.user,
	});

	newQuestion.save()
		.then(newQ => {
			Account.findOne({ email: req.session.email })
				.then(account => {
					account.questions.push(newQ);
					account.save()
						.then(() => {
							res.send(newQ);
						})
						.catch(err => console.error(err));
				});
		});
	// }
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
						if (tagQ.name == tag.name) {
							count++;
						}
					})
				});

				tagsListObj.push({ tag: tag, count: count });

			});

			res.send(tagsListObj);
		})
		.catch(err => console.error(err));
});


app.get('/answer/:id', (req, res) => {
	Answer.findById(req.params.id)
	.populate('comments')
	.exec()
	.then(answer => {
		res.send(answer);
	})
	.catch(err => console.error(err));
});

app.post(`/question/updateviews`, (req, res) => {
	Question.findById(req.body.id)
	.populate("tags")
	.exec()
		.then(question => {
			question.views += 1;
			question.save()
				.then((question) => {
					// res.send(question);
					return Question.findById(question._id).populate('tags').populate('comments').exec();
				})
				.then(populatedQ => {
					res.send(populatedQ);
				})
				.catch(err => console.error(err));
		})
});

app.post(`/postanswer`, (req, res) => {
	// console.log(req.session);
	const newAnswer = Answer({
		text: req.body.text,
		ans_by: req.session.user,
	});
	newAnswer.save()
		.then((newAns) => {
			Account.findOne({ email: req.session.email })
			.then(account => {
				account.answers.push(newAns);
				account.save()
				.then(account => {
					Question.findById(req.body.qid)
					.then(question => {
						question.answers.push(newAns._id);
						question.save()
							.then((question) => {
								return Question.findById(question._id).populate('tags').populate('comments').exec();
							})
							.then(populatedQ => {
								res.send(populatedQ);
							})
							.catch(err => console.error(err));
					})
					.catch(err => console.error(err));
				})
			});
		})
});

app.get('/account/:email', (req, res) => {
	Account.findOne({ email: req.params.email })
		.then(account => {
			if (account) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch(err => console.error(err));
});

app.post('/postaccount', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(req.body.password, salt);
	const newAcc = Account({
		username: req.body.username,
		email: req.body.email,
		passwordHash: passwordHash
	});

	newAcc.save()
		.then(acc => res.send("Account created"))
		.catch(err => console.error(err));
});

app.get('/login/:email/:password', (req, res) => {
	Account.findOne({ email: req.params.email })
	.populate("questions")
	.populate("answers")
	.populate("tags")
	.exec()
		.then(account => {
			if (account) {
				bcrypt.compare(req.params.password, account.passwordHash)
					.then(result => {
						if (result) {
							// console.log("hi");
							req.session.user = account.username;
							req.session.acctype = account.accType;
							req.session.email = account.email;
							// console.log(req.session); 
							res.send(account);
						} else {
							res.send(false);
						}
					})
					.catch(err => console.error(err));
			} else {
				res.send(false);
			}
		})
		.catch(err => console.error(err));
});

app.get(`/verifyuser`, (req, res) => {
	if (req.session.user) {
		// console.log(req.session);
		// res.send(true);
		Account.findOne({ email: req.session.email })
			.then(account => {
				if (account) {
					res.send(account);
				} else {
					res.send(false);
				}
			})
	} else {
		res.send(false);
	}
});

app.get(`/logout`, (req, res) => {
	// console.log(req.session);
	// if(req.session.user) {
	req.session.destroy(err => {
		if (err) {
			console.error(err);
		} else {
			// console.log(req.session);
			res.send("Logged out");
		}
	});
	// }
});


app.post("/postcomment/question", (req, res) => {
	const newComment = Comment({
		text: req.body.text,
		comment_by: req.session.user,
	});
	newComment.save()
	.then(newCom => {
		Account.findOne({ email: req.session.email })
		.then(account => {
			account.comments.push(newCom);
			account.save()
			.then(account => {
				Question.findById(req.body.qid)
				.then(question => {
					question.comments.push(newCom);
					question.save()
					.then(question => {
						return Question.findById(question._id).populate('tags').populate('comments').exec();
					})
					.then(populatedQ => {
						res.send(populatedQ);
					})
				})
			})
		})
	})
	.catch(err => console.error(err));
});

app.post("/postcomment/answer", (req, res) => {
	const newComment = Comment({
		text: req.body.text,
		comment_by: req.session.user,
	});
	// console.log(req.session);
	newComment.save()
	.then(newCom => {
		Account.findOne({ email: req.session.email })
		.then(account => {
			account.comments.push(newCom);
			account.save()
			.then(account => {
				Answer.findById(req.body.aid)
				.then(answer => {
					answer.comments.push(newCom);
					answer.save()
					.then(answer => {
						Question.findById(req.body.qid).populate('tags').populate('comments').exec()
						.then(question => {
							res.send(question);
						})
					})
				})
			})
		})
	})
	.catch(err => console.error(err));
});

app.get(`/accountinfo`, (req, res) => {
	// console.log(req.session);
	Account.findOne({ email: req.session.email })
		.populate("questions")
		.populate("answers")
		.populate("tags")
		.exec()
		.then(account => {
			res.send(account);
		})
});

app.get(`/getallaccounts`, (req, res) => {
	Account.find({ accType: "User" })
		.exec()
		.then(accounts => {
			res.send(accounts);
		})
		.catch(err => console.error(err));
});

app.get('/deletequestion/:id', async (req, res) => {
	const qid = req.params.id;
	const question = await Question.findByIdAndDelete(qid);
	const user = question.asked_by;
	let account = await Account.findOne({ email: req.session.email });
	if (account) {
		account.questions.pull(qid);
		account = await account.save();
	}
	for (let i = 0; i < question.answers.length; i++) {
	// question.answers.map(async (aid) => {
		let ans = await Answer.findByIdAndDelete(question.answers[i]);
		let acc = await Account.updateOne(
			{ answers: question.answers[i] }, 
			{ $pull: { answers: question.answers[i] } } 
		  );
		for (let j = 0; j < ans.comments.length; j++) {
			let com = await Comment.findByIdAndDelete(ans.comments[j]);
			let acc = await Account.updateOne(
				{ comments: ans.comments[j] }, 
				{ $pull: { comments: ans.comments[j] } } 
			  );
		}
	}
	for (let i = 0; i < question.comments.length; i++) {
	// question.comments.map(async (cid) => {
		let com = await Comment.findByIdAndDelete(cid);
		let acc = await Account.updateOne(
			{ comments: cid }, 
			{ $pull: { comments: cid } } 
		  );	
	}
	let updatedAcc = await Account.findOne({ email: req.session.email })
	.populate("questions")
	.populate("answers")
	.populate("tags")
	.exec()
	res.send(updatedAcc);

});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

//terminate on ctrl c for server
process.on('SIGINT', () => {
	if (db) {
		db.close()
			.then((result) => {
				console.log('Server closed. Database instance disconnected');
				process.exit(0);
			})
			.catch((err) => console.log(err));
	}
});
