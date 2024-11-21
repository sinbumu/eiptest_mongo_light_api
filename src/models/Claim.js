// models/Claim.js

const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    claimKey: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    Claim: {
        type: Object,
        required: true
    },
    password: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Claim', claimSchema);
