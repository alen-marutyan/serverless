const AWS = require('aws-sdk');
const {sendResponse, queryDb} = require("../../util/function");
const {promise} = require("zod");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        let data = await docClient.get({
            TableName: 'car-table-dev',
            Key: {
                carId: event.pathParameters.id,
            }
        }).promise();

        await docClient.delete({
            TableName: 'car-table-dev',
            Key: {
                carId: `license_plate#${data.Item.license_plate}`
            }
        }).promise();

        await docClient.delete({
            TableName: "car-table-dev",
            Key: {
                carId: event.pathParameters.id,
            },
        }).promise();

        return sendResponse(200, 'Car deleted!');
    }catch (err) {
        return sendResponse(err.statusCode, err);
    }
}