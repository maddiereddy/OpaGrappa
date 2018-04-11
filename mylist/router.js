const express = require('express');
const { MyList } = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

const router = express.Router();
//router.use(jwtAuth);

// get list
router.get('/', (req, res) => {
  MyList
    .find()
    .then(wines => {
      res.json(wines.map(wine => wine.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET' });
    });
});

// get list item by id
router.get('/:id', (req, res) => {
  MyList
    .findById(req.params.id)
    .then(wine => res.json(wine.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/:id' });
    });
});

// add new item to list
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['wineId', 'name', 'description', 'cost', 'rating', 'type', 'region', 'state', 'winery'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let {userId, wineId, name, description, cost, rating, type, region, state, winery, comments} = req.body;
  return MyList.find({userId, wineId, name})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Selected wine already on your list.',
        });
      }
    return {userId, wineId, name, description, cost, rating, type, region, state, winery, comments};
  }).then(newItem => {
    console.log(newItem);
    return MyList.create(newItem);
  }).then( created => {
    return res.status(201).json(created.serialize());
  })
  .catch(err => {
    res.status(err.code).json(err);
  });

});

// update item by id
router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['comments'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  MyList
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error: PUT/:id' });
    });
});

// delete item by id
router.delete('/:id', (req, res) => {
  MyList
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error: DELETE/:id' });
    });
});


module.exports = {router};