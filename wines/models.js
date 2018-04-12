'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const WineSchema = mongoose.Schema({
	title: {
    type: String,
    required: true
  },
  description: { 
  	type: String,
    default: ""
  },
  points: { 
  	type: String,
    default: ""
  },
  price: { 
  	type: String,
    default: ""
  },
  designation: { 
  	type: String,
    default: ""
  },
  variety: { 
  	type: String,
    default: ""
  },
  region_1: { 
  	type: String,
    default: ""
  },
  region_2: { 
  	type: String,
    default: ""
  },
  province: { 
  	type: String,
    default: ""
  },
  country: { 
  	type: String,
    default: ""
  },
  winery: { 
  	type: String,
    default: ""
  }
});


WineSchema.virtual('cost').get(function() {
    return (`$${this.price}`);
});

WineSchema.virtual('rating').get(function() {
    return (`${this.points} pts`);
});

WineSchema.methods.serialize = function() {
  return {
    wineId: this._id,
    name: this.title,
    description: this.description,
    cost: this.cost,
    rating: this.rating,
    type: this.variety,
    region: this.region_2,
    state: this.province,
    winery: this.winery
  };
};

const Wine = mongoose.model('Wine', WineSchema, "wines_us");

module.exports = {Wine};
