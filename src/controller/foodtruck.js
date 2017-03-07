import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

import {authenticate} from '../middleware/authMiddleware';
 // add "authenticate," to any route to secure it

export default({config,db}) => {
 let api = Router();
 
 // ADD /v1/foodtruck/add

 api.post('/add',(req,res) => {
     let newFoodTruck = new FoodTruck();
     newFoodTruck.name = req.body.name;
     newFoodTruck.foodtype = req.body.foodtype;
     newFoodTruck.avgcost = req.body.avgcost;
     newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;
     
     newFoodTruck.save(err => {
       if(err){
           res.send(err);
       }
       
        res.json({message: "FoodTruck saved successfully."});
        
     });
 });
 
 // FIND ALL /v1/foodtruck/
 api.get('/',(req,res) => { 
     FoodTruck.find({},(err,foodtrucks) => {
         if(err){
             res.send(err);
         }
         
        res.json(foodtrucks);
         
     })
 });
 
 // FIND ONE /v1/foodtruck/:id
 api.get('/:id',(req,res) => {
    FoodTruck.findById(req.params.id,(err, foodtruck) => {
        if(err){
             res.send(err);
         }
         
        res.json(foodtruck);
    }); 
 });
 
 // UPDATE /v1/foodtruck/:id
 api.put('/:id',(req,res) => {
     FoodTruck.findById(req.params.id,(err, foodtruck) => {
         if(err){
             res.send(err);
         }
         
         foodtruck.name = req.body.name;
         foodtruck.foodtype = req.body.foodtype;
         foodtruck.avgcost = req.body.avgcost;
         foodtruck.geometry.coordinates = req.body.geometry.coordinates;
         
         foodtruck.save(err => {
             if(err){
                 res.send(err);
             }
             res.json({message: 'FoodTruck updated successfully.'});
         });
     });
 });
 
  // DELETE /v1/foodtruck/:id
 api.delete('/:id',(req,res) => {
    FoodTruck.remove({
        _id: req.params.id
    }, (err, foodtruck) =>{
        if(err){
            res.send(err);
        }
        res.json({message: 'FoodTruck removed successfully.'});
    });
 });
 
 // ADD /v1/foodtruck/reviews/add
 api.post('/reviews/:id',(req,res) => {
     // find foodtruck to add the review to
     FoodTruck.findById(req.params.id,(err,foodtruck) => {
        if(err){
            res.send(err);
        }
        // create new instance of review
        let newReview = new Review();
        // fill it with review data from req
        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.foodtruck = foodtruck._id;
        // save review
        newReview.save((err,review) => {
            if(err){
                res.send(err);
            }
             // push review to foodtruck's review array
            foodtruck.reviews.push(newReview);
            // save foodtruck with new review
            foodtruck.save(err => {
                if(err){
                    res.send(err);
                } 
                res.json({message: 'Food truck review saved.'});
            });
        });
     });
 });
 
 // FIND REVIEWS
 api.get('/reviews/:id', (req,res) => {
    Review.find({foodtruck: req.params.id},(err, reviews) => {
        if(err){
            res.send(err);
        }
        res.json(reviews);
    });
 });
 
 return api;
}