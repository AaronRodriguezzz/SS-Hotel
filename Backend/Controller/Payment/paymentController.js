const jwt = require('jsonwebtoken');

const createPaymentCheckout = async (req, res) => {
    try{
        const { selectedRooms } = req.body;
            console.log(req.body);
            const line_items = selectedRooms.map((room,i) => {
                return {currency: 'PHP', amount: room.price * 100 , name: room.roomType, quantity: parseInt(req.body.roomCount[i])}
            })

            const token = jwt.sign(req.body, process.env.JWT_SECRET);
            res.cookie('checkoutData', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            
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
                      cancel_url: 'http://localhost:5173/booknow',
                      line_items,
                      success_url: 'http://localhost:4001/api/reserve',
                      payment_method_types: ['card', 'gcash', 'paymaya', 'brankas_metrobank'],
                      description: 'dasdsadsa'
                    }
                  }
                })
              };
              const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)

              if(response.ok){
                const result = await response.json();
                res.status(200).json(result)
              }
        
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message})
    }
}


const create_walkIn_Payment = async (req, res) => {
  try{
      const { selectedRooms } = req.body;
          
          
          const line_items = selectedRooms.map((room,i) => {
              return {currency: 'PHP', amount: room.price * 100 , name: room.roomType, quantity: 1}
          })

          const token = jwt.sign(req.body, process.env.JWT_SECRET);
          res.cookie('checkoutData', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
          
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
                    cancel_url: 'http://localhost:5173/booknow',
                    line_items,
                    success_url: 'http://localhost:4001/api/reserve',
                    payment_method_types: ['card', 'gcash', 'paymaya', 'brankas_metrobank'],
                    description: 'dasdsadsa'
                  }
                }
              })
            };
            const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)

            if(response.ok){
              const result = await response.json();
              res.status(200).json(result)
            }
      
  }catch(err){
      console.log(err)
      res.status(400).json({error: err.message})
  }
}

module.exports = {
    createPaymentCheckout
}