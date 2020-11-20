const contextManager = require('./contextManager');

module.exports = function responseBodyProcessor (req, responseExpression, resourceIds) {
    const BODY_FILE_PREFIX = '${file}';
    const SCRIPT_FILE_PREFIX = '${script}';

    if (typeof responseExpression.body === 'string' && responseExpression.body.startsWith(BODY_FILE_PREFIX)) {
        responseExpression.body = contextManager.getResponse([responseExpression.body.substr(BODY_FILE_PREFIX.length)]);
    } else if (typeof responseExpression.body === 'string' && responseExpression.body.startsWith(SCRIPT_FILE_PREFIX)) {
        const scriptName = responseExpression.body.substr(SCRIPT_FILE_PREFIX.length);
        const data = {
            path: req.path,
            body: req.body,
            query: req.query,
            resourceIds
        };
        const retrievedFunction = contextManager.getScript(scriptName);
        responseExpression.body = retrievedFunction(data);
    }

    return responseExpression;
}