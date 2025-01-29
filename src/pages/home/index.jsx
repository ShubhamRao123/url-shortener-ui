import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <p>Create New</p>
      </div>
      <div>
        <p>Dashboard</p>
        <p onClick={() => navigate("/link")}>Links </p>
        <p onClick={() => navigate("/analytics")}>Analytics</p>
        <p onClick={() => navigate("/settings")}> Settings</p>
      </div>
    </div>
  );
}

export default Home;
