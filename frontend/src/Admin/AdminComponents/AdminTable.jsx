import { useEffect,useState,} from 'react';


const ReservationHistory = () => {

    const [adminAccounts, setAdminAccounts] = useState([]); // Filtered reservations
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
                bin.role.toLowerCase().includes(query) || 
                bin.addedBy.toLowerCase().includes(query) ||
                bin.lastName.toLowerCase().includes(query) || 
                bin.firstName.toLowerCase().includes(query) ||
                bin.email.toLowerCase().includes(query) ||
                bin.contactNum.toLowerCase().includes(query) 
            );
        });

        setFilteredAccounts(filtered);
    };

    useEffect(() => {
        const fetchAdminAccts = async () => {    

            try{

                const response = await fetch('http://localhost:4001/admin-account');
                const data = await response.json();

                if(response.ok){
                    setAdminAccounts(data.adminAccts);
                    setFilteredAccounts(data.adminAccts)
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchAdminAccts()
    },[]);


    return(
        <>

        
        <div class="table-container">
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

            <table>
                <thead>
                    <tr>
                        <th>Admin Id</th>
                        <th>Added By</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredAccounts && (filteredAccounts.map(accts => {
                        return(
                            <tr key={accts.role}>
                                <td>{accts._id}</td>
                                <td>{accts.addedBy}</td>
                                <td>{accts.lastName}, {accts.firstName}</td>
                                <td>{accts.email}</td>
                                <td>{accts.contactNum}</td>
                                <td>{accts.role}</td>
                                <td>{accts.createdAt}</td>
                                <td>
                                    <button style={{backgroundColor: "rgb(212, 188, 52)", color: "white", width:"110"}}>Remove</button>
                                </td>
                            </tr>
                        )
                    }))}
                </tbody>
            </table>
        </div>
        </>
       
    )
}

export default ReservationHistory;