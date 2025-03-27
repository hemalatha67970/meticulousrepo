module.exports = {
    testEnvironment: 'jsdom',  // Set the test environment to jsdom
    testEnvironmentOptions: {
      url: 'http://localhost:3000/',  // Set the URL to localhost:3000
    },
    watchPlugins: [
      "jest-watch-typeahead/filename",  // Plugin to filter by filename
      "jest-watch-typeahead/testname"   // Plugin to filter by test name
    ],
    // Other Jest configurations...
  };
  