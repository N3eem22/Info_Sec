const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const medicine = require("./medicines");
const category = require("./category");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); // helper
const fs = require("fs"); // file system
const verifyJWT= require("../middleware/verifyJWT.JS");
const { log } = require("util");

const date = new Date();
let currentDay= String(date.getDate()).padStart(2, '0');
let currentMonth = String(date.getMonth()+1).padStart(2,"0");
let currentYear = date.getFullYear();
// we will display the date as DD-MM-YYYY 
let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
console.log("The current date is " + currentDate);
console.log(typeof(currentDate));

// const d2 = new Date(currentDate);
// console.log(typeof(d2));
// console.log(d2)









// -5 Accept  requests [Admin]
router.put(
    "/accept/:id",     //admin,
    async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn);
        
        //  Get request record
        const requests = await query("select * from requests where status = '0' and id = ?", [
            req.params.id,
            ]);    
        //console.log(requests);

        if (!requests[0]) {
            res.status(404).json({ msg: " Not found !, may be already accepted before." });
        }
        else{
            // PREPARE request OBJECT
            const requestObj = {
            status: "1"
            };
            // 4- UPDATE request
            await query("update requests set ? where id = ?", [requestObj, requests[0].id]);
            res.status(200).json({
            msg: "The request accepted successfully",
            });
        }
    } catch (err) {
        //console.log("wrong here");
        res.status(500).json(err);
    }
    }
);

// -5 Reject  requests [Admin]
router.put(
    "/reject/:id", 
    async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn);
        
        //  Get request record
        const requests = await query("select * from requests where status = '0' and id = ?", [
            req.params.id,
            ]);    
        //console.log(requests);

        if (!requests[0]) {
            res.status(404).json({ msg: " Not found !, may be already rejected before." });
        }
        else{
            // PREPARE request OBJECT
            const requestObj = {
            status: "-1"
            };
            // 4- UPDATE request
            await query("update requests set ? where id = ?", [requestObj, requests[0].id]);
            res.status(200).json({
            msg: "The request rejected successfully",
            });
        }
    } catch (err) {
        //console.log("wrong here");
        res.status(500).json(err);
    }
    }
);

// -5 DELETE Request [Admin]
router.delete(
    "/:id", // params
    verifyJWT , admin,
    async (req, res) => {
        try {
            // 1- CHECK IF requests EXISTS OR NOT
            const query = util.promisify(conn.query).bind(conn);
            const request = await query("select * from requests where id = ?", [
                req.params.id,
            ]);
            //console.log(request[0]);
            if (!request[0]) {
            res.status(404).json({ msg: "requests not found !" });
            }
            else{
            await query("delete from requests where id = ?", [request[0].id]);
            res.status(200).json({
                result: [
                    {
                    msg: "request deleted successfully",
                    },
                ],
            });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
);

// -6 Show all requests that waiting for acceptance [Admin]
router.get("",async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        const requests = await query("select * from requests ");
        if (requests.length <= 0) {
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no requests!",
                    },
                ],
            });
        }
        else{
            for (val of requests) {
                const categoryName = await query("select name from categories where id = ?",[val.id_category]);
                const MedicineName = await query("select name from medicines where id = ?",[val.id_medicine]);
                const image_url  = await query("select image_url  from medicines where id = ?",[val.id_medicine]);
                const UserName = await query("select name from users where id = ?",[val.id_user]);

                val.NameOfCategory  =  categoryName[0].name;
                val.NameOfMedicine  =  MedicineName[0].name;
                val.image_url  =  image_url[0].image_url;
                val.NameOfUser  =  UserName[0].name;

                if(val.status == 0){
                    val.status = "Waiting";
                }
                else if(val.status == -1){
                    val.status = "Rejected";
                }
                else{
                    val.status = "Accepted";
                }

                delete val.id_category;
                delete val.id_medicine;
                delete val.id_user;

                // const d2 = new Date(val.date);
                // console.log(d2);

                const Date = val.date;
                
                val.date = Date.toISOString().slice(0,10);
                console.log(Date.toISOString().slice(0,10));
            }
            requests.map((request) => {
                request.image_url = "http://" + req.hostname + ":4000/" + request.image_url;
            });
        
            res.status(200).json(requests);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});


// -6 Show all requests for a user [user]
router.get("/user",verifyJWT,async(req, res) => {
    try{
        const query = util.promisify(conn.query).bind(conn);
        const requests = await query("select * from requests where id_user = ?",[req.user.id]);
        if (requests.length <= 0) {
            res.status(404).json({
                myResponse: [
                    {
                        error: "There are no requests!",
                    },
                ],
            });
        }
        else{
            for (val of requests) {
                //const categoryName = await query("select name from categories where id = ?",[val.id_category]);
                const MedicineName = await query("select name from medicines where id = ?",[val.id_medicine]);
                const MedicinePrice = await query("select price from medicines where id = ?",[val.id_medicine]);
                const {price} =MedicinePrice[0];
                const image_url  = await query("select image_url  from medicines where id = ?",[val.id_medicine]);
                //const UserName = await query("select name from users where id = ?",[val.id_user]);

                //val.NameOfCategory  =  categoryName[0].name;
                val.NameOfMedicine  =  MedicineName[0].name;
                val.PriceOfMedicine = price;
                val.image_url  =  image_url[0].image_url;
                //val.NameOfUser  =  UserName[0].name;

                if(val.status == 0){
                    val.status = "Waiting";
                }
                else if(val.status == -1){
                    val.status = "Rejected";
                }
                else{
                    val.status = "Accepted";
                }

                delete val.id_category;
                delete val.id_medicine;
                delete val.id_user;

                const Date = val.date;
                val.date = Date.toISOString().slice(0,10);
                //console.log(Date.toISOString().slice(0,10));
            }
            requests.map((request) => {
                request.image_url = "http://" + req.hostname + ":4000/" + request.image_url;
            });
        
            res.status(200).json(requests);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// -9 Send Request  by Id[User]
router.post(
    "/:id",
    async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        //console.log(req.cookies.jwt.id);
      
        const {id}=req.headers 
        //  CHECK IF Request EXISTS or Waiting
        const checkRequestExists = await query(
          "select * from requests where status = '0' and  id_medicine  = ? and id_user = ?",
            [req.params.id,id]
        );
        if (checkRequestExists.length > 0) {
            //console.log(date_time);
            res.status(400).json({
                
                errors: [
                    {
                        msg: "Your request already exists ! , Pls wait for acceptance or reject",
                    },
                ],
            });
        }
        else{
            
            //CHECK IF Medicine EXISTS or not
            const checkMedicineExists = await query(
                "select * from medicines where id = ? ",
                [req.params.id]
            );
            //console.log(req.params.id)
            if (checkMedicineExists.length <= 0) {
                res.status(400).json({
                    errors: [
                        {
                            msg: "Sorry , this medicine is not found !",
                        },
                    ],
                });
            }
            else{



                // 3- PREPARE Request OBJECT
                console.log(res.cookie.id);
                const Request = {
                    id_medicine: req.params.id,
                    id_category:checkMedicineExists[0].id_category,
                    date:currentDate,
                    id_user:id
                };
                //console.log(Request)
        
                // 4 - INSERT medicine INTO DB
                await query("insert into requests set ? ", Request);
                res.status(200).json({
                msg: "Request created successfully !",
                });
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
    }
);




module.exports = router;