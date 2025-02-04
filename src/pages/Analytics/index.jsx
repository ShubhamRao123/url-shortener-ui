import React, { useEffect, useState } from "react";
import {
  getUserShortLinks,
  getShortLinkResponses,
} from "../../services/linkService";
import styles from "./analytics.module.css";
import Header from "../../component/header";
import Sidebar from "../../component/sidebar";

function Analytics() {
  const [shortLinks, setShortLinks] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing");
      setLoading(false);
      return;
    }

    const fetchShortLinks = async () => {
      try {
        const data = await getUserShortLinks(userId);
        setShortLinks(data);

        // Fetch responses for each short link
        let allResponses = [];
        for (const link of data) {
          const response = await getShortLinkResponses(link.shortCode);
          if (response.responses) {
            allResponses = [
              ...allResponses,
              ...response.responses.map((res) => ({
                ...res,
                originalUrl: link.originalUrl,
                shortUrl: link.shortUrl,
              })),
            ];
          }
        }
        setResponses(allResponses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShortLinks();
  }, [userId]);

  // // Calculate total pages based on responses count
  const totalPages = Math.ceil(responses.length / rowsPerPage);

  // Ensure the current page is within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [responses, totalPages, currentPage]);

  // Handle page change
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get responses for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentResponses = responses.slice(indexOfFirstRow, indexOfLastRow);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  Timestamp{" "}
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738668276/Icons_9_s2no4r.png"
                    alt=""
                    className={styles.sortIcon}
                  />
                </th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>ip address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {currentResponses.map((response, index) => (
                <tr key={index}>
                  {/* <td>{new Date(response.createdAt).toLocaleString()}</td> */}
                  <td>
                    {new Date(response.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false, // This ensures 24-hour format
                    })}
                  </td>
                  {/* <td>{response.originalUrl}</td> */}
                  <td>
                    {response.originalUrl.split("/").slice(0, 3).join("/") +
                      "..."}
                  </td>
                  {/* <td>{response.shortUrl}</td> */}
                  <td>
                    {response.shortUrl.split("/").slice(0, 3).join("/") + "..."}
                  </td>
                  {/* <td>{response.ipAddress}</td> */}
                  <td>{response.ipAddress.split(",")[0]}</td>
                  <td>
                    {response.userDevice.match(/[a-zA-Z]+(?=[^a-zA-Z]*$)/)[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? styles.active : ""}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
