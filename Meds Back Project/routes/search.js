const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); // helper
const fs = require("fs"); // file system

const {encrypt} = require("../middleware/Crypto");






// 10- SEARCH and Store history [USER]
router.get(
    ""
    ,authorized
    , async (req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        let search = null;
        let medicines = null;

        if (req.query.search ) {
            // QUERY PARAMS
            console.log("yes search")
            search = `where name LIKE '%${req.query.search}%' `
            medicines = await query(`select * from medicines ${search}`);
            if(medicines.length != 0){
                console.log("yes Matching");
                const MedicineName = medicines[0].name
                //console.log(MedicineName);
    
                medicines.map((medicine) => {
                    medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
                    medicine.description =encrypt(medicine.description);

                });
                
                
                // Store the HistorySearches in DB
                const HistorySearches = await query(
                    "select * from history_medicine_searches where key_word = ? and id_user = ?",
                    [MedicineName,res.locals.user.id ]
                );
                //console.log(res.locals.user.id);
                if (HistorySearches.length <= 0) {
            
                    // 3- PREPARE Key_wordObject OBJECT
                    const KeyWordObject = {
                        key_word:MedicineName,
                        id_user:res.locals.user.id  
                    };
                    //console.log(key_word);
            
                    // 4 - INSERT KeyWordObject INTO DB
                    await query("insert into history_medicine_searches set ? ", KeyWordObject);
                }
                
                res.status(200).json(medicines);
            }
            else{
                console.log("no matching")
                res.status(404).json({
                    myResponse: [
                        {
                            error: "There are no medicine name matching your search ! ,try again",
                        },
                    ],
                }); 
            }
        }
        else{
            console.log("no search");
            medicines = await query('select * from medicines');
            medicines.map((medicine) => {
                medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
                medicine.description =encrypt(medicine.description);

            });
            res.status(200).json(medicines);
            
        }


    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});





// 10-Show a history of medicine searches related to his account only A User [User]
router.get(
    "/HistorySearches/:id_user",
    authorized,
    async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        
        const HistorySearches = await query("select * from history_medicine_searches  where id_user = ?", [
            req.params.id_user,
        ]);


        
        if (HistorySearches.length != 0) {
            delete HistorySearches[0].id_user;
            res.status(200).json(HistorySearches);
        }
        else{
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no medicines in this category!",
                    },
                ],
            }); 
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});











module.exports = router;

