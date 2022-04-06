const AWS = require('aws-sdk')
const { sendResponse, validateCar} = require("../../util/function");
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'car-table-dev';
const uuid = require('uuid');

module.exports.handler = async (event)=>{
    try {
        const {license_plate, model, brand } = JSON.parse(event.body)

        if (!validateCar(license_plate,model, brand)){
            return sendResponse(500, 'Error Validate' )
        }

        let params = {
            TableName: table,
            ConditionExpression: "attribute_not_exists(license_plate)",
            Item: {
                license_plate: license_plate.toLowerCase(),
                carId: uuid.v4(),
                model: {
                    modelId: uuid.v4(),
                    name: model
                },
                brand: {
                    brandId: uuid.v4(),
                    name: brand
                },
                userId: event.requestContext.authorizer.claims.sub
            }
        }

        await docClient.put(params).promise()
        return sendResponse(200, params.Item)

    }catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}