const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({

	hid: {
		type: String,
		required: true
	},
	chunk: {
		type: String, 
		required: true
	},
	hasSpace: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("data", DataSchema);
