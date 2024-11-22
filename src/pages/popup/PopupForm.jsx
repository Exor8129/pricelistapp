import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { app } from "../../firebase"; // Import Firebase app initialization
import "../popup/PopupForm.css";

const PopupForm = ({ isOpen, onClose, isEditMode, currentRow, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [variant, setVariant] = useState("");
  const [single, setSingle] = useState("");
  const [fivePlus, setFivePlus] = useState("");
  const [tenPlus, setTenPlus] = useState("");
  const [twentyPlus, setTwentyPlus] = useState("");
  const [fiftyPlus, setFiftyPlus] = useState("");
  const [hundredPlus, setHundredPlus] = useState("");
  const [fiveHundredPlus, setFiveHundredPlus] = useState("");

  const categories = [
    "Nebulizers",
    "Glucometers",
    "Steth",
    // Add more categories as needed
  ];

  // Set form fields for editing if in edit mode
  useEffect(() => {
    if (isEditMode && currentRow) {
      setSelectedCategory(currentRow.Category || "");
      setVariant(currentRow.Variant || "");
      setSingle(currentRow.Single || "");
      setFivePlus(currentRow["5+"] || "");
      setTenPlus(currentRow["10+"] || "");
      setTwentyPlus(currentRow["20+"] || "");
      setFiftyPlus(currentRow["50+"] || "");
      setHundredPlus(currentRow["100+"] || "");
      setFiveHundredPlus(currentRow["500+"] || "");
    } else {
      // Reset fields if not in edit mode
      setSelectedCategory("");
      setVariant("");
      setSingle("");
      setFivePlus("");
      setTenPlus("");
      setTwentyPlus("");
      setFiftyPlus("");
      setHundredPlus("");
      setFiveHundredPlus("");
    }
  }, [isEditMode, currentRow]);

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleVariantChange = (e) => setVariant(e.target.value);
  const handleSingleChange = (e) => setSingle(e.target.value);
  const handleFivePlusChange = (e) => setFivePlus(e.target.value);
  const handleTenPlusChange = (e) => setTenPlus(e.target.value);
  const handleTwentyPlusChange = (e) => setTwentyPlus(e.target.value);
  const handleFiftyPlusChange = (e) => setFiftyPlus(e.target.value);
  const handleHundredPlusChange = (e) => setHundredPlus(e.target.value);
  const handleFiveHundredPlusChange = (e) => setFiveHundredPlus(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmation before submitting the data
    const isConfirmed = window.confirm("Are you sure you want to submit the data?");
    if (!isConfirmed) {
      return; // Do nothing if the user clicked "No"
    }

    // Create or update data object
    const newData = {
      Category: selectedCategory,
      Variant: variant,
      Single: single,
      "5+": fivePlus,
      "10+": tenPlus,
      "20+": twentyPlus,
      "50+": fiftyPlus,
      "100+": hundredPlus,
      "500+": fiveHundredPlus,
    };

    try {
      const db = getFirestore(app);
      if (isEditMode && currentRow) {
        // If in edit mode, update the document
        const docRef = doc(db, "pricelistdata", currentRow.id);
        await updateDoc(docRef, newData);
        alert("Entry updated successfully!");
      } else {
        // If not in edit mode, add a new document
        await addDoc(collection(db, "pricelistdata"), newData);
        alert("Data added successfully!");
      }

      onClose(); // Close the popup after submitting
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save data!");
    }
  };

  const handleDelete = async () => {
    if (!currentRow) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
    if (isConfirmed) {
      try {
        const db = getFirestore(app);
        const docRef = doc(db, "pricelistdata", currentRow.id);
        await deleteDoc(docRef);
        alert("Entry deleted successfully!");
        onDelete(currentRow.id);  // Notify parent component to remove the deleted row from state
        onClose();
      } catch (error) {
        console.error("Error deleting document: ", error);
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
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Variant:
            <input type="text" value={variant} onChange={handleVariantChange} placeholder="Enter variant" />
          </label>
          <label>
            Single:
            <input type="text" value={single} onChange={handleSingleChange} placeholder="Enter price for Single" />
          </label>
          <label>
            5+:
            <input type="text" value={fivePlus} onChange={handleFivePlusChange} placeholder="Enter price for 5+" />
          </label>
          <label>
            10+:
            <input type="text" value={tenPlus} onChange={handleTenPlusChange} placeholder="Enter price for 10+" />
          </label>
          <label>
            20+:
            <input type="text" value={twentyPlus} onChange={handleTwentyPlusChange} placeholder="Enter price for 20+" />
          </label>
          <label>
            50+:
            <input type="text" value={fiftyPlus} onChange={handleFiftyPlusChange} placeholder="Enter price for 50+" />
          </label>
          <label>
            100+:
            <input type="text" value={hundredPlus} onChange={handleHundredPlusChange} placeholder="Enter price for 100+" />
          </label>
          <label>
            500+:
            <input type="text" value={fiveHundredPlus} onChange={handleFiveHundredPlusChange} placeholder="Enter price for 500+" />
          </label>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? "Save Changes" : "Submit"}
            </button>
            {isEditMode && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete Entry
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
