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


const ManageCategories = () => {
    const auth = getAuthUser();
    const [categories, setCategories] = useState({
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
    setCategories({ ...categories, loading: true });
    axios
    .get("http://localhost:4000/category",{
        withCredentials: true // This ensures cookies are sent with requests
      } , {
            headers: {
                token: auth.token,
            },
        })
        .then((resp) => {
        setCategories({ ...categories, results: resp.data, loading: false, errorManageMedicine: null });
        })
        .catch((err) => {
        setCategories({
            ...categories,
            loading: false,
            // errorManageMedicine: err.response.data.myResponse[0].error,
        });
        });
    }, [categories.reload]);

    
    const deletemedicine = (id) => {
        axios
            .delete("http://localhost:4000/category/" + id, {
                withCredentials: true // This ensures cookies are sent with requests
              }, {
            headers: {
                token: auth.token,
            },
            })
            .then((resp) => {
            setCategories({ 
                ...categories, 
                reload: categories.reload + 1 ,
                msgDelete:"Medicine deleted successfully ",
                errorDelete: null
            });
            })
            .catch((err) => {
                setCategories({
                    ...categories,
                    errorDelete: "something went wrong with delete, please try again later !"
                })
            });
        };


////////////////////////////////////////////////////

const image = useRef(null);

const createCategory = (e) => {
    e.preventDefault();

    setCategories({ ...categories, loading: true });

    const formData = new FormData();
    formData.append("name", categories.name);
    formData.append("description", categories.description);
    if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
    }
    axios
    .post("http://localhost:4000/category", formData, {
        headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
        },
    })
    .then((resp) => {
        setCategories({
        name: "",
        //description: "",
        errorAdd: null,
        loading: false,
        reload: categories.reload + 1,
        success: "category Created Successfully !",
        });
        image.current.value = null;
    })
    .catch((err) => {
        setCategories({
        ...categories,
        loading: false,
        success: null,
        // errorAdd: err.response.data.myResponse[0].error,
        });
    });
};


return (
<div className="manage-categories  p-5">
    <div className="header d-flex justify-content-between mb-5">
    <h1 className="manage-m">Manage Categories</h1>

    </div>
    
    {/* Loader  */}
    {categories.loading === true && (
    <div className="text-center">
    <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
    )}

    {categories.loading === false && categories.errorManageMedicine !== null &&
        <>
            <Alert  variant="danger" className="p-2">
            {categories.errorManageMedicine}
            </Alert>
        </>
    }



    {categories.msgDelete &&
        <>
            <Alert  variant="success" className="p-2">
            {categories.msgDelete}
            </Alert>
        </>
    }

    {categories.loading === false && categories.errorManageMedicine === null &&
        <>
            <Table striped bordered hover>
            <thead>
                <tr className="table-ta">
                    <th className="text-light">#</th>
                    <th className="text-light">Image</th>
                    <th className="text-light">CategoryName</th>
                    {/* <th className="text-light">CategoryDescription</th> */}
                    <th className="text-light">Action</th>
                </tr>
            </thead>
            <tbody>
                {categories.results.map((medicine,index) => (
                <tr key={medicine.id}>
                    <td>
                        {index+1}
                    </td>
                    <td>
                        <img
                            src={medicine.image_url}
                            alt={medicine.name}
                            className="image-avatar"
                        />
                    </td>
                    <td> 
                        {medicine.name}
                    </td>
                    {/* <td>
                        {medicine.description}
                    </td> */}
                    <td>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                            deletemedicine(medicine.id);
                        }}>
                        Delete
                    </button>
                    <Link
                        to={"" + medicine.id}
                        className="btn btn-sm btn-primary mx-2">
                        Update
                    </Link>
                    <Link to={"/ListMedicinesOfCategory/" + medicine.id} className="btn btn-sm btn-info">
                        show
                    </Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        </>
    }



<div className="login-container">
        <h1 className="add-m">Add New Category</h1>


{categories.loading === false && categories.errorAdd !== null &&
        <>
            <Alert  variant="danger" className="p-2">
            {categories.errorAdd}
            </Alert>
        </>
    }

        {categories.success && (
            <Alert variant="success" className="p-2">
                {categories.success}
            </Alert>
        )}

        <Form onSubmit={createCategory}>
            <Form.Group className="mb-3">
            <Form.Control
                value={categories.name}
                onChange={(e) => setCategories({ ...categories, name: e.target.value })}
                type="text"
                required
                placeholder=" Category Name"
            />
            </Form.Group>


            <Form.Group className="mb-3">
            <input type="file" className="form-control" ref={image} required />
            </Form.Group>

            <Button className="btn btn-success w-100" variant="primary" type="submit">
            Add Medicine
            </Button>
        </Form>
    </div>
    

</div>
);
};

export default ManageCategories;
