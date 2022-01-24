const TestModel = require('../models/test.model');

const getData = (req, res) => res.send(TestModel.TestData);

exports.get = getData;
