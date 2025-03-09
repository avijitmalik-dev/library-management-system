
const crypto = require('crypto');

exports.generateSecurePassword =(name, email, phone)=>{
    const basePassword = `${phone}`;
    const randomPart = crypto.randomBytes(8).toString('hex');
    return basePassword + randomPart;
}