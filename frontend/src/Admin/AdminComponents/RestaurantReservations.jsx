import { useEffect,useState,} from 'react';
import { formatDate } from '../../utils/dateUtils';


const RestaurantReservations = () => {

    const [restaurantReservations, setRestaurantReservation] = useState([]); // Filtered reservations
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Search input value

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase(); // Normalize input for case-insensitivity
        setSearchQuery(query);

        if(query.trim() === ""){
            setFilteredAccounts(adminAccounts);
            return;
        }
        // Filter reservations based on the query
        const filtered = filteredAccounts.filter((bin) => {
            return (
                bin.date.toLowerCase().includes(query) || 
                bin.name.toLowerCase().includes(query) ||
                bin.email.toLowerCase().includes(query) || 
                bin.phoneNumber.toLowerCase().includes(query) ||
                bin.time.toLowerCase().includes(query)
            );
        });

        setFilteredAccounts(filtered);
    };

    useEffect(() => {
        const fetch_restaurant_reservations = async () => {    

            try{

                const response = await fetch('/api/restaurant/reservations');
                const data = await response.json();

                if(response.ok){
                    setRestaurantReservation(data.restaurant);
                    setFilteredAccounts(data.restaurant)
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetch_restaurant_reservations()
    },[]);


    const handle_cancel = async (id) => {
        console.log(id);
        try{

            if(confirm('Are you sure you want to remove this reservation?')){

                const response = await fetch(`/api/delete/restaurant_reservation/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                 })

                 if(response.ok){
                    const data = await response.json();
                    setFilteredAccounts(data.restaurant)
                    alert(data.message || 'Deleted')
                 }
            }

        }catch(err){
            console.log(err);
        }
    }


    return(
        <>

        
        <div className="parent-table-container">
            <input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={(e) => handleSearch(e)}
                style={{
                    marginBottom: "20px",
                    padding: "10px",
                    fontSize: "16px",
                    width: "40%",
                    borderRadius: "15px"
                }}
            />

            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Reservation Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Reservation Date</th>
                        <th>Reservation Time</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredAccounts && (filteredAccounts
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
                        .map((reservations, i) => {
                            console.log(reservations)
                            return (
                                <tr key={i}>
                                    <td>{reservations.name}</td>
                                    <td>{reservations.email}</td>
                                    <td>{reservations.phoneNumber}</td>
                                    <td>{formatDate(new Date(reservations.date))}</td>
                                    <td>{reservations.time}</td>
                                    <td><button onClick={() => handle_cancel(reservations._id)} style={{width:"100%"}}>Remove</button></td>
                                </tr>
                            )
                    }))}
                </tbody>
            </table>
            </div>
        </div>
        </>
       
    )
}

export default RestaurantReservations;