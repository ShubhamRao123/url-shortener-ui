import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "./register.module.css"; // Import the CSS module
import { register } from "../../services/user";

function Register() {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    email: null,
    name: null,
    phone: null,
    password: null,
    confirmPassword: null,
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError({
      email: null,
      name: null,
      phone: null,
      password: null,
      confirmPassword: null,
    });

    if (!formdata.email || !formdata.email.includes("@")) {
      setFormError((prev) => ({ ...prev, email: "Invalid email address" }));
      errors = true;
    }
    if (!formdata.name) {
      setFormError((prev) => ({ ...prev, name: "Name is required" }));
      errors = true;
    }
    if (!formdata.phone || formdata.phone.length < 10) {
      setFormError((prev) => ({ ...prev, phone: "Invalid phone number" }));
      errors = true;
    }
    if (!formdata.password) {
      setFormError((prev) => ({ ...prev, password: "Password is required" }));
      errors = true;
    }
    if (!formdata.confirmPassword) {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      errors = true;
    } else if (formdata.password !== formdata.confirmPassword) {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      errors = true;
    }
    if (errors) return;

    try {
      setLoading(true);
      const response = await register(formdata);
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738170883/download_2_xxx8cd.png"
            alt="Register"
          />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <p>SignUp</p>
            <p
              onClick={() => navigate("/login")}
              className={styles.headerLogin}
            >
              Login
            </p>
          </div>
          <div className={styles.innerContainer}>
            <h2>Join us Today!</h2>
            <form onSubmit={handleRegister}>
              <div className={styles.form}>
                <div className={styles.nameInput}>
                  <input
                    type="text"
                    value={formdata.name}
                    placeholder="Name"
                    onChange={(e) =>
                      setFormdata({ ...formdata, name: e.target.value })
                    }
                  />
                  {formError.name && (
                    <p className={styles.error}>{formError.name}</p>
                  )}
                </div>
                <div className={styles.nameInput}>
                  <input
                    type="email"
                    value={formdata.email}
                    placeholder="Email id"
                    onChange={(e) =>
                      setFormdata({ ...formdata, email: e.target.value })
                    }
                  />
                  {formError.email && (
                    <p className={styles.error}>{formError.email}</p>
                  )}
                </div>
                <div className={styles.nameInput}>
                  <input
                    type="text"
                    value={formdata.phone}
                    placeholder="Mobile no."
                    onChange={(e) =>
                      setFormdata({ ...formdata, phone: e.target.value })
                    }
                  />
                  {formError.phone && (
                    <p className={styles.error}>{formError.phone}</p>
                  )}
                </div>
                <div className={styles.nameInput}>
                  <input
                    type="password"
                    value={formdata.password}
                    placeholder="Password"
                    onChange={(e) =>
                      setFormdata({ ...formdata, password: e.target.value })
                    }
                  />
                  {formError.password && (
                    <p className={styles.error}>{formError.password}</p>
                  )}
                </div>
                <div className={styles.nameInput}>
                  <input
                    type="password"
                    value={formdata.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) =>
                      setFormdata({
                        ...formdata,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  {formError.confirmPassword && (
                    <p className={styles.error}>{formError.confirmPassword}</p>
                  )}
                </div>
                <p
                  disabled={loading}
                  className={styles.loginButton}
                  onClick={handleRegister}
                >
                  {loading ? "Creating Account..." : "Register"}
                </p>
                <p className={styles.signupLink}>
                  Already have an account?{" "}
                  <span onClick={() => navigate("/login")}>Login</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
