/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Group = require('../api/group/group.model');
var Question = require('../api/question/question.model');
var Game = require('../api/game/game.model');


Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

Question.find({}).remove(function(){
  Question.create({
    questionType:'Sort',
    questionOption: {optionA: 'This is optionA', optionB: 'This is optionB'}
  },{
    questionType: 'Order',
    questionText: 'This is the text for an order question'
  },{
    questionType: 'Match',
    questionText: 'This is the text for a match question'
  },{
    questionType:'Sort',
    questionOption: {optionA: 'A', optionB: 'B'},
    questionText: "Would you rather A or B?",
    sortType: "would"
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  },{
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

// Game.find({}).remove(function() {});

Group.find({}).remove(function() {
 Group.create({
   groupName: "tester",
   users: ["Mike", "Jaimie", "Summer", "Christian", "Andrew", "Gabe", "Omer", "Justin"],
   questionsArr: [{
     question: "1",
     // answersArr: [{user: "Mike", answer: "William"}, {user: "Jaimie", answer: "Chloe"}, {user: "Summer", answer: "Michiko"}, {user: "Christian", answer: "Dean"}, {user: "Andrew", answer: "Michael"}, {user: "Gabe", answer: "Laurence"}, {user: "Omer", answer: "Arie"}, {user: "Justin", answer: "Blake"}]
     answersArr: [{user: "Mike", answer: "A"}, {user: "Jaimie", answer: "A"}, {user: "Summer", answer: "A"}, {user: "Christian", answer: "B"}, {user: "Andrew", answer: "A"}, {user: "Gabe", answer: "B"}, {user: "Omer", answer: "B"}, {user: "Justin", answer: "A"}] 
   }]
 })
}, function() {
 console.log("it worked!");
});


