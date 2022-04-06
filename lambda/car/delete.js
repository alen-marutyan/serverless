const AWS = require('aws-sdk');
const {sendResponse, queryDb} = require("../../util/function");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {

        // let result = await docClient.query({
        //     TableName: 'car-table-dev',
        //     IndexName: "plate",
        //     KeyConditionExpression: "license_plate = :gsi1",
        //     ExpressionAttributeValues: {
        //         ":gsi1": event.pathParameters.id,
        //     },
        // }).promise();
        //

        await docClient.delete({
            TableName: "car-table-dev",
            Key: {
                license_plate: event.pathParameters.id,
            },
        }).promise();

        return sendResponse(200, 'Car deleted!');
    }catch (err) {
        return sendResponse(err.statusCode, err);
    }
}