import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser,removeAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/UpdateMedicine.css"
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";


const UpdatePatients = () => {

const navigate = useNavigate();
let { id } = useParams();
const auth = getAuthUser();
const [Patient, setPatient] = useState({
    
    name: "",
    email: "",
    password: "",
    role: "",
    toLogin:false,

    image_url:"",
    image_pass:"",

    err: "",
    loading: false,
    reload: false,
    success: null,
});



const Logout = () => {
    removeAuthUser();
    navigate("/Login");
    };

const image = useRef(null);




useEffect(() => {
    axios
    .get("http://localhost:4000/patient/" + id,{
        withCredentials: true // This ensures cookies are sent with requests
      } ,{
        headers: {
            token: auth.token,
        },
    } )
    .then((resp) => {
        setPatient({
        ...Patient,
        name: resp.data.name,
        email: resp.data.email,
        password:resp.data.password,
        role: resp.data.role,
        image_url: resp.data.image_url,
        });
    })
    .catch((err) => {
        setPatient({
        ...Patient,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
        });
    });
}, [Patient.reload]);







const updateMovie = (e) => {
    
    e.preventDefault();

    setPatient({ ...Patient, loading: true });

    const formData = new FormData();

    formData.append("name", Patient.name);
    formData.append("description", Patient.email);
    formData.append("password", Patient.password);
    formData.append("role", Patient.role);
    //formData.append("image", Patient.image_pass);
    if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:4000/patient/" + id, formData, {
        headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
        },
    } , {
        withCredentials: true // This ensures cookies are sent with requests
      })
    .then((resp) => {
        setPatient({
        ...Patient,
        loading: false,
        success: "patient updated successfully !",
        reload: Patient.reload + 1,
        });
        if(auth.id == id){
            Logout();
            //console.log(true);
        }
        //console.log(auth.id);
    })
    .catch((err) => {
        setPatient({
        ...Patient,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
        });
    });
};



return (
    <div className="login-container">
    <h1 className="Update-m">Update patient Form</h1>


    {/* Loader  */}
    {Patient.loading === true && (
        <div className="text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )}


    {Patient.err && (
        <Alert variant="danger" className="p-2">
        {Patient.err}
        </Alert>
    )}

    {Patient.success && (
        <Alert variant="success" className="p-2">
        {Patient.success}
        </Alert>
    )}

    <Form onSubmit={updateMovie} className="text-center py-2">
        <img
        alt={Patient.name}
        style={{
            width: "60%",
            height: "420px",
            objectFit: "cover",
            borderRadius: "100px",
            border: "7px solid #ddd",
            marginBottom: "10px",
        }}
        src={Patient.image_url}
        />

        <Form.Group className="mb-3">
        <Form.Control
            type="text"
            placeholder="Name"
            value={Patient.name}
            onChange={(e) => setPatient({ ...Patient, name: e.target.value })}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Control
            type="email"
            placeholder="Email"
            value={Patient.email}
            onChange={(e) => setPatient({ ...Patient, email: e.target.value })}
        />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Control
                value={Patient.password}
                onChange={(e) => setPatient({ ...Patient, password: e.target.value })}
                type="password"
                //required
                // placeholder="password"
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                value={Patient.role}
                onChange={(e) => setPatient({ ...Patient, role: e.target.value })}
                type="text"
                //required
                placeholder="role"
            />
            </Form.Group>

        <Form.Group className="mb-3">
        <input type="file" className="form-control" ref={image} />
        </Form.Group>

        <Button className="btn btn-success w-100 " variant="primary" type="submit">
        Update patient
        </Button>
    </Form>
    </div>
);
};

export default UpdatePatients;
