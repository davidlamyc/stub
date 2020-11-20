const contextManager = require('./contextManager');
const UrlPattern = require('url-pattern');

module.exports = function ruleMatcher (req) {
    const rules = contextManager.getRules();

    rules.forEach(rule => {
        const resourceIds  = new UrlPattern(rule.resourcePath).match(req.path);
        if (rule.resourcePath === req.path && rule.method === req.method) {
            rule.rank = 2;
        } else if (resourceIds && rule.method === req.method) {
            rule.resourceIds = resourceIds;
            rule.rank = 1;
        } else {
            rule.rank = 0;
        }
    });

    const matchedRule = rules.reduce((prev, curr) => (prev.rank > curr.rank ? prev : curr));

    if (matchedRule.rank < 1) throw new Error('No rule matched.');

    return matchedRule;
    
}
