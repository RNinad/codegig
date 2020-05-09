const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; 

// Get gig list
router.get('/', (req, res) => 
    Gig.findAll()
        .then(gigs => res.render('gigs', {
                gigs
        }))
        .catch(err => console.log(err)));

// Display add gig form
router.get('/add', (req,res) => {
    res.render('add')
});

// Add a gig
router.post('/add', (req,res) => {
    
    let {title, technology, budget, description, contact_email} = req.body;
    let errors = [];

    //Validate fields
    if (!title) {
        errors.push({text: 'Please add a title'});
    }
    if (!technology) {
        errors.push({text: 'Please add some techonologies'});
    }
    if (!description) {
        errors.push({text: 'Please add a description'});
    }
    if (!contact_email) {
        errors.push({text: 'Please add a contact Email'});
    }

    //Check for errors
    if (errors.length > 0){
        res.render('add', {
            errors,
            title,
            technology,
            description,
            budget,
            contact_email
        })
    } else{
        if (!budget)    {
            budget = 'Unknown';
        } else {
            budget = `$${budget}`;
        }
        
        // Make lower case and remove space after comma
        technology = technology.toLowerCase().replace(/, /g, ',');

        //Insert into table
        Gig.create({
            title,
            technology,
            description,
            budget,
            contact_email
        })
            .then(gig => res.redirect('/gigs'))
            .catch(err => console.log(err));
    }

  
});

// Search for gigs
router.get('/search', (req, res)=> {
    let {term} = req.query;
    //Make lowercase
    term = term.toLowerCase();
    Gig.findAll({ where: {technology: { [Op.like]: '%'+ term + '%' } } })
        .then(gigs => res.render('gigs', { gigs }))
        .catch(err => console.log(err));
});

module.exports = router;
