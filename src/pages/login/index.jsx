import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css"; // Importing CSS module
import { login } from "../../services/user";

function Login() {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: null,
    password: null,
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError({ email: null, password: null });

    if (!formdata.email || !formdata.email.includes("@")) {
      setFormError((prev) => ({ ...prev, email: "Invalid email address" }));
      errors = true;
    }

    if (!formdata.password) {
      setFormError((prev) => ({ ...prev, password: "Password is required" }));
      errors = true;
    }

    if (errors) return;

    try {
      setLoading(true);
      const response = await login(formdata);
      toast.success(response.message);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("username", response.name);
        localStorage.setItem("userEmail", response.email);
        localStorage.setItem("userPhone", response.phone || "");
        // console.log(response.email);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        {" "}
        {/* Using CSS module */}
        <div className={styles.formContainer}>
          {" "}
          {/* Using CSS module */}
          <div className={styles.innerContainer}>
            {" "}
            {/* Using CSS module */}
            <header>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738170883/download_2_xxx8cd.png"
                alt=""
              />
            </header>
            <form onSubmit={handleRegister}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={formdata.email}
                  placeholder="Example@email.com"
                  onChange={(e) =>
                    setFormdata({ ...formdata, email: e.target.value })
                  }
                />
                {formError.email && (
                  <p className={styles.error}>{formError.email}</p>
                )}{" "}
                {/* Using CSS module */}
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={formdata.password}
                  placeholder="At least 8 characters"
                  onChange={(e) =>
                    setFormdata({ ...formdata, password: e.target.value })
                  }
                />
                {formError.password && (
                  <p className={styles.error}>{formError.password}</p>
                )}
              </div>
              <button disabled={loading}>
                {loading ? "Creating Account..." : "Sign in"}
              </button>
              <p>
                Don't you have an account?{" "}
                <span
                  className={styles.signupLink}
                  onClick={() => navigate("/")}
                >
                  {" "}
                  {/* Using CSS module */}
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
        <div className={styles.imageContainer}>
          {" "}
          {/* Using CSS module */}
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738170799/m_image_h22sne.png"
            alt="Delicious Food"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
