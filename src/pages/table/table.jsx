import React, { useState, useEffect } from 'react';
import PopupForm from "../popup/PopupForm";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebase"; // Import Firebase app initialization

import './table.css';

const FixedTable = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const openPopup = () => setPopupOpen(true);
    const closePopup = () => setPopupOpen(false);

    // Fetch data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore(app);
            try {
                const querySnapshot = await getDocs(collection(db, "pricelistdata"));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTableData(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
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

    return (
        <div className="table-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by category or variant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                    className="search-bar"
                />
                <button
                    onClick={openPopup}
                    style={{ padding: "10px 20px", margin: "20px" }}
                >
                    Open Popup
                </button>
                <PopupForm isOpen={isPopupOpen} onClose={closePopup} />
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
        Object.entries(groupedData).map(([category, rows], categoryIndex) => {
            return rows.map((row, index) => (
                <tr key={`${category}-${row.Variant}-${index}`}>
                    {index === 0 && (
                        <>
                            {/* SL NO */}
                            <td rowSpan={rows.length}>{categoryIndex + 1}</td>
                            {/* Category */}
                            <td rowSpan={rows.length}>{category}</td>
                            {/* Images column - only for the first row in each category */}
                            <td rowSpan={rows.length}>
                                {row.IMAGE ? (
                                    <img
                                        src={row.IMAGE}
                                        alt={`${category} Image`}
                                        style={{ width: "100px", height: "auto" }}
                                    />
                                ) : (
                                    "No Image"
                                )}
                            </td>
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
                </tr>
            ));
        })
    )}
</tbody>
            </table>
        </div>
    );
};

export default FixedTable;
