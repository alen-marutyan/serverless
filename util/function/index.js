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


module.exports = {
    sendResponse, validateUser, validateCar
};
