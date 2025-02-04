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
  const [linksPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusSortOrder, setStatusSortOrder] = useState("active");

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

  const handleSortClick = () => {
    if (sortOrder === "desc") {
      setSortOrder("asc");
      const sortedLinks = [...shortLinks].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setShortLinks(sortedLinks);
    } else {
      setSortOrder("desc");
      const sortedLinks = [...shortLinks].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setShortLinks(sortedLinks);
    }
  };

  const handleStatusSortClick = () => {
    if (statusSortOrder === "active") {
      setStatusSortOrder("inactive");
      const sortedLinks = [...shortLinks].sort((a, b) => {
        const aStatus =
          !a.expiresAt || new Date(a.expiresAt) > new Date() ? 1 : 0;
        const bStatus =
          !b.expiresAt || new Date(b.expiresAt) > new Date() ? 1 : 0;
        return bStatus - aStatus;
      });
      setShortLinks(sortedLinks);
    } else {
      setStatusSortOrder("active");
      const sortedLinks = [...shortLinks].sort((a, b) => {
        const aStatus =
          !a.expiresAt || new Date(a.expiresAt) > new Date() ? 1 : 0;
        const bStatus =
          !b.expiresAt || new Date(b.expiresAt) > new Date() ? 1 : 0;
        return aStatus - bStatus;
      });
      setShortLinks(sortedLinks);
    }
  };

  return (
    <div className={styles.container}>
      <Header fetchShortLinks={fetchShortLinks} />
      <div className={styles.contentContainer}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  Date{" "}
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738668276/Icons_9_s2no4r.png"
                    alt=""
                    className={styles.sortIcon}
                    onClick={() => handleSortClick()}
                  />
                </th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>Remarks</th>
                <th>Clicks</th>
                <th>
                  Status{" "}
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738668276/Icons_9_s2no4r.png"
                    alt=""
                    className={styles.sortIcon1}
                    onClick={() => handleStatusSortClick()}
                  />
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLinks.map((link) => (
                <tr key={link._id}>
                  {/* <td>{new Date(link.createdAt).toLocaleString()}</td> */}
                  <td>
                    {new Date(link.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false, // This ensures 24-hour format
                    })}
                  </td>
                  {/* <td>{link.originalUrl}</td> */}
                  <td>
                    {link.originalUrl.split("/").slice(0, 3).join("/") + "..."}
                  </td>
                  <td className={styles.shortLinkCell}>
                    {link.shortUrl.split("/").slice(0, 3).join("/") + "..."}
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

                  <td>{link.remarks}</td>
                  <td>{link.clicks || 0}</td>
                  {/* <td className={styles.statusCell}>
                    {!link.expiresAt || new Date(link.expiresAt) > new Date()
                      ? "Active"
                      : "Inactive"}
                  </td> */}
                  <td
                    className={`${styles.statusCell} ${
                      !link.expiresAt || new Date(link.expiresAt) > new Date()
                        ? ""
                        : styles.inactive
                    }`}
                  >
                    {!link.expiresAt || new Date(link.expiresAt) > new Date()
                      ? "Active"
                      : "Inactive"}
                  </td>
                  <td>
                    <img
                      src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738319627/Icons_qfgahe.png"
                      alt="Edit"
                      onClick={() => handleEditClick(link)}
                      className={styles.editIcon}
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
                      className={styles.editIcon}
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
              className={styles.prevButton}
            >
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738679886/carat_iyudem.png"
                alt=""
              />
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
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738679885/carat_1_tmijdt.png"
                alt=""
              />
            </button>
          </div>

          {/* Edit Modal */}
          {isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <p>Edit Link</p>
                  <img
                    onClick={() => setIsModalOpen(false)}
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738233632/close_FILL0_wght400_GRAD0_opsz24_5_1_nhvtsa.png"
                    alt="Close"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <p className={styles.urlLabel}>
                  Destination Url <span>*</span>
                </p>
                <input
                  type="text"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className={styles.inputFieldModal}
                />
                <p className={styles.remarksLabel}>
                  Remarks <span>*</span>
                </p>
                <textarea
                  // type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={styles.inputFieldModal1}
                />
                <div className={styles.expirationContainer}>
                  <p>Link Expiration</p>
                  {/* <input
                  type="checkbox"
                  checked={hasExpiration}
                  onChange={() => setHasExpiration(!hasExpiration)}
                /> */}
                  <button
                    className={`${styles.toggleBtn} ${
                      hasExpiration ? styles.toggle : ""
                    }`}
                    onClick={() => setHasExpiration(!hasExpiration)}
                  >
                    <div
                      className={`${styles.thumb} ${
                        hasExpiration ? styles.thumbActive : ""
                      }`}
                    ></div>
                  </button>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className={styles.inputFieldModal}
                    disabled={!hasExpiration}
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <p
                    onClick={() => setIsModalOpen(false)}
                    className={styles.clearButton}
                  >
                    Cancel
                  </p>
                  <p
                    onClick={async () => {
                      await updateShortLink(selectedLink.shortCode, {
                        originalUrl: destinationUrl,
                        remarks,
                        expiresAt: hasExpiration ? expiresAt : null,
                      });
                      await handleLinkUpdate(); // Call handleLinkUpdate to refresh data
                    }}
                    className={styles.createButtonModal}
                  >
                    Save
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Links;
