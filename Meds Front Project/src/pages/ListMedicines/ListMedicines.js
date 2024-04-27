import React, { useState, useEffect } from "react";
import MedicinesCard from "../../components/MedicinesCard";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import { Link } from "react-router-dom";
const ListMedicines = () => {

  const auth = getAuthUser();
    const [medicines, setmedicines] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
      success: null,
    });

    const [search, setSearch] = useState("");

    useEffect(() => {
      setmedicines({ ...medicines, loading: true });
      axios
        .get("http://localhost:4000/search", {
          params: {
            search: search,
          },
          headers: {
              token: auth.token,
            },
        })
        .then((resp) => {
          setmedicines({ ...medicines, 
            results: resp.data, 
            loading: false,
            err: null,
            success : true,
          });
        })
        .catch((err) => {
          //console.log(err);
          setmedicines({
            ...medicines,
            loading: false,
            success:false,
            err: err.response.data.myResponse[0].error,
          });
        });
    }, [medicines.reload]);

    

    const searchmedicines = (e) => {
      e.preventDefault();
      setmedicines({ ...medicines, reload: medicines.reload + 1 });
    };

    return (
      <div className="home-container p-5">
        {/* Loader  */}
        {medicines.loading === true && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}



        {/* LIST medicines  */}
        {medicines.loading === false && medicines.err == null && (
          <>
            {/* Filter  */}
            <Form onSubmit={searchmedicines}>
              <Form.Group className="mb-3 d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search medicines"
                  className="rounded-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-success rounded-2">Search</button>
                <Link className="btn btn-success rounded-2 mx-1" to={"/HistorySearch/"+auth.id}>
                History
                </Link> 
              </Form.Group>
            </Form>

            {/* LIST medicines  */}
            <div className="row ">
              {medicines.results.map((medicine) => (
                <div className="col-3 card-medicine-container" key={medicine.id}>
                  <MedicinesCard
                    name={medicine.name}
                    description={medicine.description}
                    image={medicine.image_url}
                    id={medicine.id}
                    expiration_date = {medicine.expiration_date}
                    price = {medicine.price}
                    //id_category = {medicine.id_category}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ERRORS HANDLING  */}
        {medicines.loading === false && medicines.err != null && (
          <Alert variant="danger" className="p-2">
            {medicines.err}
          </Alert>
        )}

        {medicines.loading === false &&
          medicines.err == null &&
          medicines.results.length === 0 && (
            <Alert variant="info" className="p-2">
              No medicines, please try again later !
            </Alert>
          )}
          
      </div>
      
    );
};

export default ListMedicines;
