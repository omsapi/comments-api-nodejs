var mongoose = require('mongoose');
var moment = require('moment');

var schema = mongoose.Schema({
    userId: String,
    relationId: String,
    relationName: String,
    content: String,
    created: {type: Date, default: moment.utc}
});

module.exports = mongoose.model('comment', schema);