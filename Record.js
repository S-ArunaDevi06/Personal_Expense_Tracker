import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getRecord, addRecord, deleteRecord } from "./api.js";
import { UserContext } from "./App.js";

const Record = () => {
  const { user } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    category: "food",
    amount: "",
    notes: ""
  });
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [originalRecord, setOriginalRecord] = useState(null);

  // Filters
  const [sortOrder, setSortOrder] = useState("desc");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchDate, setSearchDate] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  const fetchData = async () => {
    try {
      const res_records = await getRecord(user.email);
      setRecords(res_records.data);
    } catch (err) {
      console.error("Error fetching records", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      // Delete the original and add the new updated one
      await deleteRecord(user.email, originalRecord.date, originalRecord.category, originalRecord.amount, originalRecord.notes);
      await addRecord(user.email, formData.date, formData.category, formData.amount, formData.notes);
      setIsUpdateMode(false);
      setOriginalRecord(null);
    } else {
      await addRecord(user.email, formData.date, formData.category, formData.amount, formData.notes);
    }

    setFormData({ date: "", category: "food", amount: "", notes: "" });
    await fetchData();

    // Scroll to bottom to view new record
    setTimeout(() => {
      window.scrollTo({ top: 10000, behavior: "smooth" });
    }, 100);
  };

  const handleDelete = async (record) => {
    await deleteRecord(user.email, record.date, record.category, record.amount, record.notes);
    fetchData();
  };

  const handleUpdate = (record) => {
    setFormData({
      date: record.date,
      category: record.category,
      amount: record.amount,
      notes: record.notes,
    });
    setIsUpdateMode(true);
    setOriginalRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const parseDate = (d) => {
  const [dd, mm, yyyy] = d.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
};

const filteredRecords = records
  .filter(r =>
    (categoryFilter === "all" || r.category === categoryFilter) &&
    (searchDate === "" || r.date === searchDate) &&
    (priceRange === "all" ||
      (priceRange === "1" && r.amount < 100) ||
      (priceRange === "2" && r.amount >= 100 && r.amount <= 500) ||
      (priceRange === "3" && r.amount > 500))
  )
  .sort((a, b) => {
    const d1 = parseDate(a.date);
    const d2 = parseDate(b.date);
    return sortOrder === "asc" ? d1 - d2 : d2 - d1;
  });


  return (
    <div className="record-container">
      <nav>
        <ul className="nav-links">
          <li><Link to="/record">Add record</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to='/budget'>Manage Budget</Link></li>
        </ul>
      </nav>

      <h2 style={{marginLeft: '40rem'}}>Add New Record</h2>

      <form className="record-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="date"
          placeholder="dd-mm-yyyy"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="food">Food</option>
          <option value="education">Education</option>
          <option value="grocery">Grocery</option>
          <option value="accessories">Accessories</option>
          <option value="going out">Going Out</option>
          <option value="gifts">Gifts</option>
          <option value="others">Others</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit">{isUpdateMode ? "Update" : "Submit"}</button>
        </div>
      </form>

      <h2 style={{marginLeft: '41rem'}}>Your Records</h2>

      {/* FILTERS SECTION */}
      <div className="filters">
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Sort: Newest First</option>
          <option value="asc">Sort: Oldest First</option>
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="education">Education</option>
          <option value="grocery">Grocery</option>
          <option value="accessories">Accessories</option>
          <option value="going out">Going Out</option>
          <option value="gifts">Gifts</option>
          <option value="others">Others</option>
        </select>

        <input
          type="text"
          placeholder="Search by date (dd-mm-yyyy)"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="1">Below ₹100</option>
          <option value="2">₹100 - ₹500</option>
          <option value="3">Above ₹500</option>
        </select>
      </div>

      {/* RECORDS DISPLAY */}
      <ul className="record-list">
        {filteredRecords.map((r, index) => (
          <li key={index} className="record-card">
            <p><strong>Date:</strong> {r.date}</p>
            <p><strong>Category:</strong> {r.category}</p>
            <p><strong>Amount:</strong> ₹{r.amount}</p>
            <p><strong>Notes:</strong> {r.notes}</p>
            <div className="record-buttons">
              <button onClick={() => handleUpdate(r)}>Update</button>
              <button onClick={() => handleDelete(r)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .record-container {
          background-color: #121212;
          color: #e0e0e0;
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

        h2 {
          margin-top: 2rem;
          color: #bb86fc;
        }

        .record-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #1e1e1e;
          padding: 1.5rem;
          border-radius: 10px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }

        .record-form input,
        .record-form select {
          background-color: #2c2c2c;
          color: #fff;
          border: 1px solid #444;
          border-radius: 5px;
          padding: 0.5rem;
        }

        .form-buttons {
          display: flex;
          justify-content: center;
        }

        .form-buttons button {
          padding: 0.5rem 1rem;
          border: none;
          background: #03dac6;
          color: #000;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
        }

        .form-buttons button:hover {
          background: #018786;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 1rem auto;
          max-width: 700px;
          justify-content: center;
        }

        .filters input,
        .filters select {
          background-color: #2c2c2c;
          color: #fff;
          border: 1px solid #444;
          border-radius: 5px;
          padding: 0.5rem;
        }

        .record-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 1rem;
          max-width: 600px;
          margin: 2rem auto;
        }

        .record-card {
          background-color: #1e1e1e;
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 0 5px rgba(255,255,255,0.05);
        }

        .record-card p {
          margin: 0.25rem 0;
        }

        .record-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .record-buttons button {
          padding: 0.4rem 0.8rem;
          border: none;
          background: #03dac6;
          color: #000;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .record-buttons button:hover {
          background: #018786;
        }

        strong {
          color: #bb86fc;
        }
      `}</style>
    </div>
  );
};

export default Record;
