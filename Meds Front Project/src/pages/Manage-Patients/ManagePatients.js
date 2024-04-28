import React, { useState, useRef, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "../../css/ManageMedicines.css";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
//import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";


const ManagePatients = () => {
    const auth = getAuthUser();
    const [Patients, setPatients] = useState({
    loading: true,
    reload: 0,
    
    errorManageMedicine: null,
    msg: null,
    results: [],


    msgDelete:null,
    errorDelete:null,


    name: "",
    description: "",
    price: "",
    expiration_date: "",
    id_category: "",
    success: null,
    errorAdd: null,
    });
    
    useEffect(() => {
    setPatients({ ...Patients, loading: true });
    axios
    .get("http://localhost:4000/patient",{
        withCredentials: true // This ensures cookies are sent with requests
      }, {
            headers: {
                token: auth.token,
            },
        })
        .then((resp) => {
        setPatients({ ...Patients, results: resp.data, loading: false, errorManageMedicine: null });
        })
        .catch((err) => {
        setPatients({
            ...Patients,
            loading: false,
            errorManageMedicine: err.response.data.myResponse[0].error,
        });
        });
    }, [Patients.reload]);

    
    const deletePatient = (id) => {
        axios
            .delete("http://localhost:4000/patient/" + id,{
                withCredentials: true // This ensures cookies are sent with requests
              }, {
            headers: {
                token: auth.token,
            },
            })
            .then((resp) => {
            setPatients({ 
                ...Patients, 
                reload: Patients.reload + 1 ,
                msgDelete:"Patient deleted successfully ",
                errorDelete: null
            });
            })
            .catch((err) => {
                setPatients({
                    ...Patients,
                    errorDelete: "something went wrong wiht delete, please try again later !"
                })
            });
        };


////////////////////////////////////////////////////



return (
<div className="manage-Patients  p-5">
    <div className="header d-flex justify-content-between mb-5">
    <h1 className="manage-m">Manage Patients</h1>
    </div>

    
    {/* Loader  */}
    {Patients.loading === true && (
        <div className="text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )}


    {Patients.loading === false && Patients.errorManageMedicine !== null &&
        <>
            <Alert  variant="danger" className="p-2">
            {Patients.errorManageMedicine}
            </Alert>
        </>
    }



    {Patients.msgDelete &&
        <>
            <Alert  variant="success" className="p-2">
            {Patients.msgDelete}
            </Alert>
        </>
    }

    {Patients.loading === false && Patients.errorManageMedicine === null &&
        <>
            <Table striped bordered hover>
            <thead>
                <tr className="table-ta">
                    <th className="text-light">#</th>
                    <th className="text-light">Image</th>
                    <th className="text-light">Name</th>
                    <th className="text-light">Email</th>
                    <th className="text-light">Role</th>
                    <th className="text-light">Action</th>
                </tr>
            </thead>
            <tbody>
                {Patients.results.map((Patient,index) => (
                <tr key={Patient.id}>
                    <td>
                        {index+1}
                    </td>
                    <td>
                        <img
                            src={Patient.image_url}
                            alt={Patient.name}
                            className="image-avatar"
                        />
                    </td>
                    <td> 
                        {Patient.name}
                    </td>
                    <td>
                        {Patient.email}
                    </td>
                    <td>
                        {Patient.role}
                    </td>
                    <td>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                            deletePatient(Patient.id);
                        }}>
                        Delete
                    </button>
                    <Link
                        to={"" + Patient.id}
                        className="btn btn-sm btn-primary mx-2">
                        Update
                    </Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        </>
    }

    

</div>
);
};

export default ManagePatients;
