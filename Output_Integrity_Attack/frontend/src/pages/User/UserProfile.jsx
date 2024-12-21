import React, { useState, useEffect } from "react";
import axios from "axios";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      try {
        const response = await axios.get(`http://localhost:5005/user/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all hover:scale-[1.02]">
          {userData ? (
            <>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-10">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-white p-2 mx-auto mb-4">
                    <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-600">{userData.username?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{userData.username}</h2>
                  <span className="inline-block bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">{userData.role}</span>
                </div>
              </div>

              <div className="px-8 py-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.username || "Not provided"}</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium text-gray-500">Role</h3>
                      <p className="mt-1 text-lg text-gray-900">{userData.role || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
