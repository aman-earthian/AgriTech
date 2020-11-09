const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');

const commoditySchema = new Schema({
    commodity: String,
    Variety : String,
    Quantity : String,
    ExpectedPrice : String,
    description: String,
    created: { type: Date, default: Date.now },
    postedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = model('Commodity', commoditySchema);