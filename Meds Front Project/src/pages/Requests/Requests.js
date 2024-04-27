import React, { useRef ,useState } from "react";
import { FcPlus } from "react-icons/fc";
import "../Requests/style/Requests.css"
function Requests () {
    const list = [
        {
            "id":1,
            "name":"sama",
            "email": "sama00@gmail.com",
            "request":"no orders yet"
    
        },
    
        {
            "id":2,
            "name":"ahmed",
            "email": "ahmed00@gmail.com",
            "request":"no orders yet"
    
        },
    
        {
            "id":3,
            "name":"hany",
            "email": "hany00@gmail.com",
            "request":"no orders yet"
    
        },
    
    ]
    const [lists, setlist] = useState(list)
    const [updateState, setUpdateState] = useState(-1)
return (
    <div><h1><FcPlus size = "2.5cm"/>Requests</h1>
     <div className='crud4'> 
     <div>
     <Add setlist = {setlist}/>
     <form onSubmit={handleSubmit}>
     <table>
                <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Requests</th>
                    <th>Action</th>
                </thead>
                {
                    lists.map((current)=> (
                        updateState === current.id ? <EditList current ={current} lists= {lists} setlist = {setlist}/> :
                        <tr> 
                            <td>{current.name}</td>
                            <td>{current.email}</td>
                            <td>{current.request}</td>
                            <td>
                                <button className="update" onClick={()=>handleEdit(current.id)}>Accept</button>
                                <button className="delete" type="button" onClick={() =>handleDelete(current.id) }>Decline</button>
                                <button className="update" onClick={()=>handleEdit(current.id)}>Update</button>
                            </td>
                        </tr>

                    ))
                }
                </table>
                </form>
                </div>
     </div> 
    </div>
 )      
    function handleEdit (id){
    setUpdateState(id)
    }
    function handleDelete(id){
        const newlist = lists.filter((li) => li.id !== id)
        setlist(newlist)
       
    }
    function handleSubmit(event){
        event.preventDefault()
        const name = event.target.elements.name.value
        const email= event.target.elements.email.value
        const request = event.target.elements.request.value
        const newlist = lists.map((li)=>(
            li.id === updateState ? {...li, name:name, email:email, request:request} : li
            ))
            setlist(newlist)
            setUpdateState(-1)
    
    }
}
function EditList({current, lists, setlist}){
    function handleInputname(event){
        const value = event.target.value;
        const newlist = lists.map((li)=>(
        li.id === current.id ? {...li, name:value} : li
        ))
        setlist(newlist)

    }
    function handleInputemail(event){
        const value = event.target.value;
        const newlist = lists.map((li)=>(
        li.id === current.id ? {...li, email:value} : li
        ))
        setlist(newlist)

    }
    function handleInputrequest(event){
        const value = event.target.value;
        const newlist = lists.map((li)=>(
        li.id === current.id ? {...li, request:value} : li
        ))
        setlist(newlist)

    }
    return(
        <tr>
            <td><input type="text" onChange={handleInputname} name="name" value={current.name}/></td>
            <td><input type="text" onChange = {handleInputemail}name="email" value={current.email}/></td>
            <td><input type="text" onChange = {handleInputrequest}name="request" value={current.request}/></td>
            <td><button type="submit">Update</button></td>
        </tr>
    )
    }
function Add({setlist}){
    const nameRef = useRef()
    const emailRef = useRef()
    const requestRef = useRef()
    function handleSubmit (event) {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const email = event.target.elements.email.value;
        const request = event.target.elements.request.value;
        const newlist = {
            id:4,
            name,
            email,
            request
        }
        setlist((prevlist) => {
            return prevlist.concat(newlist)
        })
        nameRef.current.value = ""
        emailRef.current.value = ""
        requestRef.current.value = ""
    }
    return(
        <form className="addForm" onSubmit={handleSubmit}>
            <input required type="text" name="name" placeholder="Enter Name" ref={nameRef}/>
            <input required type="email" name="email" placeholder="Enter Email" ref={emailRef}/>
            <input required type="text" name="request" placeholder="Enter Request" ref={requestRef}/>
            <button type="submit">Add</button>
        </form>

    )
}

export default Requests;