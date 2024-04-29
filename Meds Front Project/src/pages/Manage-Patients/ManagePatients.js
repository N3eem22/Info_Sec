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
<<<<<<< HEAD

=======
import { Buffer } from "buffer";
import Decrypt from "../../helper/Decrypt";
>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371
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
    setPatients({ ...Patients, loading: true });
    axios
      .get("http://localhost:4000/patient", {
        withCredentials: true,
        headers: {
          token: auth.token,
        },
      })
<<<<<<< HEAD
      .then((resp) => {
=======
      .then(async (resp) => {
        console.log(resp.data);
        for (let i = 0; i < resp.data.length; i ++) { 
          const current = resp.data[i]; 
          current.Phone_Number = await Decrypt(current.Phone_Number);
          console.log(current.Phone_Number);
          // console.log(await Decrypt(current.data.Phone_Number));
          resp.data[i] = current;
        }
>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371
        setPatients({
          ...Patients,
          results: resp.data,
          loading: false,
          errorManageMedicine: null,
        });
      })
      .catch((err) => {
        setPatients({
          ...Patients,
          loading: false,
          // errorManageMedicine: err.response.data.myResponse[0].error,
        });
      });
  }, [Patients.reload]);

//   const CryptoJS = require("crypto-js");

//   const decrypt = (encryptedPhoneNumber) => {
//     console.log(encryptedPhoneNumber);
//     const key = "24byte3DESencryptionkey!"; // Your encryption key
//     const decryptedPhoneNumber = CryptoJS.TripleDES.decrypt(encryptedPhoneNumber, key).toString(CryptoJS.enc.Utf8);
//     console.log(decryptedPhoneNumber);
//     return decryptedPhoneNumber;
// };
<<<<<<< HEAD
const decrypt = (encryptedBase64) => {
    console.log("Encrypted:", encryptedBase64); // Log the encrypted value

    const key = CryptoJS.enc.Utf8.parse('24byte3DESencryptionkey!');
    const iv = CryptoJS.enc.Hex.parse('0000000000000000');

    try {
        const decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(encryptedBase64)
        }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted Phone Number:", decryptedText); // Log the decrypted value
        
        return decryptedText;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};
=======
>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371




<<<<<<< HEAD
=======



>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371
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
<<<<<<< HEAD
      .delete(`http://localhost:4000/patient/${id}`, {
        withCredentials: true,
        headers: {
          token: auth.token,
        },
      })
=======
      .delete(`http://localhost:4000/patient/${id}`,{withCredentials: true},
       { headers: {
          token: auth.token,
        }},
      )
>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371
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
<<<<<<< HEAD
                    <td>{decrypt(Patient.Phone_Number)}</td>
=======
                    <td>{Patient.Phone_Number}</td>
>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371
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
<<<<<<< HEAD
                        to={`${Patient.id}`}
=======
                        to={Patient.id}
>>>>>>> 81148e8e9e97a9367aeed74c26c9c70688df1371
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