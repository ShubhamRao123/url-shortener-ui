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
        console.log(response.id);
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
        <div className={styles.imageContainer}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738170883/download_2_xxx8cd.png"
            alt="login"
          />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <p onClick={() => navigate("/")}>SignUp</p>
            <p className={styles.headerLogin}>Login</p>
          </div>
          <div className={styles.innerContainer}>
            <h2>Join us Today!</h2>
            <form onSubmit={handleRegister}>
              <div className={styles.form}>
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
                <p
                  disabled={loading}
                  className={styles.loginButton}
                  onClick={handleRegister}
                >
                  {loading ? "Signing..." : "Register"}
                </p>

                <p className={styles.signupLink}>
                  Don't you have an account?{" "}
                  <span onClick={() => navigate("/")}>SignUp</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
