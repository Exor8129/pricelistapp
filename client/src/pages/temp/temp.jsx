import React, { useState, useEffect } from "react";
import PopupForm from "../popup/PopupForm";
import { Eye, Pencil, Plus, Printer, Trash2,EyeOff } from "lucide-react";
import "../table/table.css";
import axios from "axios";

const FixedTable = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);  // Flag for edit mode
  const [currentRow, setCurrentRow] = useState(null);  // Selected row data
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [categories, setCategories] = useState([]);

  const openPopup = (row) => {
    setCurrentRow(row);  // Set the row data to be edited
    setIsEditMode(true);  // Set edit mode
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsEditMode(false);
    setCurrentRow(null);  // Reset current row
  };
// Fetch date from MongoDB

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categoryNames");
      setCategories(response.data);
      // console.log(categories)
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  fetchCategories();
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pricelistdata");
      setTableData(response.data);
      response.data.forEach(tableData=>console.log(tableData.
        Varrient))
    } catch (error) {
      console.error("Error fetching pricelist data: ", error);
    }
  };
  fetchData();
}, []);



  // Filter data based on search term
  const filteredData = tableData.filter(
    (row) =>
      row.Category?.toLowerCase().includes(searchTerm) ||
      row.Variant?.toLowerCase().includes(searchTerm)
  );

 // Group data by category
const groupedData = filteredData.reduce((acc, row) => {
  const category = row.Category || "Uncategorized";
  if (!acc[category]) acc[category] = [];
  acc[category].push(row);
  return acc;
}, {});

// Toggle function to switch between Eye and EyeOff
  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
    if (isConfirmed) {
      const db = getFirestore(app);
      try {
        await deleteDoc(doc(db, "pricelistdata", id));
        setTableData(tableData.filter(row => row.id !== id));  // Remove from table
        alert("Entry deleted successfully!");
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete entry!");
      }
    }
  };

  // Handle save (edit) action
  const handleSave = async (updatedData) => {
    if (!currentRow) return;

    const db = getFirestore(app);
    try {
      const docRef = doc(db, "pricelistdata", currentRow.id);
      await updateDoc(docRef, updatedData);
      setTableData(
        tableData.map((row) =>
          row.id === currentRow.id ? { ...row, ...updatedData } : row
        )
      );  // Update the table with new data
      alert("Entry updated successfully!");
      closePopup();
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update entry!");
    }
  };

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by category or variant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="search-bar"
          />
          <button className="user-buttons" onClick={() => openPopup(null)}><Plus /></button>
          <button className="user-buttons" onClick={toggleVisibility}>
      {isVisible ? <Eye /> : <EyeOff />}
    </button>

            
          
          <PopupForm
            isOpen={isPopupOpen}
            onClose={closePopup}
            isEditMode={isEditMode}
            currentRow={currentRow}
            onSave={handleSave}  // Pass the save handler to the popup form
          />
        </div>
        <table className="fixed-table">
          <thead>
            <tr>
              <th>SL NO</th>
              <th>Category</th>
              <th>Variant</th>
              <th>Single</th>
              <th>5+</th>
              <th>10+</th>
              <th>20+</th>
              <th>50+</th>
              <th>100+</th>
              <th>500+</th>
              <th>MRP</th>
              <th>Images</th>
              {/* Conditionally render the Print and Actions columns */}
              {isVisible && (
                <>
                  <th>Print</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No results found.
                </td>
              </tr>
            ) : (
              Object.entries(groupedData).map(
                ([category, rows], categoryIndex) => {
                  return rows.map((row, index) => (
                    <tr key={`${category}-${row.Variant}-${index}`}>
                      {index === 0 && (
                        <>
                          {/* SL NO */}
                          <td rowSpan={rows.length}>{categoryIndex + 1}</td>
                          {/* Category */}
                          <td rowSpan={rows.length}>{category}</td>
                        </>
                      )}
                      {/* Variant and other fields */}
                      <td>{row.Variant || "N/A"}</td>
                      <td>{row.Single || "N/A"}</td>
                      <td>{row["5+"] || "N/A"}</td>
                      <td>{row["10+"] || "N/A"}</td>
                      <td>{row["20+"] || "N/A"}</td>
                      <td>{row["50+"] || "N/A"}</td>
                      <td>{row["100+"] || "N/A"}</td>
                      <td>{row["500+"] || "N/A"}</td>
                      <td>{row.MRP || "N/A"}</td>
                      {index === 0 && (                      
                          <td rowSpan={rows.length}>{row.Images}</td>                        
                      )}
                       
                      {/* Action Buttons for Edit and Delete */}
                      {isVisible && (
                        <>
                          {index === 0 && (                      
                          <td rowSpan={rows.length}><button onClick={() => openPopup(row)} className="user-buttons"><Printer/></button></td>                        
                      )}
                          <td>
                            <button onClick={() => openPopup(row)} className="user-buttons">
                              <Pencil />
                            </button>
                            <button onClick={() => handleDelete(row.id)} className="user-buttons">
                              <Trash2 />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ));
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedTable;
