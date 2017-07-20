const Fiddles = require('./db/fiddles');
const Users = require('./db/users');

module.exports = function (app) {
  // This will match /fiddles/fiddleNo
  app.get(/^\/fiddles\/\w+$/, (req, res) => {
    const fiddle = req.url.split('/').pop();

    if (fiddle) {
      Fiddles.findOne({ fiddle }, (err, item) => {
        if (!item) {
          return res.status(404).json({
            message: `/* Oops! I got 404, 
            * but not the fiddle '${fiddle}' you are looking for :(
            */
            `,
          });
        }

        if (!item.isPrivate) {
          return res.json(item);
        }

        if (!req.isAuthenticated()) {
          return res.status(401).json({
            message: `This is a private fiddle please login.`,
          });
        }

        if (item.userId.toHexString() !== req.user._id) {
          return res.status(400).json({
            message: `This is a private fiddle!.`,
          });
        }

        return res.json(item);


      });
    }
  });

  app.post('/save', (req, res) => {
    let fiddle;
    if (!req.body.value) {
      return res.status(400).send();
    }

    if (req.body.fiddle !== -1 && req.isAuthenticated()) {
      fiddle = req.body.fiddle;
    } else {
      fiddle = parseInt(Date.now(), 10).toString(36);
    }

    Fiddles.findOne({ fiddle }, (err, item) => {
      if (!item) { // If no fiddle found save new fiddle
        const newFiddle = new Fiddles({
          fiddle,
          value: req.body.value,
        });
        if (req.isAuthenticated()) {
          newFiddle.userId = req.user._id;
        }
        newFiddle.save(() => {
          console.log('       Inserted fiddle at', `${fiddle}.`);
          res.json({      // send response after saving fiddle
            saved: true,
            fiddle,
          });
        });
      } else {
        if (item.userId && item.userId.toHexString() === req.user._id) {
          item.value = req.body.value;
          item.save().then(() => {
            res.json({
              saved: true,
              fiddle,
            });
          })
            .catch(() => res.status(400).send());
        } else {
          fiddle = parseInt(Date.now(), 10).toString(36);
          const newFiddle = new Fiddles({
            fiddle,
            value: req.body.value,
            userId: req.user._id,
          });

          newFiddle.save()
            .then(() => {
              res.json({
                saved: true,
                fiddle,
              });
            })
            .catch(() => res.status(400).send());
        }
      }
    });
  });

  app.post('/star/:fiddleID', (req, res) => {
    const { fiddleID } = req.params;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Only logged in user allowed to star fiddle !' });
    }

    Users.findById(req.user._id)
      .then((user) => {
        if (user.startedFiddles.indexOf(fiddleID) > -1) {
          throw new Error(`fiddle: ${fiddleID} is already stared !`);
        } else {
          return Fiddles.findOneAndUpdate({ fiddle: fiddleID },
            { $inc: { starCounter: 1 } },
            { new: true });
        }
      })
      .then((fiddle) => {
        if (!fiddle) {
          throw new Error(`fiddle: ${fiddleID} Not Found !`);
        }

        return Users.findByIdAndUpdate(req.user._id, {
          $push: { startedFiddles: fiddleID },
        });
      })
      .then(() => res.status(200).send({ stared: true }))
      .catch(err => res.status(400).json({ message: err }));
  });

  app.post('/private/:fiddleID', (req, res) => {
    const { fiddleID } = req.params;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Only logged in user allowed to have private fiddle !' });
    }

    Fiddles.findOne({ fiddle: fiddleID }).then(fiddle => {
      if (!fiddle) {
        throw new Error(`fiddle: ${fiddleID} Not Found !`);
      }
      if (!fiddle.userId) {
        throw new Error('You can only make your own fiddle private please click on save first!');
      } else if (fiddle.userId.toHexString() !== req.user._id) {
        throw new Error('You can only make your own fiddle private !');
      } else {
        return Fiddles.findOneAndUpdate({ fiddle: fiddleID }, { isPrivate: true }, { new: true });
      }
    }).then(fiddle => res.json({ fiddle }))
      .catch(err => res.status(400).json({ message: err }));
  });
};
