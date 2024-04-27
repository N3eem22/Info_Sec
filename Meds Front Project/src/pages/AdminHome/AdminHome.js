import React , {useState}from "react";
import { FcPlus } from "react-icons/fc";
import {FcViewDetails} from "react-icons/fc";
import { AiFillEdit } from "react-icons/ai";
import "./style/AdminHome.css";
import { Link } from "react-router-dom";
export const AdminHome =()=>{
    return(
<div className="Admin-Home">
<h1><FcPlus size = "2.5cm"/>Home</h1>
<div className="button-Wrapper"> 
<button className="button-admin"><Link to={"/ManageMedicines"}>Manage Medicines</Link> <AiFillEdit color = "white" /></button>
<button className="button-admin"><Link to={"/ManageCategories"}>Manage Categories</Link> <AiFillEdit color = "white" /></button>
<button className="button-admin"><Link to={"/ManagePatients"}>Manage Patients</Link> <AiFillEdit color = "white" /></button>
<button className="button-admin"><Link to={"/Requests"}>Manage Requests</Link><AiFillEdit color = "white" /></button>
<button className="button-admin"><Link to={"/src/pages/Requests"}>MHistory</Link><FcViewDetails /></button>
</div>
</div>
    );
};

export default AdminHome;