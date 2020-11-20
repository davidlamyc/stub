const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const yargs = require('yargs');

const contextManager = require('./src/contextManager');
const stubProcessor = require('./src/stubProcessor');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get configs (i.e. rules, responses relative destination) from file specified in CLI command
const args = yargs.argv;
const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), args._[0]), { encoding: "utf8" }));

// Get port
const port = config.port;

// Build absolute glob paths for rules and responses
const rulesGlob = path.resolve(process.cwd(), config.rules);
const responsesGlob = path.resolve(process.cwd(), config.responses);

// Initialise rules and responses context
contextManager.initRulesAndResponses(rulesGlob, responsesGlob);

// Set up stub proccesor middleware
app.use(stubProcessor);

app.listen(port, () => console.log(`Stub server listening on port ${port}`));

