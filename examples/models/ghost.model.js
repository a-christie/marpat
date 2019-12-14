const Joi = require('@hapi/joi');
const { Document } = require('../../index');

class Ghost extends Document {
  constructor() {
    super();
    const { Location } = require('./location.model');
    this.schema({
      name: Joi.string().required(),
      location: Location,
      trapped: Boolean,
      color: {
        type: String,
        default: () => 'Blob Creature'
      },
      malevolence: {
        type: Number,
        validate: Joi.number()
          .min(0)
          .max(10)
          .required()
      }
    });
  }

  haunt(location) {
    location.ghosts.push(this);
    this.location = location;
    return Promise.all([location.save(), this.save()]);
  }
}

module.exports = { Ghost };
