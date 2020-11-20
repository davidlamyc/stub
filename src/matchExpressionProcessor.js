const jp = require('jsonpath');

const JSONPATH_PREFIX = '${jsonpath}';

function evaluateBody(rule, requestBody) {
    let matchedValues = [];
    const ruleKeyShort = rule.key.substr(JSONPATH_PREFIX.length);
    const reqBodyObj = typeof requestBody === 'object' ? requestBody : JSON.parse(requestBody);
    matchedValues = jp.query(reqBodyObj, ruleKeyShort);

    let success = false;
    return success = matchedValues.length !== 0 && matchedValues.filter(v => v === rule.value).length === matchedValues.length;
}

function evaluateObject(rule, obj) {
    const ruleValueString = String(rule.value);
    let success = false;
    return success = obj && obj[rule.key] && obj[rule.key] === ruleValueString;
}

module.exports = function matchExpressionProcesser (req, matchedRule) {
    let result = {};

    // Each 'matchExpression' object has a 'request' array, aside from the default response matchExpression
    // Assess if all 'request' rules fit the actual request
    matchedRule.matchExpressions.forEach(matchExpression => {
        // If request property did not exist on expression object, the empty array prevents erroring out
        (matchExpression.request || []).forEach(requestRule => {
            switch (requestRule.type.toLowerCase()) {
                case 'body':
                    requestRule.matched = evaluateBody(requestRule, req.body);
                    break;
                case 'query':
                    requestRule.matched = evaluateObject(requestRule, req.query);
                    break;
                case 'resourceid':
                    requestRule.matched = evaluateObject(requestRule, matchedRule.resourceIds);
                    break;
                default:
                    throw new Error('Invalid request rule type.');
            }
        });
        const ruleCount = (matchExpression.request || []).length;
        const ruleMatched = (matchExpression.request || []).filter(
            requestRule => requestRule.matched
        ).length;

        if (ruleMatched !== ruleCount) {
            return; // Go to next iteration
        }

        // For 'request's where all rules are matched, store the 'request' with the biggest length
        if (Object.keys(result).length === 0) {
            result = Object.assign({}, matchExpression);
        } else {
            if (matchExpression.request) {
                if ((result.request || []).length < matchExpression.request.length) {
                    result = Object.assign({}, matchExpression);
                }
            }
        }
    })

    return result.response;
}