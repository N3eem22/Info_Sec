const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const upload = require("../middleware/uploadImages");
const {encrypt} = require("../middleware/Crypto") 
 const jwt =require("jsonwebtoken");
const { log } = require("util");

// 1-1 LOGIN
router.post(
  "/login",
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("password")
    .isLength({ min: 5, max: 20 })
    .withMessage("password should be between (8-12) character"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF EMAIL EXISTS
      const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
      const user = await query("select * from users where email = ?", [
        req.body.email,
      ]);
      if (user.length == 0) {
        res.status(404).json({
          errors: [
            {
              msg: "email or password not found !",
            },
          ],
        });
      }
      else{
                    // 3- COMPARE HASHED PASSWORD
          const checkPassword = await bcrypt.compare(
            req.body.password,
            user[0].password
          );
          if (checkPassword) {
            delete user[0].password;
            const token = jwt.sign(
              {
                UserInfo: {
                  email: user[0].email,
                  role: user[0].role,
                  id: user[0].id,
                },
              },
              process.env.SESSION_SECRET,
              { expiresIn: "1h" }
            );

            res.cookie("jwt", token, {
             //httpOnly: true,
             // secure: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            req.session.token = token;
            //console.log(req.session.token);
            res.status(200).json(user[0]);
          } 
          else {
            res.status(404).json({
              errors: [
                {
                  msg: " password not found !",
                },
              ],
            });
          }
        }

      
    } catch (err) {
      console.log(err)
      res.status(500).json({ err: err });
    }
  }
);


// REGISTRATION
router.post(
    "/register",
    upload.single("image"),
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("name")
      .isString()
      .withMessage("please enter a valid name")
      .isLength({ min: 5, max: 30 })
      .withMessage("name should be between (5-30) character"),
    body("password")
      .isLength({ min: 5, max: 15 })
      .withMessage("password should be between (5-15) character"),
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const checkEmailExists = await query(
          "select * from users where email = ?",
          [req.body.email]
        );
        if (checkEmailExists.length > 0) {
          res.status(400).json({
            errors: [
              {
                msg: "email already exists !",
              },
            ],
          });
        }
        else{
              // 3- PREPARE OBJECT USER TO -> SAVE
            const userData = {
              name: req.body.name,
              email: req.body.email,
              // image_url: req.file.filename,
              password: await bcrypt.hash(req.body.password, 10),
              token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
            };
      
            // 4- INSERT USER OBJECT INTO DB
            await query("insert into users set ? ", userData);
            delete userData.password;
            //userData.email = encrypt(userData.email)
            req.session.user = userData;
            res.status(200).json(userData);
            
        }
  
        
      } catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
      }
    }
  );



  
module.exports = router;