
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './Components/Dashboard/Admin';
import Layout from './Components/Dashboard/Layout';
import Techsupport from './Components/Dashboard/Techsupport';
import User from './Components/Dashboard/User';
import Login from './Components/Login';
import Registration from './Components/Registration';



function App() {
  return (
<>
    
    <div className="App">
  
 <BrowserRouter>
     <Routes>

     <Route path="/" element={<Login></Login>}></Route> 
<Route path="/registration" element={<Registration></Registration>}></Route> 
          <Route path="/layout" element={<Layout />}> 
         
           <Route path="/layout/user" element={<User/>}/>
           <Route path="/layout/admin" element={<Admin/>}/>
            <Route path="/layout/techsupport" element={<Techsupport/>}/>
           
           
           </Route>
    
      
     </Routes>
     </BrowserRouter>
   
    </div>
   
    </>
  );
}

export default App;
