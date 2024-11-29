import React, { useState, useEffect } from "react";
import PopupForm from "../popup/PopupForm";
import { Eye, Pencil, Plus, Printer, Trash2, EyeOff } from "lucide-react";
import "../table/table.css";
import axios from "axios";
import image1 from "../../assets/image1.jpg"

const FixedTable = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode
  const [currentRow, setCurrentRow] = useState(null); // Selected row data
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [refreshData, setRefreshData] = useState(false);

  const openPopup = (row) => {
    console.log("SelectedRowssss:",row)
    setCurrentRow(row); // Set the row data to be edited
    setIsEditMode(true); // Set edit mode
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsEditMode(false);
    setCurrentRow(null); // Reset current row
  };

  // Fetch categories (categoryNames)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categoryNames");
        setCategories(response.data); // Set categories state
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
        setTableData(response.data); // Set table data state
        response.data.forEach((item) => {
          console.log("Category_Name_id:", item.
            Variant);
        });
      } catch (error) {
        console.error("Error fetching pricelist data: ", error);
      }
    };
    fetchData();
  }, [refreshData]);

  // Map categories to category names and convert _id to string
  const categoryMap = categories.reduce((map, category) => {
    const categoryId = category._id ? String(category._id.$oid || category._id) : null; // Ensure it's a string
    if (categoryId) {
      map[categoryId] = category.Category_Name;
    }
    return map;
  }, {});

  // Group the pricelistData based on Category_Name_id
  const groupedProducts = tableData.reduce((acc, row) => {
    const categoryId = String(row.Category_Name_id); // Ensure it's a string

    if (!acc[categoryId]) acc[categoryId] = []; // Initialize an empty array if the category doesn't exist
    acc[categoryId].push(row); // Add the product to the correct category
    return acc;
  }, {});

  // Filter the groupedProducts based on search term (search by category or variant)
  const filteredGroupedProducts = Object.entries(groupedProducts)
    .map(([categoryId, rows]) => {
      // Get the category name
      const categoryName = categoryMap[categoryId] || "Uncategorized";

      // Filter the rows within this category where the Variant matches the search term
      const filteredRows = rows.filter((row) =>
        row.Varrient?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search in Variant
        categoryName.toLowerCase().includes(searchTerm.toLowerCase()) // Search in Category Name
      );

      // Only return the category if it has at least one matching product
      if (filteredRows.length > 0) {
        return [categoryId, filteredRows]; // Return the category with the filtered rows
      }

      return null; // If no matching products, return null
    })
    .filter(Boolean); // Remove null values

  // Toggle function to switch between Eye and EyeOff
  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };
  //Add New Data
  const newDataHandling=()=>{
    // setCurrentRow(row); // Set the row data to be edited
    setIsEditMode(false); // Set edit mode
    setPopupOpen(true);
  }
  // Handle delete action
  const handleDelete = async (id) => {
    if (!id) return;
  
    const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
    if (isConfirmed) {
      try {
        // Make a DELETE request to the server with the passed ID
        const response = await fetch(`http://localhost:5000/api/pricelistData/${id}`, {
          method: "DELETE",
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Entry deleted successfully!");
          setRefreshData((prev) => !prev);
        } else {
          alert("Failed to delete entry!");
          console.error(result);
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert("Failed to delete data!");
      }
    }
  };

  // Handle save (edit) action
  const handleSave = () => {
    setRefreshData((prev) => !prev); // Toggle refreshData to trigger data re-fetch
  };


  return (
    <div className="main-container">
      <div className="table-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by category or variant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <button className="user-buttons" onClick={newDataHandling}>
            <Plus />
          </button>
          <button className="user-buttons" onClick={toggleVisibility}>
            {isVisible ? <Eye /> : <EyeOff />}
          </button>
          <PopupForm
            isOpen={isPopupOpen}
            onClose={closePopup}
            isEditMode={isEditMode}
            currentRow={currentRow}
            onSave={handleSave} // Pass the save handler to the popup form
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
              <th>GDL</th>
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
            {filteredGroupedProducts.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No results found.
                </td>
              </tr>
            ) : (
              filteredGroupedProducts.map(([categoryId, rows], categoryIndex) => {
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
                    <td>{row.Variant || "N/A"}</td>
                    <td>{row.Single || "N/A"}</td>
                    <td>{row["5+"] || "N/A"}</td>
                    <td>{row["10+"] || "N/A"}</td>
                    <td>{row["20+"] || "N/A"}</td>
                    <td>{row["50+"] || "N/A"}</td>
                    <td>{row["100+"] || "N/A"}</td>
                    <td>{row["500+"] || "N/A"}</td>
                    <td>{row.MRP || "N/A"}</td>
                    <td>{row.GDL || "N/A"}</td>
                    {index === 0 && (
                      <td rowSpan={rows.length}><img className="category-image" src={image1}></img></td> // Images in the table (if needed)
                    )}
                    {/* Action Buttons for Edit and Delete */}
                    {isVisible && (
                      <>
                        {index === 0 && (
                          <td rowSpan={rows.length}>
                            <button onClick={() => openPopup(row)} className="user-buttons">
                              <Printer />
                            </button>
                          </td>
                        )}
                        <td className="action-col">
                          <button onClick={() => openPopup(row._id)} className="user-buttons">
                            <Pencil />
                          </button>
                          <button onClick={() => handleDelete(row._id)} className="user-buttons">
                            <Trash2 />
                          </button>
                        </td>
                      </>
                    )}
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

export default FixedTable;
