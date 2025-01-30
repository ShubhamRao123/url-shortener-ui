import React, { useEffect, useState } from "react";
import styles from "./shortLinkTable.module.css";
import { getUserShortLinks } from "../../services/linkService";

const ShortLinkTable = ({ userId: propUserId }) => {
  const [shortLinks, setShortLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(
    propUserId || localStorage.getItem("userId")
  );

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing");
      setLoading(false);
      return;
    }

    const fetchShortLinks = async () => {
      try {
        const data = await getUserShortLinks(userId);
        console.log("Fetched short links:", data);
        setShortLinks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShortLinks();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
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
            <th>Clicks</th> {/* New Clicks column */}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {shortLinks.map((link) => (
            <tr key={link._id}>
              <td>{link.shortUrl}</td>
              <td>{link.originalUrl}</td>
              <td>{new Date(link.createdAt).toLocaleString()}</td>
              <td>
                {link.expiresAt
                  ? new Date(link.expiresAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>{link.remarks}</td>
              <td>{link.clicks || 0}</td> {/* Display clicks or default to 0 */}
              <td>
                {!link.expiresAt || new Date(link.expiresAt) > new Date()
                  ? "Active"
                  : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShortLinkTable;
