const {
    connectMongoDB
} = require("../mongodb");


async function mobile() {
    return await connectMongoDB("mobile");
}


module.exports = {
    mobile
};