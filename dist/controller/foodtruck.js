'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _foodtruck = require('../model/foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// add "authenticate," to any route to secure it

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // ADD /v1/foodtruck/add

    api.post('/add', function (req, res) {
        var newFoodTruck = new _foodtruck2.default();
        newFoodTruck.name = req.body.name;
        newFoodTruck.foodtype = req.body.foodtype;
        newFoodTruck.avgcost = req.body.avgcost;
        newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

        newFoodTruck.save(function (err) {
            if (err) {
                res.send(err);
            }

            res.json({ message: "FoodTruck saved successfully." });
        });
    });

    // FIND ALL /v1/foodtruck/
    api.get('/', function (req, res) {
        _foodtruck2.default.find({}, function (err, foodtrucks) {
            if (err) {
                res.send(err);
            }

            res.json(foodtrucks);
        });
    });

    // FIND ONE /v1/foodtruck/:id
    api.get('/:id', function (req, res) {
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
            if (err) {
                res.send(err);
            }

            res.json(foodtruck);
        });
    });

    // UPDATE /v1/foodtruck/:id
    api.put('/:id', function (req, res) {
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
            if (err) {
                res.send(err);
            }

            foodtruck.name = req.body.name;
            foodtruck.foodtype = req.body.foodtype;
            foodtruck.avgcost = req.body.avgcost;
            foodtruck.geometry.coordinates = req.body.geometry.coordinates;

            foodtruck.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'FoodTruck updated successfully.' });
            });
        });
    });

    // DELETE /v1/foodtruck/:id
    api.delete('/:id', function (req, res) {
        _foodtruck2.default.remove({
            _id: req.params.id
        }, function (err, foodtruck) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'FoodTruck removed successfully.' });
        });
    });

    // ADD /v1/foodtruck/reviews/add
    api.post('/reviews/:id', function (req, res) {
        // find foodtruck to add the review to
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
            if (err) {
                res.send(err);
            }
            // create new instance of review
            var newReview = new _review2.default();
            // fill it with review data from req
            newReview.title = req.body.title;
            newReview.text = req.body.text;
            newReview.foodtruck = foodtruck._id;
            // save review
            newReview.save(function (err, review) {
                if (err) {
                    res.send(err);
                }
                // push review to foodtruck's review array
                foodtruck.reviews.push(newReview);
                // save foodtruck with new review
                foodtruck.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'Food truck review saved.' });
                });
            });
        });
    });

    // FIND REVIEWS
    api.get('/reviews/:id', function (req, res) {
        _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
            if (err) {
                res.send(err);
            }
            res.json(reviews);
        });
    });

    return api;
};
//# sourceMappingURL=foodtruck.js.map