import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "../../css/ManageMedicines.css";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import CryptoJS from "crypto-js"; // Import CryptoJS library
import { Buffer } from "buffer";
import Decrypt from "../../helper/Decrypt";
const ManagePatients = () => {
    
  const auth = getAuthUser();
  const [Patients, setPatients] = useState({
    loading: true,
    reload: 0,
    errorManageMedicine: null,
    msg: null,
    results: [],
    msgDelete: null,
    errorDelete: null,
    name: "",
    description: "",
    price: "",
    expiration_date: "",
    id_category: "",
    success: null,
    errorAdd: null,
  });

  useEffect(() => {
    const fetchPatients = async () => {
      setPatients(prevState => ({ ...prevState, loading: true }));
      try {
        const response = await axios.get("http://localhost:4000/patient", {
          withCredentials: true },
          {
            headers: {
              token: auth.token,
            }
          }
         );
        const decryptedPatients = await Promise.all(response.data.map(async (patient) => {
          patient.Phone_Number = await Decrypt(patient.Phone_Number);
          return patient;
        }));
        setPatients(prevState => ({
          ...prevState,
          loading: false,
          results: decryptedPatients,
          errorManageMedicine: null
        }));
      } catch (error) {
        setPatients(prevState => ({
          ...prevState,
          loading: false,
          errorManageMedicine: error.response?.data?.myResponse[0]?.error || "An error occurred"
        }));
      }
    };
  
    fetchPatients();
  }, [auth.token]); // Only depend on `auth.token` as it is less likely to change often
  

//   const CryptoJS = require("crypto-js");

//   const decrypt = (encryptedPhoneNumber) => {
//     console.log(encryptedPhoneNumber);
//     const key = "24byte3DESencryptionkey!"; // Your encryption key
//     const decryptedPhoneNumber = CryptoJS.TripleDES.decrypt(encryptedPhoneNumber, key).toString(CryptoJS.enc.Utf8);
//     console.log(decryptedPhoneNumber);
//     return decryptedPhoneNumber;
// };


// function decrypt(encryptedText ) {
//   const key = CryptoJS.enc.Utf8.parse("24byte3DESencryptionkey!");
//   const iv = CryptoJS.enc.Hex.parse("0000000000000000"); // Assuming IV is zero for simplicity, adjust as necessary

//   try {
//     console.log(encryptedText);
//     const decrypted = CryptoJS.TripleDES.decrypt({
//       ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
//     }, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     });
//     console.log(decrypted.toString(CryptoJS.enc.Utf8));
//     return decrypted.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error('Decryption failed:', error);
//     return "Failed to decrypt";
//   }
// }
  const deletePatient = (id) => {
    axios
      .delete(`http://localhost:4000/patient/${id}`,{withCredentials: true},
       { headers: {
          token: auth.token,
        }},
      )
      .then((resp) => {
        setPatients({
          ...Patients,
          reload: Patients.reload + 1,
          msgDelete: "Patient deleted successfully ",
          errorDelete: null,
        });
      })
      .catch((err) => {
        setPatients({
          ...Patients,
          errorDelete:
            "Something went wrong with delete, please try again later!",
        });
      });
  };

  return (
    <div className="manage-Patients p-5">
      <div className="header d-flex justify-content-between mb-5">
        <h1 className="manage-m">Manage Patients</h1>
      </div>

      {Patients.loading === true && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {Patients.loading === false && Patients.errorManageMedicine !== null && (
        <>
          <Alert variant="danger" className="p-2">
            {Patients.errorManageMedicine}
          </Alert>
        </>
      )}

      {Patients.msgDelete && (
        <>
          <Alert variant="success" className="p-2">
            {Patients.msgDelete}
          </Alert>
        </>
      )}

      {Patients.loading === false &&
        Patients.errorManageMedicine === null && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr className="table-ta">
                  <th className="text-light">#</th>
                  <th className="text-light">Image</th>
                  <th className="text-light">Name</th>
                  <th className="text-light">Email</th>
                  <th className="text-light">Role</th>
                  <th className="text-light">Phone Number</th>
                  <th className="text-light">Action</th>
                </tr>
              </thead>
              <tbody>
                {Patients.results.map((Patient, index) => (
                  <tr key={Patient.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={Patient.image_url}
                        alt={Patient.name}
                        className="image-avatar"
                      />
                    </td>
                    <td>{Patient.name}</td>
                    <td>{Patient.email}</td>
                    <td>{Patient.role}</td>
                    <td>{Patient.Phone_Number}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          deletePatient(Patient.id);
                        }}
                      >
                        Delete
                      </button>
                      <Link

                        to={Patient.id}
                        className="btn btn-sm btn-primary mx-2"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
    </div>
  );
};

export default ManagePatients;