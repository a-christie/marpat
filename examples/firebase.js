const admin = require('firebase-admin');
const { connect } = require('../index');
const { Ghost, Ghostbuster, Location } = require('./models');
const serviceAccount = require('./service-account.json');

connect({
  credential: admin.credential.cert(serviceAccount)
})
  .then(db => {
    const ghostbuster = Ghostbuster.create({
      name: { first: 'Peter', last: 'Venkman' },
      email: 'pvenkman@ghostbusters.com'
    });

    const location = Location.create({
      name: 'ballroom'
    });

    const ghost = Ghost.create({
      name: 'slimer',
      malevolence: 0
    });

    return Promise.all([location.save(), ghostbuster.save(), ghost.save()]);
  })
  .then(results => {
    const ballroom = results[0];
    const venkman = results[1];
    const slimer = results[2];
    slimer.haunt(ballroom);
    venkman.trapped.push(slimer);
    console.log('trapped', venkman);
    return Promise.all([ballroom.save(), venkman.save(), slimer.save()]);
  })
  .then(results => {
    const ballroom = results[0];
    const venkman = results[1];
    console.log(venkman);
    const slimer = results[2];
    return Ghostbuster.findOneAndUpdate(['name.first', '==', 'Peter'], {
      name: { first: 'Peter', last: 'Venkman' },
      email: 'egon@ghostbusters.com'
    });
  })
  .then(results => console.log(results))
  .catch(error => console.log('error', error));
