const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const Data = require('./models/Data');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
 Connects to the mlab account for MongoDB
*/
mongoose.Promise = global.Promise;
const db = require("./config/keys").mongoUri;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('MongoDB succesfully connected to mLab'))
	.catch(error => console.log(`Error connecting to mLab: ${error}`));

/**
 Base Route 
 Sends the index.html from the public folder to the client.
 @param req: request Object
 @param res: response Object
*/
app.get('/', (req,res) => {
	res.sendFile(__dirname + '/public/main.html');
});

/**
 Route @POST
 Return back a bad client request if object with the given hid is already present else create a new object and store in the database. Return back the new object to client.
 @param req: request Object
 @param res: response Object
*/
app.post('/data', (req,res) => {
	console.log('inside post route');
	const {hid,chunk,hasSpace} = req.body;
	let payload = {};
	Data
		.findOne({hid: hid})
		.then(data => {
			if(data) {
				payload.status = 400;
				payload.message = `Object with hid = ${hid} already exists.`;
				return res.status(400).json(payload);
			}
			const newData = new Data({hid:hid,chunk:chunk,hasSpace:hasSpace});
			console.log(newData);
			newData
				.save()
				.then(data => {
					payload.status = 200;
					payload.message = (({hid, chunk, hasSpace}) => ({hid, chunk, hasSpace}))(newData);;
					return res.status(200).json(payload); 
				})
				.catch(err => {
					payload.status = 500;
					payload.message = `Internal server error in save`;
					return res.status(500).json(payload);
				});
		})
		.catch(err => {
			payload.status = 500;
			payload.message = `Internal server error`;
			return res.status(500).json(payload);
		});
});

/**
 Route @GET
 Return the object with the requested hid if it is present in the database. If it is not present, return back a 404(Not Found) status to the client.
 @param req: request Object
 @param res: response Object
*/
app.get('/data/:hid', (req,res) => {
	console.log('inside get route');
	const {hid} = req.params;
	let payload = {};
	Data
		.findOne({hid: hid})
		.then(data => {
			if(!data) {
				payload.message = `No data found for hid ${hid}`;
				payload.status = 404;
				return res.status(404).json(payload);
			}
			payload.status = 200;
			payload.message = (({hid, chunk, hasSpace}) => ({hid, chunk, hasSpace}))(data);
			res.status(200).json(payload);
		})
		.catch(err => {
			payload.status = 500;
			payload.message = `Internal server error`;
			return res.status(500).json(payload);
		});
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Node Server running on port ${PORT}`))
