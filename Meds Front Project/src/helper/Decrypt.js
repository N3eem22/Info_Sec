import axios from "axios";

const Decrypt = async (text)=>{
    try { 
        const value = await axios.get('localhost:4000/auth/decrypt', {Phone_Number : text}); 
        console.log(value); 
    } catch(err) { 
        console.log(err);
    }
}
export default Decrypt;