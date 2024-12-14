const jwt = require('jsonwebtoken');
const Payment = require('../../Models/payment');
const { get_incomes_today, get_incomes_per_month, get_incomes_this_month, get_incomes_this_week  } = require('../../services/incomesService');
const Reservation = require('../../Models/HotelSchema/RoomSchedules');
const url = process.env.NODE_ENV === 'production' ? 'https://ss-hotel.onrender.com' : 'http://localhost:5173';

const createPaymentCheckout = async (req, res) => {
    try{  
        
        const { rooms } = req.body;
        const line_items = rooms.map((room,i) => {
          return {currency: 'PHP', amount: room.price * 100 , name: room.roomType, quantity: 1}
        })
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  authorization: 'Basic c2tfdGVzdF9RaHROOGZMRGlFVThndXdQVW9yV0FMenU6'
                },

                body: JSON.stringify({
                  data: {
                    attributes: {
                      send_email_receipt: true,
                      show_description: false,
                      show_line_items: true,
                      cancel_url: `${url}/booknow`,
                      line_items,
                      success_url: `${url}/api/reserve`,
                      payment_method_types: ['card', 'gcash', 'paymaya', 'brankas_metrobank'],
                      description: 'dasdsadsa'
                    }
                  }
                })
              };
              const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
              if(response.ok){
                const result = await response.json();
                const token = jwt.sign({...req.body, payment_checkout_id: result.data.id}, process.env.JWT_SECRET);
                res.cookie('checkoutData', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.status(200).json(result)
              }
        
    }catch(err){
        console.log('error' , err)
        res.status(400).json({error: err.message})
    }
}

const get_payments = async (req, res) => {
  try{
    const payments = await Payment.find({status: 'Completed'}).sort({createdAt: -1});
    const completedPayments = await Promise.all(payments.map(async (payment) => {
      const reservation = await Reservation.findById(payment.reservation_id);
      return {
        totalPrice: payment.totalPrice,
        status: payment.status,
        guestName: reservation?.guestName || '',
        checkInDate: reservation?.checkInDate || '',
        checkOutDate: reservation?.checkOutDate || '',
        paymentMethod: payment.payment_checkout_id ? 'Online Payment' : 'Cash',
        roomType: reservation?.roomType,
        createdAt: payment.createdAt
      }
    }))

    res.status(200).json(completedPayments);

  }catch(err){  
    console.log(err)
    res.status(400).json({error: err.message});
  }
}

const get_reports = async (req, res) => {
  try{
    const incomes_today = await get_incomes_today();
    const incomes_this_month = await get_incomes_this_month();
    const incomes_per_month = await get_incomes_per_month();
    const incomes_this_week = await get_incomes_this_week();

    res.status(200).json({incomes_today, incomes_this_week, incomes_per_month, incomes_this_month});

  }catch(err){
    res.status(400).json({error: err.message});
  }
}


module.exports = {
    createPaymentCheckout,
    get_payments,
    get_reports
}