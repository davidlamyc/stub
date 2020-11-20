const ruleMatcher = require('./ruleMatcher');
const matchExpressionProcessor = require('./matchExpressionProcessor');
const responseBodyProcessor = require('./responseBodyProcessor');

module.exports = function processor (req, res) {
    // Fetch rule that matches http method AND (resource path OR url pattern) as defined in yaml files
    const matchedRule = ruleMatcher(req);

    // Processes matchExpression array and fetches response expression (containing header, status code and body file data)
    const responseExpression = matchExpressionProcessor(req, matchedRule);

    // Adds actual response body as defined in json or js file to the response expression
    const responseExpressionWithBody = responseBodyProcessor(req, responseExpression, matchedRule.resourceIds);

    (responseExpressionWithBody.headers || []).forEach(header => res.set(header.key, header.value));

    (responseExpressionWithBody.cookies || []).forEach(cookie =>
      res.append('Set-Cookie', `${cookie.key}=${cookie.value}`)
    );

    res.status(responseExpressionWithBody.status || '200').send(responseExpressionWithBody.body);
}