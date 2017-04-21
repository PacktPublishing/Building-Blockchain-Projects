var DefaultBuilder = require("truffle-default-builder");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "10"
    },
    live: {
    	host: "localhost",
      port: 8545,
      network_id: "1"
    }
  },
  build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
      "javascripts/index.js"
    ],
    "bootstrap.min.css": "stylesheets/bootstrap.min.css"
  })
};