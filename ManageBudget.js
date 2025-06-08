import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "./App.js";
import { getRecord, getBudget, setBudget, updateBudget } from "./api.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label
} from 'recharts';

const Budget = () => {
  const { user } = useContext(UserContext);
  const [budget, setBudgetState] = useState(0);
  const [inputBudget, setInputBudget] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchBudget();
      getRecord(user.email)
        .then((res) => {
          setRecords(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching records:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const fetchBudget = () => {
    getBudget(user.email)
      .then((res) => {
        if (res.data && res.data.budget) {
          setBudgetState(res.data.budget);
        } else {
          setBudgetState(0);
        }
      })
      .catch((err) => console.error("Error fetching budget:", err));
  };

  const handleSetBudget = () => {
    const numericBudget = parseFloat(inputBudget);
    if (!isNaN(numericBudget) && numericBudget > 0 && budget === 0) {
      setBudget(user.email, numericBudget)
        .then(() => {
          fetchBudget();
          setInputBudget("");
        })
        .catch(err => console.error("Error setting budget", err));
    }
  };

  const handleUpdateBudget = () => {
    const numericBudget = parseFloat(inputBudget);
    if (!isNaN(numericBudget) && numericBudget > 0 && budget > 0) {
      updateBudget(user.email, numericBudget)
        .then(() => {
          fetchBudget();
          setInputBudget("");
        })
        .catch(err => console.error("Error updating budget", err));
    }
  };

  const getCurrentMonthTotal = () => {
    const currentDate = new Date();
    return records.reduce((sum, r) => {
      const [day, month, year] = r.date.split("-");
      if (
        parseInt(month) === currentDate.getMonth() + 1 &&
        parseInt(year) === currentDate.getFullYear()
      ) {
        return sum + parseFloat(r.amount);
      }
      return sum;
    }, 0);
  };

  const totalSpent = getCurrentMonthTotal();
  const remaining = Math.max(budget - totalSpent, 0);
  const percentageUsed = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const getAlertMessage = () => {
    if (budget === 0) return null;
    const percentage = (totalSpent / budget) * 100;
    if (percentage >= 100) return { message: "You have exceeded your budget!", color: "red" };
    if (percentage >= 90) return { message: "You have used over 90% of your budget.", color: "orange" };
    if (percentage >= 75) return { message: "You have used over 75% of your budget.", color: "yellow" };
    return null;
  };

  const alertStatus = getAlertMessage();

  // Monthly spend chart data
  const monthlyMap = new Map();
  records.forEach((r) => {
    const [_, month, year] = r.date.split("-");
    const key = `${month}-${year}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + parseFloat(r.amount));
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = Array.from(monthlyMap.entries())
    .map(([key, amount]) => {
      const [month, year] = key.split("-");
      return {
        month: `${monthNames[parseInt(month) - 1]} ${year}`,
        amount: amount,
        sortKey: new Date(`${year}-${month}-01`)
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  const maxMonthlySpend = Math.max(...monthlyData.map(d => d.amount), 0);
  const yAxisMax = Math.ceil(Math.max(maxMonthlySpend, budget) * 1.1); // Add 10% buffer

  return (
    <div className="budget-container">
      <nav>
        <ul className="nav-links">
          <li><Link to="/record">Add Record</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/budget">Manage Budget</Link></li>
        </ul>
      </nav>


      <div className="set-budget">
        <h1>Set or Update Budget</h1>
        <input
          type="number"
          placeholder="Enter your budget (₹)"
          value={inputBudget}
          onChange={(e) => setInputBudget(e.target.value)}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSetBudget} disabled={budget !== 0}>
            Set Budget
          </button>
          <button onClick={handleUpdateBudget} disabled={budget === 0} style={{ marginLeft: "1rem" }}>
            Update Budget
          </button>
        </div>
      </div>

      {alertStatus && (
        <div className="alert-box" style={{ backgroundColor: alertStatus.color }}>
          <strong>{alertStatus.message}</strong>
        </div>
      )}

      <div className="dashboard">
        <h2>Budget Dashboard</h2>
        {loading ? <p>Loading...</p> : (
          <>
            <p><strong>Budget Set:</strong> ₹{budget}</p>
            <p><strong>Total Spent (This Month):</strong> ₹{totalSpent.toFixed(2)}</p>
            <p><strong>Remaining:</strong> ₹{remaining.toFixed(2)}</p>

            <div className="progress-bar">
              <div
                className="fill"
                style={{
                  width: `${percentageUsed}%`,
                  backgroundColor:
                    percentageUsed >= 100 ? "red" :
                    percentageUsed >= 90 ? "orange" :
                    percentageUsed >= 75 ? "yellow" :
                    "#03dac6"
                }}
              ></div>
            </div>

            <h3 style={{ marginTop: "2rem" }}>Monthly Spend Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
  <BarChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis domain={[0, yAxisMax]} />
    <Tooltip />
    <Bar dataKey="amount" fill="#03dac6" />
    {budget > 0 && (
      <ReferenceLine y={budget} stroke="red" strokeDasharray="3 3">
        <Label
          value={`Budget: ₹${budget}`}
          position="top"
          fill="red"
          fontSize={12}
        />
      </ReferenceLine>
    )}
  </BarChart>
</ResponsiveContainer>

          </>
        )}
      </div>

      <style jsx>{`
        .budget-container {
          background-color: #121212;
          color: #ffffff;
          padding: 2rem;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 1rem;
          background-color: #1e1e1e;
          padding: 1rem;
          border-radius: 8px;
        }

        .nav-links li a {
          color: #90caf9;
          text-decoration: none;
          font-weight: bold;
        }

        h1, h2 {
          color: #bb86fc;
        }

        .set-budget {
          margin-top: 1rem;
          margin-bottom: 2rem;
        }

        .set-budget input {
          padding: 0.5rem;
          margin-right: 1rem;
          border-radius: 5px;
          border: none;
        }

        .set-budget button {
          padding: 0.5rem 1rem;
          background-color: #03dac6;
          border: none;
          border-radius: 5px;
          color: #000;
          font-weight: bold;
          cursor: pointer;
        }

        .set-budget button:disabled {
          background-color: #444;
          cursor: not-allowed;
        }

        .alert-box {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          color: #000;
          font-weight: bold;
        }

        .dashboard {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 10px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background-color: #333;
          border-radius: 10px;
          margin-top: 1rem;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          transition: width 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Budget;
