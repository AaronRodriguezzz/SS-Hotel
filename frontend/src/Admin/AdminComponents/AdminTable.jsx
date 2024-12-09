import { useEffect,useState,} from 'react';


const ReservationHistory = () => {

    const [adminAccounts, setAdminAccounts] = useState([]); // Filtered reservations
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Search input value
    const [updatedRole, setUpdatedRole] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);

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

    const handleChangeStatus = async (toChange, id) => {
        const data = {toChange, id};
        console.log(data);

        try{
            const response = await fetch('/api/update/adminStatus', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data)
            });

            if(response.ok){
                alert('Admin Updated');
                setIsUpdated(true)
            }
        }catch(err){
            console.log(err);
        }
    }   

    const handleChangeRole = async (toChange, id) => {
        const updatedRole = toChange === 'Demote' ? 'Admin' : 'Super Admin';
        const data = { updatedRole, id };

        try{
            const response = await fetch('/api/update/adminRole', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data)
            });

            if(response.ok){
                alert('Updated');
                setIsUpdated(true)

            }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchAdminAccts = async () => {    

            try{

                const response = await fetch('/api/admin-account');
                const data = await response.json();

                if(response.ok){
                    setAdminAccounts(data.adminAccts);
                    setFilteredAccounts(data.adminAccts)
                    setIsUpdated(false);
                }
        
            }catch(err){
                console.log(err);
            }
        }

        fetchAdminAccts()
    },[isUpdated]);


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
                                    <button style={{backgroundColor: "rgb(212, 188, 52)", color: "white", width:"100%", marginBottom: "9px"}}>Remove</button>
                                    <button style={{backgroundColor: "rgb(212, 188, 52)", color: "white", width:"100%", marginBottom: "9px", backgroundColor: accts.adminStatus === 'Enabled' ? 'red' : 'green'}}
                                            onClick={(e) => handleChangeStatus(e.target.textContent,accts._id)}
                                    >
                                        {accts.adminStatus === 'Enabled' ? "Disabled" : "Enabled"}
                                    </button>
                                    <button style={{backgroundColor: "rgb(212, 188, 52)", color: "white", width:"100%", backgroundColor: accts.role === 'Admin' ? 'green' : 'red' }}
                                            onClick={(e) => handleChangeRole(e.target.textContent,accts._id)}
                                    >
                                        {accts.role === 'Super Admin' ? "Demote" : "Promote"}
                                    </button>

                                </td>   
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

export default ReservationHistory;