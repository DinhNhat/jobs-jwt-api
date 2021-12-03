const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    score: { type: Number },
    type: { type: String, lowercase: true },
});

const StudentSchema = new mongoose.Schema({
    _id: Number,
    name: {
        type: String,
    },
    scores: [ScoreSchema]
}, {timestamps: true});

module.exports = mongoose.model('Student', StudentSchema);