import React from "react";
import { useParams } from "react-router-dom";
const Cart = () => {
    let {id} = useParams();
    console.log(id);
    return(
    <div>
        <p>added To Cart</p>
    </div>
    );
};
export default Cart;