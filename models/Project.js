const mongoose = require('mongoose');


const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'Please add Project Name'],
    },
    image: {
        type: String,
        required: [true, 'Please add Image'],
    },
    societyId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Society',

    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    bankId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bank',
    }
});


module.exports = mongoose.model('Project', ProjectSchema);