const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let contentSchema = new Schema({
    name: { type: String },
    school: { type: String },
    desc: { type: String },
    imageUrl: { type: String },
    like: { type: Number, default: 0 },
    comment: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports.contentModel = mongoose.model('content', contentSchema);