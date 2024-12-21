// src/pages/Admin/AdminModelUpload.jsx
import React, { useState } from "react";
import axios from "axios";

function AdminModelUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadModel = async () => {
    if (!file) {
      setMessage({ text: "Please select a model file!", type: "error" });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:5005/admin/upload-model", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: response.data.message || "Model uploaded successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to upload model.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5005/admin/download-model", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(response.data);
      link.download = "model.joblib";
      link.click();
    } catch (error) {
      alert("Failed to download model.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Model Management</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Upload or download your machine learning model</p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message.text && (
            <div className={`mb-4 p-4 rounded-md ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              <p>{message.text}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Model File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {!file ? (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" onChange={handleFileUpload} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">Joblib or pickle files up to 10MB</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-600">Selected file:</p>
                      <p className="text-md font-medium text-indigo-600">{file.name}</p>
                      <button onClick={() => setFile(null)} className="mt-2 text-sm text-red-600 hover:text-red-500">
                        Remove file
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={uploadModel}
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}>
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Upload Model"
                )}
              </button>

              <button
                onClick={downloadModel}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Download Current Model
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminModelUpload;
