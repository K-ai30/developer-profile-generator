const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML");
const convertFactory = require('electron-html-to');

console.log('Process PID: ', process.pid);

const questions = [
  {
      type: "input",
      message: "What's your GitHub Username?",
      name: "username"
  },
  {
      type: "list",
      message: "What is your favorite color?",
      name: "colorChoice",
      choices: ["red", "blue", "green", "pink"]
  }
];

init();

function init() {

    const data = {};
    
    inquirer
    .prompt(questions)
    .then(answers => {
        console.log("Answers: ", answers);
        // Use user's data to populate HTML and PDF
        // Use "answers.colorChoice" to save data for later and pass it to the generateHTML function
        data.color = answers.colorChoice;
        
        // Uses "answers.username" to make an axios call to the "/users/{USERNAME}" github api, which will give us the user's github data.
        data.username = answers.username;

        const ghURL = `https://api.github.com/users/${data.username}`;

        // Execute function
        axios.get(ghURL).then(response => {
            //take properties from the response and add them to our data object
            data.avatar_url = response.data.avatar_url;
            data.name = response.data.name;
            data.company = response.data.company;
            data.location = response.data.location;
            data.bio = response.data.location;
            data.blog = response.data.blog;
            data.public_repos = response.data.public_repos;
            data.followers = response.data.followers;
            data.following = response.data.following;

            const htmlResult = generateHTML(data);

            conversion = convertFactory({
                converterPath: convertFactory.converters.PDF
            });
            
            conversion({ html: htmlResult}, function(err, result) {
                if (err) {
                    return console.error(err);
                }
            
            result.stream.pipe(fs.createWriteStream('developerProfile.pdf'));
            conversion.kill(); // necessary if you use the electron-server strategy, see below for details
            });
            
            //we want to also use answers.username to make an axios call to a different "users/{USERNAME}/repos"
            const ghReposURL = `https://api.github.com/users/` + data.username + `/repos`; // build url the same way we did above except for the repose endpoint^^^
            
            axios.get(ghReposURL).then(response => {
                // Take properties from the repos to add to our data
            });

            const starURL = `https://api.github.com/users/` + data.username + `/starred`;
            data.stars = starCount;

            axios.get(starURL)
            .then(function(starResponse) {
                const starData = starResponse.data;
                let starCount = 0;
                for (var i = 0; i < starData.length; i++) {
                    const stargazersCount = starData[i].stargazersCount;
                    starCount += stargazersCount;
                }
            }.catch(function(error) {
                console.log('Error: ', error);
            })
    })
});
