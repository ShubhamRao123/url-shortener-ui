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

  if (loading) return <div className={styles.loading}>Loading ...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.analyticsBox1}>
              <h3>Total Clicks</h3>
              <p>{analytics.totalClicks}</p>
            </div>
            <div className={styles.analyticsBoxContainer}>
              <div className={styles.analyticsBox2}>
                <h3>Date-wise Clicks</h3>

                <ul>
                  {analytics.dailyClicks
                    .slice()
                    .reverse()
                    .map((day, index) => (
                      <li key={index}>
                        {day.date}
                        <svg width="10%" height="20">
                          <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="15"
                            fill="#f3f7fd"
                            rx="2"
                          />
                          <line
                            x1="0"
                            y1="10"
                            x2={
                              (day.count /
                                Math.max(
                                  ...analytics.dailyClicks.map((d) => d.count)
                                )) *
                              100
                            }
                            y2="10"
                            stroke="#1b48da"
                            strokeWidth="15 "
                          />
                        </svg>
                        {day.count}
                      </li>
                    ))}
                </ul>
              </div>

              <div className={styles.analyticsBox3}>
                <h3>Device Usage</h3>
                <ul>
                  {analytics.devices.map((device, index) => (
                    <li key={index}>
                      {device.deviceType === "Phone"
                        ? "Mobile"
                        : device.deviceType.charAt(0).toUpperCase() +
                          device.deviceType.slice(1)}
                      <svg width="10%" height="20">
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="15"
                          fill="#f3f7fd"
                          rx="2"
                        />
                        <line
                          x1="0"
                          y1="10"
                          x2={
                            (device.count /
                              Math.max(
                                ...analytics.devices.map((d) => d.count)
                              )) *
                            100
                          }
                          y2="10"
                          stroke="#1b48da"
                          strokeWidth="15"
                        />
                      </svg>
                      {device.count}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
