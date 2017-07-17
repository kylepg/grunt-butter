# grunt-butter

Automatically update/publish a node body in Drupal (via Headless Chrome).

###### Supported Node.js versions: v7.6.0 and up.   
#
### Install
```
npm install grunt-butter
```

### Configuration 

Inlude the following in your Gruntfile.js

```
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    kyle: {
      options: {
        headless: false, // If false, you can actually see the browser navigate with your instructions. 
        drupal: {
          loginURL: "https://www.google.com", // Drupal admin login (https://admin.nba.com//<team_name>/user)
          username: "<username>",
          password: "<password>",
          nodeURL: "<nodeURL>", // Edit node URL (http://www.nba.com/<team_name>/node/<nodeID>/edit)
          DOM: {
            login: {
              username:'#edit-name--2',
              password:'#edit-pass--2',
              submit: "#edit-submit--2"
            },
            node: {
              body: "#edit-body-und-0-value",
              submit: "#edit-save-publish"
            }
          }
        },
        files: {
          bodyPath: "dist/index_dev.html" // Path to the file containing your HTML code
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-butter');
};
```