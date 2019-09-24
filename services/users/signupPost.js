// User model
const bcrypt = require("bcrypt");
const User = require("../../models/user");

// BCrypt to encrypt passwords
const bcryptSalt = 10;

const signupPost = (req, res, next) => {
  const { username, password, phone, email, birth } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indique um nome de usuário e uma senha para se inscrever"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "O nome de usuário já existe!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        phone,
        email,
        birth,
        password: hashPass
      })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
};

module.exports = signupPost;