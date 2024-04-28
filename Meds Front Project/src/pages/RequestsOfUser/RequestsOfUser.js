import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
import '../../css/RequestOfUser.css'


const RequestOfUser = () => {
const auth = getAuthUser();
const [movies, setMovies] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
});

useEffect(() => {
setMovies({ ...movies, loading: true });
axios
.get("http://localhost:4000/Requests/user",  {
    withCredentials: true // This ensures cookies are sent with requests
  } ,{
        headers: {
            token: auth.token,
        },
    })
    .then((resp) => {
    setMovies({ ...movies, results: resp.data, loading: false, err: null });
    })
    .catch((errors) => {
        console.log(errors)
        setMovies({
            ...movies,
            loading: false,
            err: errors.response.data.myResponse[0].error,
            });
        //console.log(errors.response.data.myResponse[0].error);
    });

}, []);



const getStatusIcon = (status) => {
    switch (status) {
    case "Accepted":
        return <i className="fas fa-check text-success"></i>;
    case "Waiting":
        return <i className="fas fa-spinner fa-spin text-info"></i>;
    case "Rejected":
        return <i className="fas fa-times text-danger"></i>;
    default:
        return null;
    }
}




////////////////////////////////////////////////////
return (
    
        <div className="manage-movies  p-5">
            <div className="header d-flex justify-content-between mb-5">
            <h1 className="RofUser-m">My Orders</h1>
            </div>
            
            {/* {movies.loading === false && movies.err !== [] &&
                movies.err.map((erro, index) => (
                    <Alert key={index} variant="danger" className="p-2">
                    {erro.error}
                    </Alert>
                    ))
                
            } */}

            {movies.loading === false && movies.err !== null &&
                <>
                    <Alert  variant="danger" className="p-2">
                    {movies.err}
                    </Alert>
                </>
            }

            
            {movies.loading === false && movies.err === null &&
                <>
                    <Table striped bordered hover>
                    <thead className="bg-success ">
                        <tr className="RofUser-m">
                            <th className="text-light">#</th>
                            <th className="text-light">Image</th>
                            <th className="text-light">MedicineName</th>
                            <th className="text-light">MedicinePrice</th>
                            <th className="text-light">OrderDate</th>
                            <th className="text-light">OrderStatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.results.map((movie,index) => (
                        <tr key={movie.id}>
                            <td>{index+1}</td>
                            <td>
                            <img
                                src={movie.image_url}
                                alt={movie.NameOfMedicine}
                                className="image-avatar"
                            />
                            </td>
                            <td> {movie.NameOfMedicine} </td>
                            <td> {movie.PriceOfMedicine} </td>
                            <td>{movie.date}</td>
                            <td>{getStatusIcon(movie.status)} {movie.status}</td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </>
            }
            
        </div>


);
};

export default RequestOfUser;
