const { connect, Document } = require('../index');
const Joi = require('@hapi/joi');

connect('nedb://memory')
  .then(db => {
    class Ghostbuster extends Document {
      constructor() {
        super();
        this.schema({
          name: {
            type: Object,
            validate: Joi.object().keys({
              first: Joi.string(),
              last: Joi.object().keys({ middle: Joi.string().required() })
            })
          },
          email: Joi.string().required()
        });
      }
    }
    const venkman = Ghostbuster.create({
      name: { first: 'Peter', last: {middle:true} }
    });
    console.log(venkman);
    return venkman.save();
  })
  .then(ghostbuster => console.log(ghostbuster))
  .catch(error => console.log('error', error.message));
