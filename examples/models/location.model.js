const Joi = require('@hapi/joi');
const { Document } = require('../../index');

class Location extends Document {
  constructor() {
    super();
    const { Ghost } = require('./ghost.model');
    this.schema({
      name: Joi.string().required(),
      ghosts: [Ghost]
    });
  }

  preInit() {
    this.ghosts = [];
  }
}

module.exports = { Location };
