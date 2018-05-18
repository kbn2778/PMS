const express = require('express');
const router = express.Router();
const models = require('../models');
const wrap = require('express-async-wrap');

router.get('/project', wrap(async (req, res, next) => {
	const projects = await models.project.findAll();
	res.send(projects);
}));

//add project
router.post('/project', wrap(async (req, res, next) => {
	try{
		const create = await models.project.create(req.body);
		res.send({
			result: true
		});
	}
	catch(e){
		res.send({
			result: false
		});
	}
}));

module.exports = router;