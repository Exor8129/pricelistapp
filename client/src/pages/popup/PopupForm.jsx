import React, { useState, useEffect } from "react";
import "./PopupForm.css";
import axios from "axios";

const PopupForm = ({
  isOpen,
  onClose,
  isEditMode,
  currentRow,
  onSave,
  onDelete,
}) => {
  const [selectedCategoryID, setSelectedCategoryID] = useState("");
  const [variant, setVariant] = useState("");
  const [single, setSingle] = useState("");
  const [fivePlus, setFivePlus] = useState("");
  const [tenPlus, setTenPlus] = useState("");
  const [twentyPlus, setTwentyPlus] = useState("");
  const [fiftyPlus, setFiftyPlus] = useState("");
  const [hundredPlus, setHundredPlus] = useState("");
  const [fiveHundredPlus, setFiveHundredPlus] = useState("");
  const [maximumRetailPrice, setmaximumRetailPrice] = useState("");
  const [gdl, setGDL] = useState("");
  const [gst, setGST] = useState("");
  const [categories, setCategories] = useState([]);

  const isValidObjectId = (id) => {
    // Regular expression for a 24-character hex string
    const objectIdPattern = /^[a-fA-F0-9]{24}$/;
    return objectIdPattern.test(id);
  };
  console.log("selectedRow  :", currentRow);

  if (isValidObjectId(currentRow)) {
    console.log("Valid ID format");
  } else {
    console.log("Invalid ID format");
  }

  useEffect(() => {
    if (isEditMode && currentRow) {
      // Log the currentRow to check the ID value
      console.log("Fetching data for ID:", currentRow);

      axios
        .get(`http://localhost:5000/api/pricelistdata/${currentRow}`)
        .then((response) => {
          const data = response.data;
          setVariant(data.Variant || "");
          setSingle(data.Single || "");
          setFivePlus(data["5+"] || ""); // Correct way to access the field with special character
          setTenPlus(data["10+"] || "");
          setTwentyPlus(data["20+"] || "");
          setFiftyPlus(data["50+"] || "");
          setHundredPlus(data["100+"] || "");
          setFiveHundredPlus(data["500+"] || "");
          setGDL(data.GDL || "");
          setGST(data.GST || "");
          setSelectedCategoryID(data.Category_Name_id || "");
          setmaximumRetailPrice(data.MRP || "");
        })
        .catch((error) => {
          console.error("Error fetching data for editing:", error);
        });
    }
  }, [isEditMode, currentRow]);

  // Fetch categories (categoryNames)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categoryNames"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value; // Get the selected Firebase ID

    const selectedCategory = categories.find((cat) => {
      // Check if the category _id matches the selectedId
      return cat._id && cat._id.toString() === selectedId; // MongoDB _id is an ObjectId, so convert to string for comparison
    });
    // console.log("selected Category is :",selectedCategory)
    if (selectedCategory) {
      // console.log("Selected Firebase ID:", selectedId);
      // console.log("Category Name:", selectedCategory.Category_Name);
      setSelectedCategoryID(selectedId); // Update the state with the selected ID
    } else {
      console.log("No category selected.");
    }
  };
  const handleVariantChange = (e) => setVariant(e.target.value);
  const handleSingleChange = (e) => setSingle(e.target.value);
  const handleFivePlusChange = (e) => setFivePlus(e.target.value);
  const handleTenPlusChange = (e) => setTenPlus(e.target.value);
  const handleTwentyPlusChange = (e) => setTwentyPlus(e.target.value);
  const handleFiftyPlusChange = (e) => setFiftyPlus(e.target.value);
  const handleHundredPlusChange = (e) => setHundredPlus(e.target.value);
  const handleFiveHundredPlusChange = (e) => setFiveHundredPlus(e.target.value);
  const handleMRPChange = (e) => setmaximumRetailPrice(e.target.value);
  const handleGDL = (e) => setGDL(e.target.value);
  const handleGST = (e) => setGST(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!variant || !single || !selectedCategoryID) {
      alert("Please fill out all the required fields!");
      return;
    }

    if (isEditMode && !currentRow) {
      alert("Invalid entry ID for update!");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to submit the data?"
    );
    if (!isConfirmed) {
      return;
    }

    // Prepare data to send to the backend
    const newData = {
      Category_Name_id: selectedCategoryID,
      Variant: variant,
      Single: parseFloat(single),
      "5+": fivePlus || "",
      "10+": tenPlus || "",
      "20+": twentyPlus || "",
      "50+": fiftyPlus || "",
      "100+": hundredPlus || "",
      "500+": fiveHundredPlus || "",
      MRP: maximumRetailPrice || "",
      GST: gst || "",
      GDL: gdl || "",
    };

    console.log("New Data to Submit:", newData); // Log the data to verify

    try {
      let response;
      if (isEditMode) {
        console.log("IN EDIT MODE");
        // If in edit mode, send a PUT request to update the entry
        response = await fetch(
          `http://localhost:5000/api/pricelistData/${currentRow}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
          }
        );
      } else {
        // If in add mode, send a POST request to create a new entry
        console.log("IN NEW DATA MODE");
        response = await fetch("http://localhost:5000/api/pricelistData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        });
      }

      const result = await response.json();
      if (response.ok) {
        alert(
          isEditMode
            ? "Changes saved successfully!"
            : "Data added successfully!"
        );
        onSave(); // Trigger parent component to refresh data
        onClose(); // Close the popup

        // Clear the form fields after successful submission
        setSelectedCategoryID("");
        setVariant("");
        setSingle("");
        setFivePlus("");
        setTenPlus("");
        setTwentyPlus("");
        setFiftyPlus("");
        setHundredPlus("");
        setFiveHundredPlus("");
        setmaximumRetailPrice("");
        setGDL("");
        setGST("");
      } else {
        alert("Failed to save data!");
        console.error(result);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data!");
    }
  };

  const handleDelete = async () => {
    if (!currentRow) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (isConfirmed) {
      try {
        // Make a DELETE request to the server with the current row's ID
        const response = await fetch(
          `http://localhost:5000/api/pricelistData/${currentRow._id}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert("Entry deleted successfully!");
          onDelete(currentRow._id); // Notify parent component to remove the deleted row from state
          onClose();
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

  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>{isEditMode ? "Edit Entry" : "Add New Entry"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Category:
            <select value={selectedCategoryID} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.Category_Name}{" "}
                    {/* Category name as visible text */}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </label>
          <label>
            Variant:
            <input
              type="text"
              value={variant}
              onChange={handleVariantChange}
              placeholder="Enter variant"
            />
          </label>
          <label>
            Single:
            <input
              type="text"
              value={single}
              onChange={handleSingleChange}
              placeholder="Enter price for Single"
            />
          </label>
          <label>
            5+:
            <input
              type="text"
              value={fivePlus}
              onChange={handleFivePlusChange}
              placeholder="Enter price for 5+"
            />
          </label>
          <label>
            10+:
            <input
              type="text"
              value={tenPlus}
              onChange={handleTenPlusChange}
              placeholder="Enter price for 10+"
            />
          </label>
          <label>
            20+:
            <input
              type="text"
              value={twentyPlus}
              onChange={handleTwentyPlusChange}
              placeholder="Enter price for 20+"
            />
          </label>
          <label>
            50+:
            <input
              type="text"
              value={fiftyPlus}
              onChange={handleFiftyPlusChange}
              placeholder="Enter price for 50+"
            />
          </label>
          <label>
            100+:
            <input
              type="text"
              value={hundredPlus}
              onChange={handleHundredPlusChange}
              placeholder="Enter price for 100+"
            />
          </label>
          <label>
            500+:
            <input
              type="text"
              value={fiveHundredPlus}
              onChange={handleFiveHundredPlusChange}
              placeholder="Enter price for 500+"
            />
          </label>
          <label>
            MRP+:
            <input
              type="text"
              value={maximumRetailPrice}
              onChange={handleMRPChange}
              placeholder={`Enter the MRP for ${variant}`}
            />
          </label>
          <label>
            Godown Location (GDL):
            <input
              type="text"
              value={gdl}
              onChange={handleGDL}
              placeholder={`Enter the GDL for ${variant}`}
            />
          </label>
          <label>
            GST:
            <input
              type="text"
              value={gst}
              onChange={handleGST}
              placeholder={`Enter the GST for ${variant}`}
            />
          </label>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? "Save Changes" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
