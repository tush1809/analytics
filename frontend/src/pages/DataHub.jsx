import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";

// 1. Import your new, configured 'analyticsApi' instance
import { analyticsApi } from '../api/axios'; 

import "./DataHub.css";

const DataHub = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);
      setHistory(null); // Clear previous history
      try {
        // 2. Use 'analyticsApi' to get history from the correct service
        const response = await analyticsApi.get('/api/predict/get-history');
        
        // Update state with the fetched history
        setHistory(response.data?.history);

      } catch (error) {
        // Check for a 404 Not Found error, which means no history exists
        if (error.response?.status === 404) {
          setHistory([]); // Set history to an empty array to show "No history" message
        } else {
          console.error("Failed to fetch history:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []); // The dependency array is empty to run this only once on mount

  return (
    <>
      <Header />
      <div className="datahub-container">
        <FileUpload />
        <div className="table-container">
          <div className="table-heading">Analytics History</div>
          {loading ? (
            <p>Loading history...</p>
          ) : history && history.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>{item.inputFileName}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No history available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DataHub;

