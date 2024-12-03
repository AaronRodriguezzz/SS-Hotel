import {BrowserRouter, Routes, Route} from 'react-router-dom';
//pages
import LandingPage from './pages/LandingPage';
import Restaurant from './pages/Restaurant';
import RoomInfo from './pages/RoomsInfo';
import Amenities from './pages/Amenities';
import AdminLogin from './Admin/AdminUnprotected/AdminLogin';
import BookNow from './pages/BookNow';
import BookConfirm from './pages/RoomConfirmation';
import AdminPage from './Admin/AdminInterface/AdminLandingPage'
import ProtectedRoute from './Admin/AdminComponents/ProtectedRoute';
import Emailverification from './pages/EmailVerification';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route 
              exact path='/'
              element={<LandingPage />}
            />

            <Route 
              exact path='/restaurant'
              element={<Restaurant />}
            />

            <Route 
              exact path='/room/:key'
              element={<RoomInfo />}
            />     

            <Route 
              exact path='/amenities'
              element={<Amenities />}
            />   

            <Route 
              exact path='/admin/login'
              element={<AdminLogin />}
            />   

            <Route 
              exact path='/booknow'
              element={<BookNow />}
            />  

            <Route 
              exact path='/booking/confirmation'
              element={<BookConfirm />}
            />    

            <Route 
              exact path='/admin'
              element={<AdminPage />} 
            />

            <Route 
              exact path='/email_verification'
              element={<Emailverification />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
