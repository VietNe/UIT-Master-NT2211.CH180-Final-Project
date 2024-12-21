import React, { useState } from "react";
import axios from "axios";

function EmailSpamChecker() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setEmailText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5005/spam/check", {
        data: [emailText],
      });
      setResult(response.data.prediction[0] === 1 ? "Spam" : "Not Spam");
    } catch (error) {
      console.error("Error:", error);
      alert("Error detecting spam: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Email Spam Detection</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="emailText" className="text-sm font-medium text-gray-700 block">
                Enter Email Text
              </label>
              <textarea
                id="emailText"
                value={emailText}
                onChange={handleChange}
                className="w-full h-40 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out resize-none"
                placeholder="Paste your email content here to check for spam..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Analyze Email
            </button>
          </form>
          {result && (
            <div
              className={`mt-6 rounded-lg p-6 transition-all duration-300 ease-in-out ${
                result === "Spam" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
              }`}>
              <div className="flex items-center space-x-3">
                <span className={`text-lg font-semibold ${result === "Spam" ? "text-red-600" : "text-green-600"}`}>Result:</span>
                <span className={`text-lg ${result === "Spam" ? "text-red-600" : "text-green-600"}`}>{result}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailSpamChecker;
