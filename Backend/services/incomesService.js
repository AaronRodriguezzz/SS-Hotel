const Payment = require("../Models/payment");

const get_incomes_today = async () => {
  const now = new Date();

  // Set the start of today (00:00:00)
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  // Set the end of today (23:59:59.999)
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  try {
    // Use aggregation to find payments created today
    const payments = await Payment.aggregate([
      {
        $match: {
          status: 'Completed'
        }
      },
      {
        $match: {
          createdAt: {
            $gte: startOfDay, // Greater than or equal to the start of today
            $lte: endOfDay    // Less than or equal to the end of today
          }
        }
      },
      {
        $project: {
          total: "$totalPrice"
        }
      }
    ]);

    // Sum up the totalPrice of all payments made today
    const totalIncome = payments.reduce((total, payment) => total + payment.total, 0);
    return totalIncome;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const get_incomes_per_month = async () =>{
    const currentYear = new Date().getFullYear();
    try{
        let incomes_array = new Array(12);        
        const incomesPerMonth = await Payment.aggregate([
            {
                $match: { status: 'Completed' }
            },
            {
              $project: {
                year: { $year: "$createdAt" }, 
                month: { $month: "$createdAt" },
                total: "$totalPrice", 
              }
            },
            {
              $match: {
                year: currentYear,
              }
            },
            {
              $group: {
                _id: { year: "$year", month: "$month" }, 
                total: { $sum: "$total" }, 
              }
            },
            {
              $sort: { "_id.year": 1, "_id.month": 1 }
            }
          ]);
        incomesPerMonth.forEach(income => {
            incomes_array[income._id.month-1] = income.total
        });

        return incomes_array
    }catch(err){
        return null
    }
} 

const get_incomes_this_month = async () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  try {
    // Use aggregate for aggregation queries
    const payments = await Payment.aggregate([
      {
        $match: { status: 'Completed' }
      },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          total: "$totalPrice"
        }
      },
      {
        $match: {
          year: currentYear,
          month: currentMonth
        }
      }
    ]);

    // Sum up the totalPrice of all payments
    const totalIncome = payments.reduce((total, payment) => total + payment.total, 0);
    return totalIncome;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const get_incomes_this_week = async () => {
  const now = new Date();

  // Get the current day of the week (0-6, where 0 = Sunday, 1 = Monday, etc.)
  const currentDayOfWeek = now.getDay();

  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)); // Set to Monday

  // Get the current date and time (today)
  const endOfWeek = now;

  try {
    // Use the aggregation pipeline to fetch payments within this week
    const payments = await Payment.aggregate([
      {
        $match: { status: 'Completed' }
      },
      {
        $match: {
          createdAt: {
            $gte: startOfWeek, // Greater than or equal to the start of the week
            $lte: endOfWeek    // Less than or equal to today
          }
        }
      },
      {
        $project: {
          total: "$totalPrice"
        }
      }
    ]);

    // Sum up the totalPrice of all payments this week
    const totalIncome = payments.reduce((total, payment) => total + payment.total, 0);
    return totalIncome;
  } catch (err) {
    console.log(err);
    return null;
  }
};


module.exports = { 
    get_incomes_per_month,
    get_incomes_today,
    get_incomes_this_month,
    get_incomes_this_week
}