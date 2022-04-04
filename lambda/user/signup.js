const AWS = require('aws-sdk')
const { sendResponse, validateUser} = require("../../util/function");
const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body)
        const { user_pool_id } = process.env

        if (!validateUser(email,password)){
            return sendResponse(500, 'Error Validate' )
        }

        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                }],
            MessageAction: 'SUPPRESS'
        }
        const response = await cognito.adminCreateUser(params).promise();

        console.log('response', response)

        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                Permanent: true
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
        return sendResponse(200, { message: 'User registration successful' })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}