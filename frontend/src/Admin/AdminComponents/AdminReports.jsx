import { CChart } from '@coreui/react-chartjs';
import { useEffect, useState } from 'react';
import './AdminReports.css'
import { formatDateTime } from '../../utils/dateUtils';

const AdminReports = () => {
    const [reports, setReports] = useState();
    const [payments, setPayments] = useState();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getReports = async () => {
        try{
            const response = await fetch('/api/payment/reports');
            if(response.ok){
                const result = await response.json();
                setReports(result);
            }
        }catch(err){

        }
    }

    const getPayments = async () => {
        try{
            const response = await fetch('/api/payment');
            if(response.ok){
                const result = await response.json();
                return result
            }
        }catch(err){

        }
    }

    useEffect(() => {
        const setData = async ()   => {
            setPayments(await getPayments());
            getReports();
        }

        setData();
    }, [])
    
    useEffect(() => {
        const filterPayments = async () => {
            if(startDate <= endDate &&  startDate != '' && endDate != ''){
                const payments = await getPayments();
                setPayments(payments.filter(payment => payment.createdAt > startDate && payment.createdAt < endDate));
            }
        }
        filterPayments();
    }, [startDate, endDate])

    const clear = async () => {
        setPayments(await getPayments())
        setStartDate('')
        setEndDate('')
    }

          // Function to generate CSV data
  const generateCSV = () => {
        const csvRows = [];
        const headers = ['Room Type', 'Guest Name', 'Check-In Date', 'Check-Out Date', 'Payment Method', 'Date Paid', 'Amount'];
        csvRows.push(headers.join(',')); // Add header row

        // Add data rows
        payments.forEach(row => {
        const values = [row.roomType, row.guestName, formatDateTime(new Date(row.checkInDate)), formatDateTime(new Date(row.checkOutDate)), row.paymentMethod, formatDateTime(new Date(row.createdAt)), row.totalPrice]
        csvRows.push(values);
        });

        // Create a Blob from the CSV string
        const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);

        // Create a link to download the CSV
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'payments_report.csv';
        link.click();
    };
    

    return(
        <div className='admin-reports'>
            <h2>Reports</h2>
            <div className='top-divs-container'>
                <div>
                    <img src="/photos/peso.png" alt="" />
                    <div>
                    <p>Incomes this month</p>
                    <h3>{reports?.incomes_this_month ? `₱ ${reports.incomes_this_month.toFixed(2)}` : 'No incomes'}</h3>
                    </div>
                </div>
                <div>
                    <img src="/photos/peso.png" alt="" />
                    <div>
                    <p>Incomes this week</p>
                    <h3>{reports?.incomes_this_week ? `₱ ${reports.incomes_this_week.toFixed(2)}` : 'No incomes'}</h3>
                    </div>
                </div>
                <div>
                    <img src="/photos/peso.png" alt="" />
                    <div>
                    <p>Incomes this day</p>
                    <h3>{reports?.incomes_today ? `₱ ${reports.incomes_today.toFixed(2)}` : 'No incomes'}</h3>
                    </div>
                </div>

            </div>
            <div className='chart-container'>
            <CChart
                    type="bar"
                    style={{ width: '100%', height: '400px' }}
                    data={{
                        labels: [
                            "January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"
                            ],
                            datasets: [
                                {
                                    label: 'Incomes this year',
                                    backgroundColor: '#2a4b60',
                                    data: reports?.incomes_per_month,
                                },
                                ]
                      }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                            plugins: {
                            legend: {
                                display: true,
                            },
                            },
                        }}
                    />
            </div>
            <div className='parent-table-container'>
            <h3>Payments</h3>
            <div className='filter-container'>
                <div>
                    <p>From</p>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                </div>
                <div>
                    <p>To</p>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <button onClick={() => clear()}>Clear</button>
            </div>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Room Type</th>
                            <th>Guest Name</th>
                            <th>Status</th>
                            <th>Check-In Date</th>
                            <th>Check-Out Date</th>
                            <th>Payment Method</th>
                            <th>Date Paid</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments && payments.map(payment => {
                            return(
                                <tr key={payment._id}>
                                    <td>{payment.roomType}</td>
                                    <td>{payment.guestName}</td>
                                    <td>{payment.status}</td>
                                    <td>{formatDateTime(new Date(payment.checkInDate))}</td>
                                    <td>{formatDateTime(new Date(payment.checkOutDate))}</td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>{formatDateTime(new Date(payment.createdAt))}</td>
                                    <td>{payment.totalPrice}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='bottom-container'>
            <h3>Total: {payments && payments.reduce((total, payment) => payment.totalPrice + total, 0).toFixed(2) }</h3>
            <button onClick={generateCSV}>Export</button>
            </div>
            </div>
        </div>
    )
}

export default AdminReports