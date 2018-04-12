'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MyListSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  wineId: {
    type: String,
    required: true
  },
	name: {
    type: String,
    required: true
  },
  description: { 
  	type: String,
    default: ""
  },
  rating: { 
  	type: String,
    default: ""
  },
  cost: { 
  	type: String,
    default: ""
  },
  type: { 
  	type: String,
    default: ""
  },
  region: { 
  	type: String,
    default: ""
  },
  state: { 
  	type: String,
    default: ""
  },
  winery: { 
  	type: String,
    default: ""
  },
  comments: {
    type: String,
    default: ""
  }
});


MyListSchema.methods.serialize = function() {
  return {
    id: this._id,
    userId: this.userId,
    wineId: this.wineId,
    name: this.name,
    description: this.description,
    cost: this.cost,
    rating: this.rating,
    type: this.type,
    region: this.region,
    state: this.state,
    winery: this.winery,
    comments: this.comments
  };
};

const MyList = mongoose.model('MyList', MyListSchema, "my_list");

module.exports = {MyList};
