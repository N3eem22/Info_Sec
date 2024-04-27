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


// 4-1 CREATE patient [ADMIN]
router.post(
    "",
    admin,
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
                    token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
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
    admin,
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
    admin,
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
router.get("",admin, async(req, res) => {
    try{
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
    admin,
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
            // medicine.map((medicinee) => {
            //     medicinee.image_url = "http://" + req.hostname + ":4000/" + medicinee.image_url;
            // });

            res.status(200).json(patient[0]);
        }
    });


module.exports = router;