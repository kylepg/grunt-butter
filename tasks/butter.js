module.exports = function(grunt) {
  'use strict'
	grunt.registerTask('kyle', 'String Replace Task', function() {
		const HeadlessChrome = require('simple-headless-chrome');
		const chokidar = require('chokidar');
		const done = this.async();

		var options = this.options({
			headless: false, // If false, you can actually see the browser navigate with your instructions. 
			drupal: {
				loginURL: "http://www.google.com", // Drupal admin login (https://admin.nba.com//<team_name>/user)
				username: "[username]",
				password: "[password]",
				nodeURL: "", // Edit node URL (http://www.nba.com/<team_name>/node/<nodeID>/edit)
				DOM: {
					login: {
					username:'#edit-name--2',
					password:'#edit-pass--2',
					submit: "#edit-submit--2"
					},
					node: {
						body: "#edit-body-und-0-value"
					}
				}
			},
			files: {
				bodyHTML: "dist/index_dev.html" // Path to the file containing your HTML code
			}
		});

		chokidar.watch('.', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
			console.log(event, path)
		});

		const watcher = chokidar.watch(options.files.bodyHTML, {
			ignored: /(^|[\/\\])\../,
			persistent: true
		});

		const browser = new HeadlessChrome({
			headless: options.headless // If you turn this off, you can actually see the browser navigate with your instructions
		});

		async function navigateWebsite() {
			await browser.init()
			await browser.goTo(options.drupal.loginURL)
			await browser.fill(options.drupal.DOM.login.username)
			await browser.fill(options.drupal.DOM.login.password)
			await browser.click(options.drupal.DOM.login.submit)
			done()
		};

		watcher.on('change', async() => {
			await browser.goTo("snha")
			await browser.focus(options.drupal.DOM.node.body)
			await browser.setValue(options.drupal.DOM.node.body, "testeaaaa")
			console.log("CHANGED")
		});

		navigateWebsite();
  });
}
