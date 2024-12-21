// src/pages/Admin/AdminPrediction.jsx
import React, { useState } from "react";
import axios from "axios";

function AdminPrediction() {
  const [inputData, setInputData] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePrediction = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/admin/prediction",
        { data: inputData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      alert("Error making prediction");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Prediction</h2>
      <textarea
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        rows="4"
        className="w-full border p-3 mb-4"
        placeholder="Enter input data for prediction"
      />
      <button onClick={handlePrediction} className="bg-blue-500 text-white px-6 py-2 rounded-md">
        Make Prediction
      </button>

      {prediction && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h3 className="text-xl font-bold">Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default AdminPrediction;
