import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/UpdateMedicine.css"
import Spinner from "react-bootstrap/Spinner";

const UpdateCategory = () => {
let { id } = useParams();
const auth = getAuthUser();
const [Category, setmedicine] = useState({
    name: "",
    description: "",
    price: "",
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
    .get("http://localhost:4000/category/" + id, {
        withCredentials: true // This ensures cookies are sent with requests
      },{
        headers: {
            token: auth.token,
        },
    })
    .then((resp) => {
        setmedicine({
        ...Category,
        name: resp.data.name,
        description: resp.data.description,
        image_url: resp.data.image_url,

        });
    })
    .catch((err) => {
        setmedicine({
        ...Category,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
        });
    });
}, [Category.reload]);


const updateMovie = (e) => {
    e.preventDefault();

    setmedicine({ ...Category, loading: true });

    const formData = new FormData();

    formData.append("name", Category.name);
    formData.append("image", Category.image_pass);
    if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:4000/category/" + id, formData, {
        headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
        },
    })
    .then((resp) => {
        setmedicine({
        ...Category,
        loading: false,
        success: "category updated successfully !",
        reload: Category.reload + 1,
        });
    })
    .catch((err) => {
        setmedicine({
        ...Category,
        loading: false,
        success: null,
        err: err.response.data.myResponse[0].error,
        });
    });
};



return (
    <div className="login-container">
    <h1 className="Update-m">Update Category Form</h1>

    {/* Loader  */}
        {Category.loading === true && (
        <div className="text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )}


    <Form onSubmit={updateMovie} className="text-center py-2">
        <img
        alt={Category.name}
        style={{
            width: "50%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
        }}
        src={Category.image_url}
        />

{Category.err && (
        <Alert variant="danger" className="p-2">
        {Category.err}
        </Alert>
    )}

    {Category.success && (
        <Alert variant="success" className="p-2">
        {Category.success}
        </Alert>
    )}

        <Form.Group className="mb-3">
        <Form.Control
            type="text"
            placeholder="Category Name"
            value={Category.name}
            onChange={(e) => setmedicine({ ...Category, name: e.target.value })}
        />
        </Form.Group>



        <Form.Group className="mb-3">
        <input type="file" className="form-control" ref={image} />
        </Form.Group>

        <Button className="btn btn-success w-100 " variant="primary" type="submit">
        Update Category
        </Button>
    </Form>
    </div>
);
};

export default UpdateCategory;
