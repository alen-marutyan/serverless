const AWS = require('aws-sdk');
const {sendResponse} = require("../../util/function");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        await docClient.delete({
            TableName: "car-table-dev",
            Key: {
                userId: event.requestContext.authorizer.claims.sub,
                license_plate: event.pathParameters.id
            },
        }).promise();

        return sendResponse(200, 'Car deleted!');
    }catch (err) {
        return sendResponse(err.statusCode, err);
    }
}