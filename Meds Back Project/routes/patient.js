const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); // helper
const fs = require("fs"); // file system
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {encrypt} = require("../middleware/Crypto");
const {decrypt} = require("../middleware/Crypto");
const verifyJWT= require("../middleware/verifyJWT.JS");
// 4-1 CREATE patient [ADMIN]

router.post(
    "",
    verifyJWT , admin,
    body("email")
    .isEmail()
    .withMessage("please enter a valid email!"),

    body("name")
    .isString()
    .withMessage("please enter a valid patient name")
    .isLength({ min: 5, max: 50 })
    .withMessage("patient name should be between (5-50) character"),

    body("password")
    .isLength({ min: 5, max: 50 })
    .withMessage("password should be between (5-50) character"),
    body("Phone_Number")
  .isLength({ min: 11, max: 11 })
  .withMessage("This phone number isn't valid"),
    async(req, res) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- CHECK IF email EXISTS
            const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
            const checkEmailExists = await query(
                "select * from users where email = ?", [req.body.email]
            );
            if (checkEmailExists.length > 0) {
                res.status(400).json({
                    errors: [{
                        msg: "email already exists !",
                    }, ],
                });
            } else {
                // 3- PREPARE patient OBJECT
                1
                
                const users = {
                    name: req.body.name,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 10),
                    token: crypto.randomBytes(16).toString("hex"),
                    Phone_Number :decrypt(req.body.Phone_Number) 
                };

                // 4 - INSERT patient INTO DB
                await query("insert into users set ? ", users);
                res.status(200).json({
                    msg: "patient created successfully !",
                });
            }

        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }
);

// 4-2 UPDATE patient [ADMIN]
router.put(
    "/:id", // params
    verifyJWT , admin,
    upload.single("image"),
    // body("email").isString()
    // .withMessage("please enter a valid email!"),


    async(req, res) => {
        try {
            // // 1- VALIDATION REQUEST [manual, express validation]
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                res.status(404).json({
                    myResponse: [
                        {
                            error: "Pleaseee enter a valid email .",
                        },
                    ],
                });
                }
            else{
                //2- CHECK IF patient EXISTS OR NOT
                const patient = await query(
                    "select * from users where id = ?", [req.params.id]
                );
                if (!patient[0]) {
                    res.status(404).json({
                        myResponse: [
                            {
                                error: "There is no patient with this id !, Please enter a valid again .",
                            },
                        ],
                    });
                }
                else {

                    let newRole = null;
                    if(req.body.role == "Admin"){
                        newRole = 1 ;
                    }else{
                        newRole = 0;
                    }

                    const patientObj = {
                        name: req.body.name ||  patient[0].name,
                        email: req.body.email || patient[0].email,
                        password:req.body.password || patient[0].password,
                        role: newRole ,
                        Phone_Number :  encrypt(req.body.Phone_Number)
                    };

                    if (req.file) {
                        patientObj.image_url = req.file.filename;
                    //fs.unlinkSync("./upload/" +  patient[0].image_url); // delete old image
                    }

                    // 4- UPDATE patient
                    await query("update users set ? where id = ?", [patientObj, patient[0].id]);
                    res.status(200).json({
                        msg: "patient updated successfully",
                    });
                }
            }


        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
);

// 4-3 DELETE patient [ADMIN]
router.delete(
    "/:id", // params
    verifyJWT , admin,
    async(req, res) => {
        try {
            // 1- CHECK IF patient EXISTS OR NOT
            const query = util.promisify(conn.query).bind(conn);
            const patient = await query("select * from users where id = ?", [
                req.params.id,
            ]);
            if (!patient[0]) {
                res.status(404).json({ msg: "patient not found !" });
            } else {
                await query("delete from users where id = ?", [patient[0].id]);
                res.status(200).json({
                    msg: "patient deleted successfully",
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
);


// 4-4 show All patient [ADMIN]
router.get("",verifyJWT , admin,async(req, res) => {
    try{
        console.log(req.cookies.jwt);
        const query = util.promisify(conn.query).bind(conn);
        const patients = await query("select * from users");
        if (patients.length <= 0) {
            res.status(404).son({
                myResponse: [
                    {
                        error: "There are no patient !. ",
                    },
                ],
            });
        }
        else{

            for (val of patients) {
                if(val.role == 0){
                    val.role = "User";
                }
                else{
                    val.role = "Admin";
                }
            }

            patients.map((patient) => {
                patient.image_url = "http://" + req.hostname + ":4000/" + patient.image_url;
               patient.Phone_Number = encrypt(patient.Phone_Number)
               console.log(`Decrypted phone :  ${(patient.Phone_Number)}`);
            });
            res.status(200).json(patients);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});


// Show A patient [ADMIN]
router.get("/:id",
verifyJWT,admin,
    async(req, res) => {
        const query = util.promisify(conn.query).bind(conn);
        const patient = await query("select * from users where id = ?", [
            req.params.id,
        ]);
        if (!patient[0]) {
            res.status(404).json({ ms: "patient not found !" });
        } else {

            if(patient[0].role == 0){
                patient[0].role = "User";
            }
            else{
                patient[0].role = "Admin";
            }
            
            patient[0].image_url = "http://" + req.hostname + ":4000/" + patient[0].image_url;
            patient[0].Phone_Number = decrypt(patient[0].Phone_Number);
            // medicine.map((medicinee) => {
            //     medicinee.image_url = "http://" + req.hostname + ":4000/" + medicinee.image_url;
            // });

            res.status(200).json(patient[0]);
        }
    });


module.exports = router;