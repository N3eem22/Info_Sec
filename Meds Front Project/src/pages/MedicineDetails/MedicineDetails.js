import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../../css/MedicineDetails.css"
import { getAuthUser } from "../../helper/Storage";

// import Footer from "../../shared/Footer";


const MedicineDetails = () =>{

  const auth = getAuthUser();

  let { id } = useParams();

  const [medicine, setmedicine] = useState({
    loading: true,
    result: null,
    err: null,
    reload: 0,
  },[]);


  useEffect(() => {
    setmedicine({ ...medicine, loading: true });
    axios
      .get("http://localhost:4000/medicines/admin/" + id , {
        withCredentials: true // This ensures cookies are sent with requests
      })
      .then((resp) => {
        setmedicine({ ...medicine, result: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setmedicine({
          ...medicine,
          loading: false,
          err: " something went wrong, please try again later ! ",
        });
      });
  }, []);


  const SendRequest = (id) => {
    setmedicine({ ...medicine, loading: true });
    console.log(auth.token);
    axios
    .post(`http://localhost:4000/Requests/${id}`,{
      withCredentials : true
    } ,{
      headers: {
        token: auth.token,
        id : auth.id
      }
      })
        .then((resp) => {
          setmedicine({ ...medicine, reload: medicine.reload + 1 });
        })
        .catch((err) => {
          setmedicine({ ...medicine, loading: false });
        });
    };


  return(
    <div className="medicine-details-container p-5">

      {/* Loader  */}
      {medicine.loading === true && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* LIST medicineS  */}
      {medicine.loading === false && medicine.err == null && (
        <>



<div className="container-fault ">
    <div className="col-lg-8 border p-3 main-section bg-white mdd justify-content-center align-items-center">

        <div className="row m-0 ">
            <div className="col-lg-4 left-side-product-box pb-3">
                <img src={medicine.result.image_url} className="border p-3"/>

            </div>
            <div className="col-lg-8">
                <div className="right-side-pro-detail border p-3  my-auto MD-mydiv">
                    <div className="row">
                        <div className="col-lg-12">

                            <p className="m-0 p-0">{medicine.result.name}</p>
                        </div>
                        <div className="col-lg-12">
                            <p className="m-0 p-0 price-pro">{medicine.result.price} <span className="fs-4">$</span> </p>
                            <hr className="p-0 m-0"/>
                        </div>
                        <div className="col-lg-12 pt-2">
                            <h5>{medicine.result.NameOfCategory}</h5>
                            <p className="MD-span">{medicine.result.description}</p>
                            <hr className="m-0 pt-2 mt-2"/>
                        </div>


                        <div className="col-lg-12 mt-3">
                            <div className="row">

                                <div className="col-lg-6 ms-auto MD">
                                    {/* <a href="#" className="btn btn-success w-100">Buy Now</a> */}
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={(e) => {
                                        SendRequest(id);
                                      }}>
                                      Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


   </div>
</div>


          </>
      )}

      {/* ERRORS HANDLING  */}
      {medicine.loading === false && medicine.err != null && (
        <Alert variant="danger" className="p-2">
        {medicine.err}
        </Alert>
      )}


    </div>

        
    
  );
};

export default MedicineDetails;










