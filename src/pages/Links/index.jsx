import React, { useEffect, useState } from "react";
import Header from "../../component/header";
import Sidebar from "../../component/sidebar";
import {
  deleteShortLink,
  getUserShortLinks,
  updateShortLink,
} from "../../services/linkService";
import toast from "react-hot-toast";
import styles from "./links.module.css";
import { useLocation } from "react-router-dom";

function Links() {
  const [shortLinks, setShortLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  // Fetch user's short links
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
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShortLinks();
  }, [userId]); // Fetch links when userId changes

  const fetchShortLinks = async () => {
    try {
      const data = await getUserShortLinks(userId);
      setShortLinks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (link) => {
    setSelectedLink(link);
    setDestinationUrl(link.originalUrl);
    setRemarks(link.remarks || "");
    setHasExpiration(!!link.expiresAt);
    setExpiresAt(
      link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ""
    );
    setIsModalOpen(true);
  };

  // Call this function after successfully updating a link
  const handleLinkUpdate = async () => {
    await fetchShortLinks(); // Refresh short links immediately
    setIsModalOpen(false); // Close modal
  };

  // Filter shortLinks based on searchQuery (remarks)
  const filteredLinks = searchQuery
    ? shortLinks.filter((link) =>
        link.remarks?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shortLinks;

  // Handle pagination
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  // Reset currentPage to 1 when searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header fetchShortLinks={fetchShortLinks} />
      <Sidebar />
      <div>
        <h2>Short Links</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Short Link</th>
              <th>Original URL</th>
              <th>Created At</th>
              <th>Expires At</th>
              <th>Remarks</th>
              <th>Clicks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentLinks.map((link) => (
              <tr key={link._id}>
                <td>
                  {link.shortUrl}
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738322390/Frame_1350840231_ej3cvw.png"
                    alt="Copy"
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(link.shortUrl)
                        .then(() => toast.success("Short URL copied!"))
                        .catch((err) => console.error("Copy failed: ", err));
                    }}
                  />
                </td>
                <td>{link.originalUrl}</td>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
                <td>
                  {link.expiresAt
                    ? new Date(link.expiresAt).toLocaleString()
                    : "N/A"}
                </td>
                <td>{link.remarks}</td>
                <td>{link.clicks || 0}</td>
                <td>
                  {!link.expiresAt || new Date(link.expiresAt) > new Date()
                    ? "Active"
                    : "Inactive"}
                </td>
                <td>
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738319627/Icons_qfgahe.png"
                    alt="Edit"
                    onClick={() => handleEditClick(link)}
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738319627/Icons_1_co154s.png"
                    alt="Delete"
                    onClick={async () => {
                      try {
                        await deleteShortLink(link.shortCode);
                        setShortLinks((prevLinks) =>
                          prevLinks.filter(
                            (shortLink) =>
                              shortLink.shortCode !== link.shortCode
                          )
                        );
                      } catch (error) {
                        console.error("Delete error:", error);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
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
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Edit Link</h2>
                <img
                  onClick={() => setIsModalOpen(false)}
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738233632/close_FILL0_wght400_GRAD0_opsz24_5_1_nhvtsa.png"
                  alt="Close"
                  style={{ cursor: "pointer" }}
                />
              </div>
              <label>Destination URL:</label>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className={styles.inputField}
              />
              <label>Remarks:</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className={styles.inputField}
              />
              <div className={styles.expirationContainer}>
                <label>Expiration:</label>
                <input
                  type="checkbox"
                  checked={hasExpiration}
                  onChange={() => setHasExpiration(!hasExpiration)}
                />
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className={styles.inputField}
                  disabled={!hasExpiration}
                />
              </div>
              <div className={styles.buttonContainer}>
                <button
                  onClick={async () => {
                    await updateShortLink(selectedLink.shortCode, {
                      originalUrl: destinationUrl,
                      remarks,
                      expiresAt: hasExpiration ? expiresAt : null,
                    });
                    await handleLinkUpdate(); // Call handleLinkUpdate to refresh data
                  }}
                  className={`${styles.button} ${styles.createButton}`}
                >
                  Save
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`${styles.button} ${styles.clearButton}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Links;
