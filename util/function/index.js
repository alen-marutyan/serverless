const {z} = require("zod");
const sendResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body)
    }
}


const validateUser = (email,password) => {
    let User = z.object({
        email: z.string().email(),
        password: z.string()
    });
    return User.parse({email, password});
}


const validateCar = (license_plate,model,brand) => {
    let Car = z.object({
        license_plate: z.string(),
        model: z.string(),
        brand: z.string(),
    });
    return Car.parse({license_plate, model,brand});
}


const queryDb = async (docClient) =>{
    let result = await docClient.query({
        TableName: 'car-table-dev',
        IndexName: "plate",
        KeyConditionExpression: "license_plate = :gsi1",
        ExpressionAttributeValues: {
            ":gsi1": event.pathParameters.id,
        },
    }).promise();

    console.log(result)
    return result.Items[0];
}

module.exports = {
    sendResponse, validateUser, validateCar,queryDb
};
