const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const {sendResponse} = require("../../util/function");


module.exports.handler = async (event) => {
    try {
        let data = await docClient.get({
            TableName: 'car-table-dev',
            Key:{
                userId: event.requestContext.authorizer.claims.sub,
                license_plate: event.pathParameters.id
            }
        }).promise();

        return sendResponse(200,{data});

    }catch (err) {
        if (err) return sendResponse(err.statusCode, err);
    }
}