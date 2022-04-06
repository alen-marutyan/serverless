const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require("../../util/function");


module.exports.handler = async (event) => {
    try {
        let data = await docClient.query({
            TableName: 'car-table-dev',
            KeyConditionExpression: "license_plate = :gsi1",
            ExpressionAttributeValues: {
                ":gsi1": event.pathParameters.id,
            },
        }).promise();

        return sendResponse(200,{data});

    }catch (err) {
        if (err) return sendResponse(err.statusCode, err);
    }
}

