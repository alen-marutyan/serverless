const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require("../../util/function");


module.exports.handler = async (event) => {
    try {
        let data = await docClient.query({
            TableName: 'car-table-dev',
            IndexName: "plate",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": event.requestContext.authorizer.claims.sub,
            }
        }).promise();

        return sendResponse(200,{data});

    }catch (err) {
        if (err) return sendResponse(err.statusCode, err);
    }
}