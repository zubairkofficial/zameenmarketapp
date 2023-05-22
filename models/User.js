const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
        required: [true, 'Please add a Phone Number'],
    },
    ntn: {
        type: String,
        required: [true, 'Please add NTN'],
    },
    cnic: {
        type: String,
        required: [true, 'Please add CNIC'],
    },
    cnic_front: {
        type: String,
        required: [true, 'Please add Front Picture'],
    },
    cnic_back: {
        type: String,
        required: [true, 'Please add CNIC Back Picture'],
    },
    address: {
        type: String,
        required: [true, 'Please add Address'],
    },
    status: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);