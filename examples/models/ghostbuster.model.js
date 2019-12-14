const Joi = require('@hapi/joi');
const { Ghost } = require('./ghost.model');
const { Document } = require('../../index');

class Ghostbuster extends Document {
  constructor() {
    super();
    this.schema({
      name: {
        type: Object,
        validate: Joi.object().keys({
          first: Joi.string(),
          last: Joi.string()
        })
      },
      trapped: {
        type: [Ghost],
        default: () => []
      },
      email: Joi.string().required()
    });
  }

  trap({ name }, location) {
    return Ghost.findOne(['name', '==', 'slimer']).then(ghost => {
      console.log('trap query result', ghost);
      if (!ghost) {
        return new Error('No Ghost');
      } else {
        console.log('trapped',this.trapped)
        this.trapped.push(ghost);
        ghost.trapped = true;
        return Promise.all([this.save()]);
      }
    });
  }
}

module.exports = { Ghostbuster };
