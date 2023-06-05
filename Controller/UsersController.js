const User = require("../model/usersSchema");
let bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const InsertUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with the email already exists" });
    }
    // Hash Password
    const HashPassword = await bcrypt.hash(password, 10);
    // Create User
    await User.create({
      name,
      email,
      phone,
      password: HashPassword,
    });
    return res.status(201).json({ message: "User created successfully" });
    //   let result = await user;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};
const LoginUser = async (req, res) => {
  try {
    console.log("object");
    if (req.body.email && req.body.password) {
      const userDetails = await User.findOne({ email: req.body.email });
      if (!userDetails) {
        return res.status(401).json({ message: "No User Found" });
      }
      // check if password is correct
      const ValidatePassword = await bcrypt.compare(
        req.body.password,
        userDetails.password
      );
      if (!ValidatePassword) {
        return res.status(401).send("Invalid email or password");
      }
      jwt.sign(
        { email: req.body.email },
        "secretKey",
        { expiresIn: "300s" },
        (err, token) => {
          console.log("anku", token);
          res.json({
            token,
          });
        }
      );
    } else {
      res.send({ message: "No account found" });
    }
  } catch (err) {
    console.log(err);
    res.status(503).send({ err });
  }
};
module.exports = {
  InsertUser,
  LoginUser,
};
