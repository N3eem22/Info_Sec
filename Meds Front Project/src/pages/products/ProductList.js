import React from "react";
import ProductCard from "./components/ProductCard";
import './style/ProductList.css';
//import {Data} from "../../core/Data/Meds";
//import {Data} from "../../core/Data/Meds"
import {Data} from "../../core/data/Meds"
const ProductList = () => {
    const medsData=Data;
    const displayMids = ()=>{
        return medsData.map((item) => {
            return <ProductCard key={item.id} name={item.name} desc={item.description} img={item.Image}/>;
        });
    };

    return (<div className="product-list">
        {medsData.length > 0 ? displayMids() : <h3>there in no products</h3>}
        </div>
    );
};
export default ProductList;