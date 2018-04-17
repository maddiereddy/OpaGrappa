const express = require('express');
const { Wine } = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

const router = express.Router();
router.use(jwtAuth);

// get all top 20 wines
router.get('/', (req, res) => {
  Wine
    .find().limit(20)
    .then(wines => {
      res.json(wines.map(wine => wine.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET' });
    });
});

// get all states in wines table
router.get('/states', (req, res) => {
  Wine
    .distinct('province')
    .then(states => {
      res.json(states.sort());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/states' });
    });
});

// get all regions for a given state 
router.get('/regions/:state', (req, res) => {
  Wine
    .distinct('region_2', {'province': req.params.state})
    .then(regions => {
      res.json(regions.sort());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/regions/state' });
    });
});

// get all wineries for a given region
router.get('/wineries/:region', (req, res) => {
  Wine
    .distinct('winery', {'region_2': req.params.region})
    .then(wineries => {
      res.json(wineries.sort());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/wineries/region' });
    });
});

// get all wines for a given winery
router.get('/list/:winery', (req, res) => {
  Wine
    .find({'winery': req.params.winery})
    .then(wines => {
      res.json(wines.map(wine => wine.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/lisr/winery' });
    });
});

// get a wine by its id
router.get('/:id', (req, res) => {
  Wine
    .findById(req.params.id)
    .then(wine => res.json(wine.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/:id' });
    });
});


module.exports = {router};