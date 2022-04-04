const AWS = require('aws-sdk')
const { sendResponse, validateCar} = require("../../util/function");
const docClient = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports.handler = async (event) => {
    try {
        const {license_plate, model, brand } = JSON.parse(event.body)

        if (!validateCar(license_plate,model, brand)){
            return sendResponse(500, 'Error Validate' );
        }

        const params = {
            TableName: "car-table-dev",
            Key: {
                userId: event.requestContext.authorizer.claims.sub,
                license_plate: event.pathParameters.id
            },
            UpdateExpression: "set brand = :b, model = :m",
            ExpressionAttributeValues: {
                ":m": {
                    brandId: uuid.v4(),
                    name: model
                },
                ":b": {
                    brandId: uuid.v4(),
                    name: brand
                },
            },
            ReturnValues: "ALL_NEW",
        };

        let data = await docClient.update(params).promise();
        return sendResponse(200,{data});
    }catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })    }
}