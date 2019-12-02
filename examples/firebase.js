const admin = require('firebase-admin');
const Joi = require('@hapi/joi');
const { connect, Document } = require('../index');
const serviceAccount = require('./service-account.json');

connect({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://marpat-c037f.firebaseio.com'
})
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
      name: { first: 'Peter', last: { middle: true } }
    });
    console.log(venkman);
    return venkman.save();
  })
  .then(ghostbuster => console.log(ghostbuster))
  .catch(error => console.log('error', error.message));
