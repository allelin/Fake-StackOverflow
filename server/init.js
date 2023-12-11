const bcrypt = require('bcrypt');

let userArgs = process.argv.slice(2);


let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let Account = require('./models/account');
let Comment = require('./models/comment');



let mongoose = require('mongoose');
let email = userArgs[0];
let password = userArgs[1];

mongoose.connect("mongodb://127.0.0.1:27017/fake_so", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function createAdmin(email, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let admin = new Account(
        {
            username: 'admin',
            email: email,
            passwordHash: hashedPassword,
            accType: 'Admin',
            reputation: 9999
        }
    );
    return admin.save();
}

async function createAccount(username, email, password, reputation) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let account = new Account(
        {
            username: username,
            email: email,
            passwordHash: hashedPassword,
        }
    );
    if (reputation != false) account.reputation = reputation;
    return account.save();
}


async function tagCreate(name, account) {
    let tag = new Tag({ name: name });

    let tagsaved = await tag.save();
    account.tags.push(tagsaved);
    let acc = await account.save();
    return tagsaved;
}

async function commentCreate(text, account, com_date_time) {
    commentdetail = { text: text };
    if (account != false) commentdetail.comment_by = account.username;
    if (com_date_time != false) commentdetail.com_date_time = com_date_time;

    let comment = new Comment(commentdetail);
    let commentsaved = await comment.save();
    account.comments.push(commentsaved);
    let acc = await account.save();
    return commentsaved;
}

async function answerCreate(text, account, ans_date_time, ans_comments) {
    answerdetail = { text: text };
    if (account != false) answerdetail.ans_by = account.username;
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (ans_comments != false) answerdetail.ans_comments = ans_comments;

    let answer = new Answer(answerdetail);
    let answersaved = await answer.save();
    account.answers.push(answersaved);
    let acc = await account.save();
    return answersaved;
}

async function questionCreate(title, summary, text, tags, answers, account, ask_date_time, views, comments) {
    qstndetail = {
        title: title,
        summary: summary,
        text: text,
        tags: tags,
        asked_by: account.username,
    }

    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
    if (comments != false) qstndetail.comments = comments;
    let question = new Question(qstndetail);
    let questionsaved = await question.save();
    account.questions.push(questionsaved);
    let acc = await account.save();
    return questionsaved;
}

const init = async () => {
    let admin = await createAdmin(email, password);
    let acc1 = await createAccount('shallen', 'hi@stonybrook.edu', '123456', 100);
    let acc2 = await createAccount('TESTING', 'test@gmail.com', '123456', 30);
    let t1 = await tagCreate('react', acc1);
    let t2 = await tagCreate('javascript', acc2);
    let t3 = await tagCreate('android-studio', acc2);
    let c1 = await commentCreate('Comment. ', acc1, false);
    let c2 = await commentCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', acc1, false);
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', acc1, false, [c1]);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', acc2, false, false);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', acc1, false, false);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', acc1, false, false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', acc1, false, false);
    let question1 = await questionCreate('Programmatically navigate using React router', 'summary','the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',[t1, t2], [a1, a2], acc1, false, false, false);
    let question2 = await questionCreate('android studio save string shared preference,','summar', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t2], [a3, a4, a5], acc2, false, 121, [c2]);
    if(db) db.close();
    console.log('done');
  }

init()
    .catch(err => {
        console.log(err);
        if (db) db.close();
    });

