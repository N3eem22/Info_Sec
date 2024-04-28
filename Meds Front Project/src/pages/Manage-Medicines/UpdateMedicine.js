import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/UpdateMedicine.css"
import Spinner from "react-bootstrap/Spinner";

const UpdateMedicine = () => {
let { id } = useParams();
const auth = getAuthUser();
const [medicine, setmedicine] = useState({
    name: "",
    description: "",
    price: "",
    expiration_date: "",
    id_category: "",
    image_url:"",
    image_pass:"",
    err: "",
    loading: false,
    reload: false,
    success: null,
});
const image = useRef(null);



useEffect(() => {
    axios
    .get("http://localhost:4000/medicines/admin/" + id, {
        withCredentials: true // This ensures cookies are sent with requests
      },{
        headers: {
            token: auth.token,
        },
    })
    .then((resp) => {
        setmedicine({
        ...medicine,
        name: resp.data.name,
        description: resp.data.description,
        image_url: resp.data.image_url,
        image_pass:resp.data.image_pass,
        price: resp.data.price,
        expiration_date:resp.data.expiration_date,
        id_category:resp.data.id_category,

        });
    })
    .catch((err) => {
        setmedicine({
        ...medicine,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
        });
    });
}, [medicine.reload]);


const updateMovie = (e) => {
    e.preventDefault();

    setmedicine({ ...medicine, loading: true });

    const formData = new FormData();

    formData.append("name", medicine.name);
    formData.append("description", medicine.description);
    formData.append("price", medicine.price);
    formData.append("expiration_date", medicine.expiration_date);
    formData.append("id_category", medicine.id_category);
    //formData.append("image", medicine.image_pass);
    if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:4000/medicines/" + id, formData, {
        headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
        },
    })
    .then((resp) => {
        setmedicine({
        ...medicine,
        loading: false,
        success: "Medicines updated successfully !",
        reload: medicine.reload + 1,
        });
    })
    .catch((err) => {
        setmedicine({
        ...medicine,
        loading: false,
        success: null,
        err: err.response.data.myResponse[0].error,
        });
    });
};



return (
    <div className="login-container">
    <h1 className="Update-m">Update medicine Form</h1>

    {/* Loader  */}
        {medicine.loading === true && (
        <div className="text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )}


    <Form onSubmit={updateMovie} className="text-center py-2">
        <img
        alt={medicine.name}
        style={{
            width: "50%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
        }}
        src={medicine.image_url}
        />

{medicine.err && (
        <Alert variant="danger" className="p-2">
        {medicine.err}
        </Alert>
    )}

    {medicine.success && (
        <Alert variant="success" className="p-2">
        {medicine.success}
        </Alert>
    )}

        <Form.Group className="mb-3">
        <Form.Control
            type="text"
            placeholder="medicine Name"
            value={medicine.name}
            onChange={(e) => setmedicine({ ...medicine, name: e.target.value })}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <textarea
            className="form-control"
            placeholder="Description"
            value={medicine.description}
            onChange={(e) =>
            setmedicine({ ...medicine, description: e.target.value })
            }
            rows={5}></textarea>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Control
                value={medicine.price}
                onChange={(e) => setmedicine({ ...medicine, price: e.target.value })}
                type="text"
                required
                placeholder="Price"
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                value={medicine.expiration_date}
                onChange={(e) => setmedicine({ ...medicine, expiration_date: e.target.value })}
                type="date"
                required
                placeholder="expiration_date"
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                value={medicine.id_category}
                onChange={(e) => setmedicine({ ...medicine, id_category: e.target.value })}
                type="text"
                required
                placeholder="id_category"
            />
            </Form.Group>

        <Form.Group className="mb-3">
        <input type="file" className="form-control" ref={image} />
        </Form.Group>

        <Button className="btn btn-success w-100 " variant="primary" type="submit">
        Update medicine
        </Button>
    </Form>
    </div>
);
};

export default UpdateMedicine;
