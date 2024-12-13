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
import EmailVerification from './pages/EmailVerification';
import AdminRoute from './routes/adminRoute';
import Calendar from './Components/Calendar';
import TermsAndConditions from './pages/TermsAndConditions';
import RestaurantForm from './pages/RestaurantReservationForm';

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
              exact path='/restaurant-form'
              element={<RestaurantForm />}
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

            <Route element={<AdminRoute />}>
              <Route 
                exact path='/admin' 
                element={<AdminPage />} 
              />
            </Route>

            <Route 
              exact path='/email_verification'
              element={<EmailVerification />} 
            />

            <Route 
              exact path='/calendar'
              element={<Calendar />} 
            />  

            <Route 
              exact path='/terms-and-conditions'
              element={<TermsAndConditions />}
            />
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
