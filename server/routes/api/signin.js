const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {
//   app.get('/api/signin', (req, res, next) => {
//     Counter.find()
//       .exec()
//       .then((counter) => res.json(counter))
//       .catch((err) => next(err));
//   });

//   app.post('/api/counters', function (req, res, next) {
//     const counter = new Counter();

//     counter.save()
//       .then(() => res.json(counter))
//       .catch((err) => next(err));
//   });

  app.delete('/api/users/:id', function (req, res, next) {
    Counter.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((counter) => res.json())
      .catch((err) => next(err));
  });

  app.put('/api/counters/:id/increment', (req, res, next) => {
    Counter.findById(req.params.id)
      .exec()
      .then((counter) => {
        counter.count++;

        counter.save()
          .then(() => res.json(counter))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

  app.put('/api/counters/:id/decrement', (req, res, next) => {
    Counter.findById(req.params.id)
      .exec()
      .then((counter) => {
        counter.count--;

        counter.save()
          .then(() => res.json(counter))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });
  app.post('/api/account/signup', (req, res, next) => {
      const { body } = req;
      var { 
          firstName,
          lastName,
          email,
          password
      } = body;
      if (!firstName) {
          res.send({
              success: false,
              message: 'Error: Missing first name.'
          });
      }
      if (!lastName) {
        res.send({
            success: false,
            message: 'Error: Missing last name.'
        });
    }
    if (!email) {
        res.send({
            success: false,
            message: 'Error: Missing email.'
        });
    }
    email = email.toLowerCase();
    User.find({
        email: email
    },(err, previousUsers) => {
        if (err) {
            res.send({
                success: false,
                message: 'Error: Server error.'
            });
        } else if (previousUsers.length > 0) {
            res.send({
                success: false,
                message: 'Error: Account already exists.'
            });
        }
        const newUser = new User();
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
            if (err) {
                res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            } 
            res.send({
                success: true,
                message: "User account created."
            })
        })
    });
  })
  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const {
        password,
        firstName,
        lastName,
        email
    } = body;
    email = email.toLowerCase();

    if (!firstName) {
        res.send({
            success: false,
            message: 'Error: Missing first name.'
        });
    }
    if (!lastName) {
      res.send({
          success: false,
          message: 'Error: Missing last name.'
      });
    }
    if (!email) {
        res.send({
            success: false,
            message: 'Error: Missing email.'
        });
    }
    User.find({
        email: email
    }, (err,users) => {
        if (err) {
            res.send({
                success: false,
                message: "Error: Server error"
            })
        }
        const user = users[0];
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: "Error: Invalid password"
            })
        }
    });
  });
};
