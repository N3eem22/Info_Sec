const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); // helper
const fs = require("fs"); // file system
const { decrypt } = require("../middleware/Crypto");
const encrypt = require("../middleware/Crypto").encrypt;



// 2-1 CREATE medicine [ADMIN]
router.post(
    "",
    admin,
    upload.single("image"),
    body("name")
    .isString()
    .withMessage("please enter a valid medicine name")
    .isLength({ min: 3 })
    .withMessage("medicine name should be at lease 3 characters"),

    body("description")
    .isString()
    .withMessage("please enter a valid description ")
    .isLength({ min: 5 })
    .withMessage("description name should be at lease 10 characters"),
    async (req, res) => {
    try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        // 2- VALIDATE THE IMAGE
        if (!req.file) {
        return res.status(400).json({
            errors: [
            {
                msg: "Image is Required",
            },
            ],
        });
        }
        // 2- CHECK IF EMAIL EXISTS name already exists !
        const query1 = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const checkNameExists = await query1(
          "select * from medicines where name = ?",
        [req.body.name]
        );
        if (checkNameExists.length > 0) {
        res.status(400).json({
            myResponse: [
                {
                    error: "The Medicine name already exists !",
                },
            ],
        });
        }
        else{

            const isAvalidId = await query1("select id from categories where id = ?",[req.body.id_category]);
            let newId = null;
            if(!isAvalidId[0]){
                res.status(404).json({
                    myResponse: [
                        {
                            error: "The is no category with this Id !, please enter a valid one .",
                        },
                    ],
                });
            }
            else{
                newId = req.body.id_category
                
                // 3- PREPARE medicine OBJECT
            
                const medicine = {
                name: req.body.name,
                description: req.body.description,
                image_url: req.file.filename,
                price:req.body.price,
                expiration_date:req.body.expiration_date,
                id_category:newId
                };
        
                // 4 - INSERT medicine INTO DB
                const query = util.promisify(conn.query).bind(conn);
                await query("insert into medicines set ? ", medicine);
                res.status(200).json({
                msg: "medicine created successfully !",
                });
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
    }
);


// 2-2 UPDATE medicine [ADMIN]
router.put(
    "/:id", // params
    //admin,
    upload.single("image"),
    body("name")
    .isString()
    .withMessage("please enter a valid medicine name")
    .isLength({ min: 3 })
    .withMessage("medicine name should be at least 3 characters"),

    body("description")
    .isString()
    .withMessage("please enter a valid description ")
    .isLength({ min: 5 })
    .withMessage("description name should be at least 5 characters"),
    body("id_category"),
    async (req, res) => {
    try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        // 2- CHECK IF medicine EXISTS OR NOT
        const medicine = await query("select * from medicines where id = ?", [
        req.params.id,
        ]);
        if (!medicine[0]) {
        res.status(404).json({ msg: "medicine not found !" });
        }
        else{

            const isAvalidId = await query("select id from categories where id = ?",[req.body.id_category]);
            let newId = null;
            if(!isAvalidId[0]){
                res.status(404).json({
                    myResponse: [
                        {
                            error: "The is no category with this Id !, please enter a valid one .",
                        },
                    ],
                });
            }
            else{
                newId = req.body.id_category
                
                // 3- PREPARE medicine OBJECT
                const medicineObj = {
                    name: req.body.name,
                    description: req.body.description,
                    price:req.body.price,
                    //image_url:req.file.filename || medicine[0].image_url,
                    //image_url:req.file.filename || medicine[0].image_url,
                    expiration_date:req.body.expiration_date,
                    id_category: newId,
                    };
                    if (req.file) {
                        medicineObj.image_url = req.file.filename;
                      fs.unlinkSync("./upload/" + medicine[0].image_url); // delete old image
                    }
                    // 4- UPDATE medicine
                    await query("update medicines set ? where id = ?", [medicineObj, medicine[0].id]);
                    res.status(200).json({
                    msg: "medicine updated successfully",
                    });
            }

        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
    }
);

// 2-3 DELETE medicine [ADMIN]
router.delete(
    "/:id", // params
    admin,
    async (req, res) => {
        try {
            // 1- CHECK IF medicine EXISTS OR NOT
            const query = util.promisify(conn.query).bind(conn);
            const medicine = await query("select * from medicines where id = ?", [
            req.params.id,
            ]);
            if (!medicine[0]) {
            res.status(404).json(
                { msg: "medicine not found !" }
                );
            }
            // 2- REMOVE medicine IMAGE
            fs.unlinkSync("./upload/" + medicine[0].image_url); // delete old image
            await query("delete from medicines where id = ?", [medicine[0].id]);
            res.status(200).json({
                myResponse: [
                    {
                        msg: "Medicine deleted successfully!",
                    },
                ],
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
);

// 2-4 show All medicine [ADMIN, USER]
router.get("",authorized, async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        const medicines = await query("select * from medicines");
        if (medicines.length <= 0) {
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no medicines !",
                    },
                ],
            });
        }
        else{
            medicines.forEach(medicine => {
            
                medicine.description = encrypt(medicine.description); // encrypt description
                medicine.expiration_date = medicine.expiration_date.toISOString().slice(0, 10); // format date
                medicine.image_url = `http://${req.hostname}:4000/${medicine.image_url}`; // adjust image URL
            });
            res.status(200).json(medicines);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});


// show A medicine [Admin]
router.get("/admin/:id", async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
         const medicine = await query("select * from medicines where id = ?", [
            req.params.id,
        ]);
        if (!medicine[0]) {
            res.status(404).json({ ms: "medicine not found !" });
        }
        else{

            const category = await query("select name from categories where id = ?",[medicine[0].id_category]);
            if(category[0]){
                //console.log(category[0]);
                medicine[0].NameOfCategory  =  category[0].name;
            }
            const Date = medicine[0].expiration_date;
            medicine[0].expiration_date = Date.toISOString().slice(0,10);
            medicine[0].image_pass = medicine[0].image_url;
            
            medicine.map((medicinee) => {
                medicinee.image_url = "http://" + req.hostname + ":4000/" + medicinee.image_url;
            });
            res.status(200).json(medicine[0]);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// show A medicine [USER]
router.get("/user/:id",authorized ,async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
         const medicine = await query("select * from medicines where id = ?", [
            req.params.id,
        ]);
        if (!medicine[0]) {
            res.status(404).json({ ms: "medicine not found !" });
        }
        else{

            const category = await query("select name from categories where id = ?",[medicine[0].id_category]);
            if(category[0]){
                //console.log(category[0]);
                medicine[0].NameOfCategory  =  category[0].name;
            }
            
            delete medicine[0].id_category;
            
            medicine.map((medicinee) => {
                medicinee.image_url = "http://" + req.hostname + ":4000/" + medicinee.image_url;
                medicinee.description =encrypt(medicinee.description);
          
            });
            medicine[0].description = encrypt(medicine[0].description);
            res.status(200).json(medicine[0]);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});





// 8- Filter medicines depend on a category [USER]
router.get(
    "/filter/:id_category"
    ,authorized
    , async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        
        const MedicinesOfCategory = await query("select * from medicines  where id_category= ?", [
            req.params.id_category,
        ]);
        
        if (MedicinesOfCategory.length == 0) {
            res.status(404).json({ ms: "No Medicines In This Category !" });
        }
        else{
            MedicinesOfCategory.map((medicine)=>{
                medicine.description =encrypt(medicine.description);
            });
            res.status(200).json(MedicinesOfCategory);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});






// Show all Medicines of specific category
router.get("/category/:id",async(req,res)=>{
    try{
        const query = util.promisify(conn.query).bind(conn);
        const medicines = await  query(`select * from medicines  where id_category = ?`,[req.params.id]);
        if (medicines.length <= 0) {
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no medicines in this category!",
                    },
                ],
            });
        }
        else{
            for (val of medicines) {
                const categoryName = await query("select name from categories where id = ?",[val.id_category]);
                
                //console.log(category[0]);
                val.NameOfCategory  =  categoryName[0].name;
                
                delete medicines[0].id_category;

                const Date = val.expiration_date;
                val.expiration_date = Date.toISOString().slice(0,10);
                medicines.description =encrypt(medicines.description);

                
            }
            medicines.map((Medicine) => {
                Medicine.image_url = "http://" + req.hostname + ":4000/" + Medicine.image_url;
            });

            res.status(200).json(medicines);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router;
//const medicines = await query(`select * from medicines  where category_id = ?`,[req.params.id]);



