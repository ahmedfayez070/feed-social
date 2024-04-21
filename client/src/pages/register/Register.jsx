import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.scss";
import { useState } from "react";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      navigate("/login");
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Feed Social</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
            voluptatibus quis eius autem quod doloremque est veniam reiciendis
            facere aliquid. Omnis, magnam ipsam? Neque quo autem aliquid
            voluptas nemo laborum?
          </p>
          <span>Have An Account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
            <button onClick={handleSubmit}>Register</button>
          </form>
          <div className="mobile">
            <span>Have An Account?</span>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
