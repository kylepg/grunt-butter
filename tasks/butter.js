module.exports = function(grunt) {
  'use strict'
	grunt.registerTask('butter', 'Automatically update/publish a node body in Drupal (via Headless Chrome).', function() {
		const HeadlessChrome = require('simple-headless-chrome');
		const chokidar = require('chokidar');
		const done = this.async();

		var options = this.options({
			headless: true, // Set false to actually see the browser navigate with your instructions. 
			drupal: {
				loginURL: "http://www.google.com", // Drupal admin login (https://admin.nba.com/<team_name>/user)
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
						body: "#edit-body-und-0-value",
						submit: "#edit-save-publish"
					}
				}
			},
			files: {
				bodyPath: "dist/index_dev.html" // Path to the file containing your HTML code
			}
		});

		chokidar.watch('.', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
			console.log(event, path)
		});

		const watcher = chokidar.watch(options.files.bodyPath, {
			ignored: /(^|[\/\\])\../,
			persistent: true
		});

		const browser = new HeadlessChrome({
			headless: options.headless // If you turn this off, you can actually see the browser navigate with your instructions
		});

		async function navigateWebsite() {
			await browser.init();
			await browser.goTo(options.drupal.loginURL);
			await browser.fill(options.drupal.DOM.login.username, options.drupal.username);
			await browser.fill(options.drupal.DOM.login.password, options.drupal.password);
			await browser.click(options.drupal.DOM.login.submit);
		};

		watcher.on('change', async() => {
			var twirlTimer = (function() {
			  return setInterval(function() {
			    process.stdout.write("\r" + ".");
			  }, 200);
			})();
			var body = grunt.file.read(options.files.bodyPath);
			await browser.goTo(options.drupal.nodeURL);
			await browser.focus(options.drupal.DOM.node.body);
			await browser.setValue(options.drupal.DOM.node.body, body);
			await browser.click(options.drupal.DOM.node.submit);
			await browser.wait(3000);
			clearInterval(twirlTimer);
			grunt.log.ok('NODE UPDATED'['green'].bold);
		});

		navigateWebsite();
  });
}
