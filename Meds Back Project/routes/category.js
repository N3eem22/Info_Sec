const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); // helper
const fs = require("fs"); // file system

const verifyJWT= require("../middleware/verifyJWT.JS");



// 3-1 CREATE category [ADMIN]
router.post(
    "",verifyJWT ,admin,
    upload.single("image"),
    body("name")
    .isString()
    .withMessage("please enter a valid category name")
    .isLength({ min: 3 })
    .withMessage("category name should be at lease 3 characters"),


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
        // 2- CHECK IF category EXISTS
        const query1 = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const checkCategoryExists = await query1(
          "select * from categories where name = ?",
        [req.body.name]
        );
        if (checkCategoryExists.length > 0) {
        res.status(400).json({
            myResponse: [
                {
                    error: "Category name already exist !,Please enter a different name . ",
                },
            ],
        });
        }
        else{
            // 3- PREPARE medicine OBJECT
            1
            const category = {
            name: req.body.name,
            //description: req.body.description,
            image_url: req.file.filename,
            };
    
            // 4 - INSERT category INTO DB
            const query = util.promisify(conn.query).bind(conn);
            await query("insert into categories set ? ", category);
            res.status(200).json({
            msg: "category created successfully !",
            });
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
    }
);


// 3-2 UPDATE category [ADMIN]
router.put(
    "/:id", // params
    verifyJWT , admin,
    upload.single("image"),
    body("name")
    .isString()
    .withMessage("please enter a valid category name")
    .isLength({ min: 3 })
    .withMessage("category name should be at least 3 characters"),

    async (req, res) => {
    try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        // 2- CHECK IF category EXISTS OR NOT
        const category = await query("select * from categories where id = ?", [
        req.params.id,
        ]);
        if (!category[0]) {
        res.status(404).json({ msg: "category not found !" });
        }
        else{
            // 3- PREPARE category OBJECT
            const categoryObj = {
            name: req.body.name,
            //image_url: req.file.filename,
            //image_url:req.file.filename || category[0].image_url
            };

            if (req.file) {
                categoryObj.image_url = req.file.filename;
            fs.unlinkSync("./upload/" +  category[0].image_url); // delete old image
            }
            // 4- UPDATE category
            await query("update categories set ? where id = ?", [categoryObj, category[0].id]);
            res.status(200).json({
            msg: "category updated successfully",
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
    }
);

// 3-3 DELETE category [ADMIN]
router.delete(
    "/:id", // params
    verifyJWT , admin,
    async (req, res) => {
        try {
            // 1- CHECK IF category EXISTS OR NOT
            const query = util.promisify(conn.query).bind(conn);
            const category = await query("select * from categories where id = ?", [
            req.params.id,
            ]);
            if (!category[0]) {
            res.status(404).json({ msg: "category not found !" });
            }
            else{
            // 2- REMOVE category IMAGE
            fs.unlinkSync("./upload/" + category[0].image_url); // delete old image
            await query("delete from categories where id = ?", [category[0].id]);
            res.status(200).json({
                myResponse: [
                    {
                        msg: "category deleted successfully!",
                    },
                ],
            });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
);

// 3-4 show All category [ADMIN, USER]
router.get("",  verifyJWT ,async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        const categories = await query("select * from categories");
        if (categories.length <= 0) {
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no Categories . ",
                    },
                ],
            });
        }
        else{
            categories.map((category) => {
                category.image_url = "http://" + req.hostname + ":4000/" + category.image_url;
            });
            res.status(200).json(categories);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});




// show A category [ADMIN, USER]
router.get("/:id", verifyJWT ,async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
         const categories = await query("select * from categories where id = ?", [
            req.params.id,
        ]);
        //console.log(req.params.id);
        if (!categories[0]) {
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no categories . ",
                    },
                ],
            });
        }
        else{
            
            categories.map((category) => {
                category.image_url = "http://" + req.hostname + ":4000/" + category.image_url;
            });
            res.status(200).json(categories[0]);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});



module.exports = router;