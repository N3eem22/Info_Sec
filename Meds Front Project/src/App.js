
import './style/App.css';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { Outlet } from 'react-router-dom';





function App () {
    return(
      <>
      <Header/>
      <Outlet/>
      <Footer/>
      </>
    );
};

export default App;
