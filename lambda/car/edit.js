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

        await docClient.put({
            TableName: 'car-table-dev',
            Item: {
                carId: `license_plate#${license_plate}`,
            }
        }).promise();

        const params = {
            TableName: "car-table-dev",
            Key: {
                carId: event.pathParameters.id,
            },
            UpdateExpression: "set license_plate = :l, brand = :b, model = :m",
            ExpressionAttributeValues: {
                ":l": license_plate,
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

        let result = await docClient.update(params).promise();
        return sendResponse(200,{result});
    }catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })    }
}