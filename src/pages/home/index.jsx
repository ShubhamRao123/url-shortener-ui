import React, { useEffect, useState } from "react";
import styles from "./home.module.css"; // Import CSS module
import Sidebar from "../../component/sidebar";
import Header from "../../component/header";
import { getUserAnalytics } from "../../services/dashboardServices";

function Home() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getUserAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
    return <div className={styles.loading}>Loading analytics...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />

      <div className={styles.content}>
        <h2>User Analytics</h2>

        <div className={styles.analyticsBox}>
          <h3>Total Clicks</h3>
          <p>{analytics.totalClicks}</p>
        </div>

        <div className={styles.analyticsBox}>
          <h3>Daily Clicks</h3>
          <ul>
            {analytics.dailyClicks.map((day, index) => (
              <li key={index}>
                {day.date}: {day.count} clicks
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.analyticsBox}>
          <h3>Device Usage</h3>
          <ul>
            {analytics.devices.map((device, index) => (
              <li key={index}>
                {device.deviceType}: {device.count} clicks
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
