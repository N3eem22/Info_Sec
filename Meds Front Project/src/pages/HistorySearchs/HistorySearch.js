import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios'
import { getAuthUser } from '../../helper/Storage';
import "../../css/HistorySearch.css";

const History = () => {
  const Auth=  getAuthUser();
const [history,setHistory]=useState({
    loading: false,
    results: null,
    err: null,
    reload: 0
});
useEffect(() => {

    setHistory({...history, loading: true});
    axios.
    get("http://localhost:4000/search/HistorySearches/" + Auth.id, {
      withCredentials: true // This ensures cookies are sent with requests
    }, {
      headers: {
          token: Auth.token,
      },
      })

     .then((resp)=>{
        console.log(resp);
        setHistory({...history, results: resp.data, loading: false, err: null});
    }).catch((err)=>{
        console.log(err);
      setHistory({...history, loading: false, err: "something went wrong"});

    })
  }, [history.reload]);

  const data = {
    columns: [
    //   {
    //     label: 'id',
    //     field: 'destination',
    //     sort: 'asc',
    //     width: 70
    //   },
      {
        label: 'KeyWord',
        field: 'coul1',
        sort: 'asc',
        width: 70
      },
      {
        label: 'id',
        field: 'coul2',
        sort: 'asc',
        width: 70
      }
    ],
    rows: history.results ? history.results.map((result) => ({
        destination: result.id,
        coul1: result.key_word,
        coul2: result.id,
      })) : []

  };

  return (

    <MDBDataTable
      striped
      bordered
      sortable
      data={data}
      className="custom_table m-5"
    />

  );
}
export default History;