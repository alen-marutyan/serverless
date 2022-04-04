const AWS = require('aws-sdk')
const {sendResponse} = require("../../util/function");
const docClient = new AWS.DynamoDB.DocumentClient();

const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.handler = async (event) => {
    try {
        let data = await docClient.query({
            TableName: 'car-table-dev',
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": event.requestContext.authorizer.claims.sub,
            }
        }).promise();


        data.Items.forEach(el=>{
             docClient.delete({
                TableName: 'car-table-dev',
                Key: {
                    userId: event.requestContext.authorizer.claims.sub,
                    license_plate: el.license_plate
                }
            }).promise();
        })


        const { user_pool_id } = process.env



        console.log('data', data)

            await cognito.adminDeleteUser({
                UserPoolId: user_pool_id,
                Username: event.requestContext.authorizer.claims.email
            }).promise();
            return sendResponse(200, { message: 'User deleted' })




    }catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })    }
}