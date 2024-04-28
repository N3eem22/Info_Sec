import React, { useState, useEffect } from "react";
import MedicinesCard from "../../components/MedicinesCard";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import { useParams } from "react-router-dom";

const ListMedicinesOfCategory = () => {
  const auth = getAuthUser();
  const {id} = useParams();
    const [medicines, setmedicines] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });

    const [search, setSearch] = useState("");

    useEffect(() => {
      setmedicines({ ...medicines, loading: true });
      axios
        .get("http://localhost:4000/medicines/category/" + id , {
          withCredentials: true // This ensures cookies are sent with requests
        }, {
          params: {
            search: search,
          },
          headers: {
              token: auth.token,
            },
        })
        .then((resp) => {
          setmedicines({ ...medicines, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          //console.log(err);
          setmedicines({
            ...medicines,
            loading: false,
            err: err.response.data.myResponse[0].error,
          });
        });
    }, [medicines.reload]);

    



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


          
      </div>
      
    );
};

export default ListMedicinesOfCategory;
