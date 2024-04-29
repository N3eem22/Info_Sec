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


const ManageMedicines = () => {
    const auth = getAuthUser();
    const [medicines, setmedicines] = useState({
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
    setmedicines({ ...medicines, loading: true });
    axios
    .get("http://localhost:4000/medicines",{
        withCredentials: true // This ensures cookies are sent with requests
      } , {
            headers: {
                token: auth.token,
            },
        })
        .then((resp) => {
        setmedicines({ ...medicines, results: resp.data, loading: false, errorManageMedicine: null });
        })
        .catch((err) => {
        setmedicines({
            ...medicines,
            loading: false,
            errorManageMedicine: err.response.data.myResponse[0].error,
        });
        });
    }, [medicines.reload]);

    
    const deletemedicine = (id) => {
        axios
            .delete("http://localhost:4000/medicines/" + id, {
                withCredentials: true // This ensures cookies are sent with requests
              } ,{
            headers: {
                token: auth.token,
            },
            })
            .then((resp) => {
            setmedicines({ 
                ...medicines, 
                reload: medicines.reload + 1 ,
                msgDelete:"Medicine deleted successfully ",
                errorDelete: null
            });
            })
            .catch((err) => {
                setmedicines({
                    ...medicines,
                    errorDelete: "something went wrong with delete, please try again later !"
                })
            });
        };


////////////////////////////////////////////////////

const image = useRef(null);

const createMedicine = (e) => {
    e.preventDefault();

    setmedicines({ ...medicines, loading: true });

    const formData = new FormData();
    formData.append("name", medicines.name);
    formData.append("description", medicines.description);
    formData.append("price", medicines.price);
    formData.append("expiration_date", medicines.expiration_date);
    formData.append("id_category", medicines.id_category);
    if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
    }
    axios
    .post("http://localhost:4000/medicines", formData, {
        headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
        },
    })
    .then((resp) => {
        setmedicines({
        name: "",
        description: "",
        errorAdd: null,
        loading: false,
        reload: medicines.reload + 1,
        success: "Medicine Created successfully !",
        });
        image.current.value = null;
    })
    .catch((err) => {
        setmedicines({
        ...medicines,
        loading: false,
        success: null,
        errorAdd: err.response.data.myResponse[0].error,
        });
    });
};


return (
<div className="manage-medicines  p-5">
    <div className="header d-flex justify-content-between mb-5">
    <h1 className="manage-m">Manage Medicines</h1>

    </div>

        {/* Loader  */}
        {medicines.loading === true && (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )}

    {medicines.loading === false && medicines.errorManageMedicine !== null &&
        <>
            <Alert  variant="danger" className="p-2">
            {medicines.errorManageMedicine}
            </Alert>
        </>
    }



    {medicines.msgDelete &&
        <>
            <Alert  variant="success" className="p-2">
            {medicines.msgDelete}
            </Alert>
        </>
    }

    {medicines.loading === false && medicines.errorManageMedicine === null &&
        <>
            <Table striped bordered hover>
            <thead>
                <tr className="table-ta">
                    <th className="text-light">#</th>
                    <th className="text-light">Image</th>
                    <th className="text-light">MedicineName</th>
                    <th className="text-light">Price</th>
                    <th className="text-light">ExpirationDate</th>
                    <th className="text-light">Action</th>
                </tr>
            </thead>
            <tbody>
                {medicines.results.map((medicine,index) => (
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
                    <td>
                        {medicine.price}
                    </td>
                    <td>
                        {medicine.expiration_date}
                    </td>
                    
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
                    <Link to={"/" + medicine.id} className="btn btn-sm btn-info">
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
        <h1 className="add-m">Add New Medicine</h1>


{medicines.loading === false && medicines.errorAdd !== null &&
        <>
            <Alert  variant="danger" className="p-2">
            {medicines.errorAdd}
            </Alert>
        </>
    }

        {medicines.success && (
            <Alert variant="success" className="p-2">
                {medicines.success}
            </Alert>
        )}

        <Form onSubmit={createMedicine}>
            <Form.Group className="mb-3">
            <Form.Control
                value={medicines.name}
                onChange={(e) => setmedicines({ ...medicines, name: e.target.value })}
                type="text"
                required
                placeholder="Medicine Name"
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <textarea
                className="form-control"
                placeholder="Description"
                value={medicines.description}
                required
                onChange={(e) =>
                setmedicines({ ...medicines, description: e.target.value })
                }
                rows={5}></textarea>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                value={medicines.price}
                onChange={(e) => setmedicines({ ...medicines, price: e.target.value })}
                type="text"
                required
                placeholder="Price"
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                value={medicines.expiration_date}
                onChange={(e) => setmedicines({ ...medicines, expiration_date: e.target.value })}
                type="date"
                required
                placeholder="Expiration_date"
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Control
                value={medicines.id_category}
                onChange={(e) => setmedicines({ ...medicines, id_category: e.target.value })}
                type="text"
                required
                placeholder="id_category"
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

export default ManageMedicines;
