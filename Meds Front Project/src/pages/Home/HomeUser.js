import "../../css/Homecss.css"
 import { Link } from "react-router-dom";
 import React , {useState ,useEffect} from "react";
 import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios' ;
import Spinner from 'react-bootstrap/Spinner';
 

 function HomeUser() {

     const [medicines, setmedicines] = useState({
         loading: true,
         results: [],
         err: null,
         reload: 0,
       });
       
    
    //   const [search, setSearch] = useState("");
    
       useEffect(() => {
         setmedicines({ ...medicines, loading: true });
         axios
           .get("http://localhost:4000/category" , {
            
                withCredentials: true // This ensures cookies are sent with requests
              
           })
    
           .then((resp) => {
            console.log(resp);
         setmedicines({ ...medicines, results: resp.data, loading: false, err: null });
           })
           .catch((err) => {
             setmedicines({
               ...medicines,
               loading: false,
               err: " something went wrong, please try again later ! ",
             });
           });
       }, []);
    //   const searchmedicines = (e) => {
    //     e.preventDefault();
    //     setmedicines({ ...medicines, reload: medicines.reload + 1 });
    //   };

    return (
   <>
            {/* <form action role="search" className="SearchProductForm" noValidate>
           <input className="SearchProductInput" type="search" placeholder="Search For Any Product" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="512"/>
           <button className="SearchProductButton">Search</button>
            </form> */}

{/*             
  {medicines.loading === true && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}  */}
<div className="row m-5">
      <div className="categories container row">
      {Array.isArray(medicines.results) && medicines.results?.map((medicine) => (
 
    <div class="categorieslevel  now-color col-3">
        <p class="category-link ">
        {medicine.name}

                    </p>
      <div class="imgg">
        <img src={medicine.image_url} alt={medicine.name} class="sc-ivTmOn fRXJso"></img>
      </div>
      <Link to={'/ListMedicinesOfCategory/'+medicine.id}><button className="btn btn-success my-btn"> show more</button></Link>
    </div>

))}




</div>

</div>


            {/* <div className="categories">

                <div class="categorieslevel  now-color">
                    <li class="category-link">
                        <Link className="link" to={"/vitaminsCategory"}> Vitamins & Supplements</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://www.shutterstock.com/image-vector/vitamins-logo-template-original-design-260nw-786314116.jpg" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div> */}
                

{/* 

                <div className="categorieslevel  now-color">
                    <li class="category-link ">
                        <Link className="link" to={"/PainCategory"}> Pain Relief</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://www.shutterstock.com/image-vector/creative-human-spinal-chiropractic-physiotherapy-260nw-1581446494.jpg" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div>



                <div className="categorieslevel  now-color">
                    <li class="category-link ">
                        <Link className="link" to={"/StomachCategory"}> Stomach & Bowel</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://www.shutterstock.com/image-vector/stomach-logo-vector-illustration-design-260nw-1927350125.jpg" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div>



                <div class="categorieslevel  now-color">

                    <li class="category-link ">
                        <Link className="link" to={"/coughCouldCategory"}> Cough,Cold & Allergy</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://www.shutterstock.com/image-vector/allergy-symptoms-line-black-icon-260nw-1489776476.jpg" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div>



                <div class="categorieslevel  now-color">
                    <li class="category-link ">
                        <Link className="link" to={"/healthcareCategory"}> Health Care Devices</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://www.shutterstock.com/image-vector/cardiology-stethoscope-illustration-vector-logo-260nw-1789514060.jpg" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div>


                <div class="categorieslevel  now-color">
                    <li class="category-link ">
                        <Link className="link" to={"/EarCategory"}> Eye & Ear Medications</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://www.shutterstock.com/image-vector/ear-hearing-line-icon-outline-260nw-481973008.jpg" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div>


                <div class="categorieslevel  now-color">
                    <li class="category-link">
                        <Link className="link" to={"/babyCategory"}> Baby</Link>
                    </li>
                    <div class="imgg">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDWt6QybIYAcLaQ46YRI29XARyD3DVOiYMeg&usqp=CAU" class="sc-ivTmOn fRXJso"></img>
                    </div>
                </div>


*/}

                <div class="brands mt-32">
                    <div class="container">
                        <div class="d-flex align-items-center mb-3">
                            <div class="title">
                                <h2 class="header-extra mb-0">Brands</h2>
                            </div>
                        </div>
                        <div class="brands-carousel">
                            <div class="row">
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/AdWkNrqfIOlINyUd67k9igfaAnHxsPNQa5lguEdx.png" alt="brand-logo" class=" ls-is-cached lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/AdWkNrqfIOlINyUd67k9igfaAnHxsPNQa5lguEdx.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/GNL82eMHMCTzSCfuCWtDnG42yb9fNrZiyKEUvx2d.png" alt="brand-logo" class=" ls-is-cached lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/GNL82eMHMCTzSCfuCWtDnG42yb9fNrZiyKEUvx2d.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/I8k77avODG9cDiLWyjn4xZREa5y6KJu6blmXC4NQ.png" alt="brand-logo" class=" lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/I8k77avODG9cDiLWyjn4xZREa5y6KJu6blmXC4NQ.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/waxBWotcH3aqkMFkR88pqUFc8PVGYZOBpglnhd8i.png" alt="brand-logo" class=" lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/waxBWotcH3aqkMFkR88pqUFc8PVGYZOBpglnhd8i.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/BrLjX0kMUgATvHGUmw6Vs9EoGAHjsr9AoP5w77zP.png" alt="brand-logo" class=" lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/BrLjX0kMUgATvHGUmw6Vs9EoGAHjsr9AoP5w77zP.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/xcAeakqukJ7aKQbkaP38cgPY5FQAMPh0kOZG6pyy.png" alt="brand-logo" class=" lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/xcAeakqukJ7aKQbkaP38cgPY5FQAMPh0kOZG6pyy.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/vyWNkthUKrYlsOJl4prtIoEExIGRcMIwfrcaUGCN.png" alt="brand-logo" class=" lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/vyWNkthUKrYlsOJl4prtIoEExIGRcMIwfrcaUGCN.png" /></a>
                                    </div>
                                </div>
                                <div class="col-3 mb-4">
                                    <div class="brand-img"><a class="d-inline-block w-100">
                                        <img width="100px" height="100px" data-src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/XOsQRON3kV0T2RfJ7JyhoDtTBnx9eGsbC7vywAg5.png" alt="brand-logo" class=" lazyloaded" src="https://cdn.chefaa.com/filters:format(webp)/public/uploads/brands/XOsQRON3kV0T2RfJ7JyhoDtTBnx9eGsbC7vywAg5.png" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>



                </>


        
        

    );
}
 export default HomeUser