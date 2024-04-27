import React from "react";
import ProductCard from "./components/ProductCard";
import './style/ProductList.css';
import {Stomach} from "../../core/data/StomachCat"

const StomachList = () => {
    
    const medsData=Stomach;
    const displayMids = ()=>{
        return medsData.map((item) => {
            return <ProductCard id={item.id} name={item.name} desc={item.description} img={item.Image} prc={item.price}/>;
        });
    };
    

    return (
    <div className="product-list">
      
        {medsData.length > 0 ? displayMids() : <h3>there in no products</h3>}
    </div>
    );
};

export default StomachList;