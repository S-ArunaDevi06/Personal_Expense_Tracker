import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getRecord } from "./api";
import { UserContext } from "./App";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#03dac6', '#bb86fc', '#ff9800', '#f44336', '#4caf50', '#2196f3', '#9c27b0'];

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (user?.email) {
      getRecord(user.email)
        .then(res => setRecords(res.data))
        .catch(err => console.error("Error fetching records", err));
    }
  }, [user]);

  const filterRecords = (records) => {
    if (filterType === "all" || filterValue.trim() === "") return records;

    return records.filter((r) => {
      const [day, month, year] = r.date.split("-");
      switch (filterType) {
        case "day":
          return r.date === filterValue;
        case "month":
          return `${month}-${year}` === filterValue;
        case "year":
          return year === filterValue;
        default:
          return true;
      }
    });
  };

  const filteredRecords = filterRecords(records);

  const totalExpense = filteredRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);

  const categoryData = Object.values(
    filteredRecords.reduce((acc, r) => {
      acc[r.category] = acc[r.category] || { name: r.category, value: 0 };
      acc[r.category].value += parseFloat(r.amount);
      return acc;
    }, {})
  );

  const trendData = Object.values(
    filteredRecords.reduce((acc, r) => {
      acc[r.date] = acc[r.date] || { date: r.date, amount: 0 };
      acc[r.date].amount += parseFloat(r.amount);
      return acc;
    }, {})
  ).sort((a, b) =>
    new Date(a.date.split("-").reverse().join("-")) -
    new Date(b.date.split("-").reverse().join("-"))
  );

  const recentRecords = [...filteredRecords].sort((a, b) =>
    new Date(b.date.split("-").reverse().join("-")) -
    new Date(a.date.split("-").reverse().join("-"))
  ).slice(0, 5);

  return (
    <div className="dashboard-container">
      <nav>
        <ul className="nav-links">
          <li><Link to="/record">Add Record</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to='/budget'>Manage Budget</Link></li>
        </ul>
      </nav>

      <h1>Dashboard</h1>

      <div className="filter-section">
        <label>Filter By:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="day">Day (dd-mm-yyyy)</option>
          <option value="month">Month (mm-yyyy)</option>
          <option value="year">Year (yyyy)</option>
        </select>
        <input
          type="text"
          placeholder="Enter value (e.g., 05-2025)"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <div className="summary">
        <h2>Total Expense: <span className="amount">₹{totalExpense.toFixed(2)}</span></h2>
      </div>

      <div className="charts">
        <div className="chart-box">
          <h3>Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Daily Expense Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="rgb(12, 99, 90)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-records">
        <h3>Recent Records</h3>
        <ul>
          {recentRecords.map((r, index) => (
            <li key={index}>
              <strong>{r.date}</strong> - ₹{r.amount} on {r.category} [{r.notes}]
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .dashboard-container {
          background-color: #121212;
          color:rgb(43, 16, 119);
          padding: 2rem;
          font-family: "Segoe UI", sans-serif;
          min-height: 100vh;
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

        h1, h2, h3 {
          color: #bb86fc;
        }

        .summary {
          margin-top: 1rem;
          margin-bottom: 2rem;
          font-size: 1.25rem;
        }

        .amount {
          color: #03dac6;
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          color: #90caf9;
        }

        .filter-section input, .filter-section select {
          padding: 0.5rem;
          border-radius: 5px;
          border: none;
          background-color: #2c2c2c;
          color: white;
        }

        .charts {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .chart-box {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 10px;
          flex: 1 1 45%;
          min-width: 300px;
        }

        .recent-records {
          margin-top: 2rem;
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 10px;
        }

        .recent-records ul {
          list-style: none;
          padding: 0;
        }

        .recent-records li {
          margin-bottom: 0.5rem;
          color:white;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
