import React from "react";
import "../style/ProductCard.css";


import { Link } from "react-router-dom";
const ProductCard = (props) => {
    return(
    <div className="product-card">
        <div className="card-top">
            <img src={props.img} alt="product-card" />
        </div>
        <div className="card-info">
            <h4 className="title">{props.name}</h4>
            <p className="info">{props.desc}</p>
            <h3 className="Price">{props.prc} </h3>
            <button>
                <Link to={"/add-to-cart/" + props.id}>Add to Cart</Link>   
            </button>
        </div>
    </div>
    );
};
export default ProductCard;