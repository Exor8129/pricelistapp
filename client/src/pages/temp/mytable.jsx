import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Pencil, Plus, Printer, Trash2,EyeOff } from "lucide-react";
import "../table/table.css";

const YourComponent = () => {
  const [categories, setCategories] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Fetch categories (categoryNames)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categoryNames");
        setCategories(response.data);  // Set categories state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch table data (pricelistData)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pricelistdata");
        setTableData(response.data);  // Set table data state
      } catch (error) {
        console.error("Error fetching pricelist data: ", error);
      }
    };
    fetchData();
  }, []);

  // Map categories to category names and convert _id to string
  const categoryMap = categories.reduce((map, category) => {
    const categoryId = category._id ? String(category._id.$oid || category._id) : null;  // Ensure it's a string
    if (categoryId) {
      map[categoryId] = category.Category_Name;
    }
    return map;
  }, {});

  // Log the categoryMap for debugging
  console.log("Category Map:", categoryMap);

  // Group the pricelistData based on Category_Name_id
  const groupedProducts = tableData.reduce((acc, row) => {
    const categoryId = String(row.Category_Name_id);  // Ensure it's a string

    // Check if categoryId exists in categoryMap
    if (!categoryMap[categoryId]) {
      console.log(`No category found for Category_Name_id: ${categoryId}`);
    }

    if (!acc[categoryId]) acc[categoryId] = [];  // Initialize an empty array if the category doesn't exist
    acc[categoryId].push(row);  // Add the product to the correct category
    return acc;
  }, {});

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by category or variant..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="search-bar"
          />
          <button className="user-buttons"
        //    onClick={() => openPopup(null)}
           ><Plus /></button>
          <button className="user-buttons"
        //    onClick={toggleVisibility}
           >
      {/* {isVisible ? <Eye /> : <EyeOff />} */}
    </button>

            
          
          {/* <PopupForm
            isOpen={isPopupOpen}
            onClose={closePopup}
            isEditMode={isEditMode}
            currentRow={currentRow}
            onSave={handleSave}  // Pass the save handler to the popup form
          /> */}
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
              {/* {isVisible && (
                <>
                  <th>Print</th>
                  <th>Actions</th>
                </>
              )} */}
            </tr>
          </thead>
          <tbody>
          {Object.keys(groupedProducts).length === 0 ? (
  <tr>
    <td colSpan="12" style={{ textAlign: "center" }}>
      No results found.
    </td>
  </tr>
) : (
  Object.entries(groupedProducts).map(([categoryId, rows], categoryIndex) => {
    const categoryName = categoryMap[categoryId] || "Uncategorized";
    return rows.map((row, index) => (
      <tr key={`${categoryId}-${row.Varrient}-${index}`}>
        {index === 0 && (
          <>
            {/* SL NO */}
            <td rowSpan={rows.length}>{categoryIndex + 1}</td>
            {/* Category Name */}
            <td rowSpan={rows.length}>{categoryName}</td>
          </>
        )}
        {/* Variant and other fields */}
        <td>{row.Varrient || "N/A"}</td>
        <td>{row.Single || "N/A"}</td>
        <td>{row["5+"] || "N/A"}</td>
        <td>{row["10+"] || "N/A"}</td>
        <td>{row["20+"] || "N/A"}</td>
        <td>{row["50+"] || "N/A"}</td>
        <td>{row["100+"] || "N/A"}</td>
        <td>{row["500+"] || "N/A"}</td>
        <td>{row.MRP || "N/A"}</td>
        {index === 0 && (
          <td rowSpan={rows.length}>{row.Images}</td> // Images in the table (if needed)
        )}
        {/* Action Buttons for Edit and Delete */}
        {/* {isVisible && (
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
        )} */}
      </tr>
    ));
  })
)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YourComponent;
