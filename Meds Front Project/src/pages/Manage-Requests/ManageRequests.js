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
import { isDisabled } from "@testing-library/user-event/dist/utils";



const ManageRequests = () => {
    const auth = getAuthUser();
    const [medicines, setmedicines] = useState({
    loading: true,
    reload: 0,
    
    errorManageRequest: null,
    results: [],

    handle: 0 ,


    msgDelete:null,
    errorDelete:null,

    msgAccept:null,
    errorAccept:null,

    msgReject:null,
    errorReject:null,

    success: null,
    errorAdd: null,
    });
    
    useEffect(() => {
    setmedicines({ ...medicines, loading: true });
    console.log( auth.token);
    axios.get("http://localhost:4000/Requests", {
    withCredentials: true, // This ensures cookies are sent with requests
    headers: {
        token: auth.token,// Include the authentication token here
    },
})
        .then((resp) => {
        setmedicines({ ...medicines, 
            results: resp.data,
            loading: false, 
            errorManageRequest: null });
        })
        .catch((err) => {
        setmedicines({
            ...medicines,
            loading: false,
            // errorManageRequest: err.response.data.myResponse[0].error,
        });
        });
    }, [medicines.reload]);

    
    const deletemedicine = (id) => {
        setmedicines({ ...medicines, loading: true });
        axios
            .delete("http://localhost:4000/Requests/" + id,{
                withCredentials: true // This ensures cookies are sent with requests
              }, {
            headers: {
                token: auth.token,
            },
            } )
            .then((resp) => {
            setmedicines({ 
                ...medicines, 
                reload: medicines.reload + 1 ,
                msgDelete:"Request deleted successfully .",
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

const acceptMedicine = (id) => {
    setmedicines({ ...medicines, loading: true });
    axios
        .put("http://localhost:4000/Requests/accept/" + id, {
            withCredentials: true // This ensures cookies are sent with requests
          },{
        headers: {
            token: auth.token,
        },
        })
        .then((resp) => {
            setmedicines({ ...medicines,
                reload: medicines.reload + 1 ,
                msgAccept: "Request accepted successfully .",
                handle:1,
            });
        })
        .catch((err) => {});
};

const rejectMedicine = (id) => {
    setmedicines({ ...medicines, loading: true });
    axios
        .put("http://localhost:4000/Requests/reject/" + id, {
            withCredentials: true // This ensures cookies are sent with requests
          },{
        headers: {
            token: auth.token,
        },
        })
            .then((resp) => {
                setmedicines({ 
                ...medicines,
                reload: medicines.reload + 1,
                msgReject: "Request rejected successfully .",
                handle:1,
            });
            })
            .catch((err) => {});
};




return (
<div className="manage-medicines  p-5">
    <div className="header d-flex justify-content-between mb-5">
    <h1 className="manage-m">Manage Orders</h1>

    </div>

        {/* Loader  */}
        {medicines.loading === true && (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )}

    {medicines.loading === false && medicines.errorManageRequest !== null &&
        <>
            <Alert  variant="danger" className="p-2">
            {medicines.errorManageRequest}
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

    {medicines.msgAccept &&
        <>
            <Alert  variant="success" className="p-2">
            {medicines.msgAccept}
            </Alert>
        </>
    }

    {medicines.msgReject &&
        <>
            <Alert  variant="success" className="p-2">
            {medicines.msgReject}
            </Alert>
        </>
    }

    {medicines.loading === false && medicines.errorManageRequest === null &&
        <>
            <Table striped bordered hover>
                <thead>
                    <tr className="table-ta">
                        <th className="text-light">#</th>
                        <th className="text-light">Image</th>
                        <th className="text-light"> MedicineName</th>
                        <th className="text-light"> CategoryName</th>
                        <th className="text-light"> UserName</th>
                        <th className="text-light"> Status</th>
                        <th className="text-light"> Date</th>
                        <th className="text-light">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.results.map((movie,index) => (
                        movie.handle=0,
                    <tr key={movie.id}>
                        <td>
                            {index+1}
                        </td>
                        <td>
                            <img
                                src={movie.image_url}
                                alt={movie.name}
                                className="image-avatar"
                            />
                        </td>
                        <td> 
                            {movie.NameOfMedicine}
                        </td>
                        <td>
                            {movie.NameOfCategory}
                        </td>
                        <td>
                            {movie.NameOfUser}
                        </td>
                        <td>
                            {movie.status}
                        </td>
                        <td>
                            {movie.date}
                        </td>
                        <td>
                            {/* <button
                                className="btn btn-sm btn-success"
                                onClick={(e) => {
                                    acceptMedicine(movie.id);
                                }}
                                >
                                Accept
                            </button>
                            <button
                                className="btn btn-sm btn-warning mx-2"
                                onClick={(e) => {
                                    rejectMedicine(movie.id);
                                }}
                                >
                                Reject
                            </button> */}
                            {movie.status === "Waiting" && 
                                <td className="ppmm">
                                
                                    <button className='btn btn-sm btn-success' onClick={(e) => {
                                                acceptMedicine(movie.id);
                                            }} >Accept</button>
                                    <button className='btn btn-sm btn-warning mx-2' onClick={(e) => {
                                                rejectMedicine(movie.id);
                                          }}>Rejecte</button>
                                                            <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                    deletemedicine(movie.id);
                                }}
                                >
                                Delete
                            </button>
                                </td>
                                }

                                {movie.status === "Accepted"  && 
                                <td className="ppmm">
                                    <button className='btn btn-sm btn-success' disabled>Accept</button>
                                    <button className='btn btn-sm btn-warning mx-2' disabled>Rejecte</button>
                                    <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                    deletemedicine(movie.id);
                                }}
                                >
                                Delete
                            </button>
                                </td>
                                }

                                {movie.status === "Rejected"  && 
                                <td className="ppmm">
                                    <button className='btn btn-info btn-sm m-1' disabled>Accept</button>
                                    <button className='btn btn-danger btn-sm m-1' disabled>Rejecte</button>
                                    <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                    deletemedicine(movie.id);
                                }}
                                >
                                Delete
                            </button>
                                </td>
                               }
                            {/* <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                    deletemedicine(movie.id);
                                }}
                                >
                                Delete
                            </button> */}
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

export default ManageRequests;
