const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    image: {
        type: String,
    },
    places: [{
        type: ObjectId,
        required: true,
        ref: 'Place'
    }]
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema);