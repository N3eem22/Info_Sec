import axios from "axios";

const  Decrypt = async (text)=>{
    let result = ''; 
     try { 
        const res = await axios.post('http://localhost:4000/auth/decrypt', {
            Phone_Number: text
        })
        return res.data.Phone_Number;  
     } catch(err) { 
        console.log(err); 
        return result;
     }
}

export default Decrypt;