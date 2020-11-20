const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('js-yaml');

const context = {
    responses: {},
    rules: [],
    scripts: {}
};

function initRulesAndResponses(rulesGlob, responsesGlob) {
    initRules(rulesGlob);
    initResponses(responsesGlob); 
}

function initRules(rulesGlob) {
    const rulesFiles = glob.sync(rulesGlob);
    rulesFiles.forEach(file => {
        const rule = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        context.rules.push(rule);
    })
}

function initResponses(responsesGlob) {
    const responseFiles = glob.sync(responsesGlob);
    responseFiles.forEach(file => {
        const { ext } = path.parse(file);
        switch (ext) {
            case '.js':
                context.scripts[path.basename(file)] = require(path.resolve(file));
                break;
            case '.json':
                context.responses[path.basename(file)] = require(path.resolve(file));
                break;
            default:
                throw new Error('Invalid file type.');
          }
    })
}

function getRules() {
    return JSON.parse(JSON.stringify(context.rules));
}

function getScript(scriptName) {
    return context.scripts[scriptName];
}

function getResponse(response) {
    return context.responses[response];
}

module.exports = {
    initRulesAndResponses,
    getRules,
    getScript,
    getResponse
}
  