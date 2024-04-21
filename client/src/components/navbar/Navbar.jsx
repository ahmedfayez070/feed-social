import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import "./navbar.scss";
import {
  HomeOutlined,
  DarkModeOutlined,
  WbSunnyOutlined,
  GridViewOutlined,
  NotificationsOutlined,
  EmailOutlined,
  PersonOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [openUsernames, setOpenUsernames] = useState(false);
  const [username, setUsername] = useState("");

  const handleSearch = async () => {
    const res = await makeRequest.get("/user?username=" + username);

    setUsers(res.data);
    setUsername("");
    setOpenUsernames(true);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/">
          <span>FeedSocial</span>
        </Link>
        <HomeOutlined />
        {!darkMode ? (
          <DarkModeOutlined style={{ cursor: "pointer" }} onClick={toggle} />
        ) : (
          <WbSunnyOutlined style={{ cursor: "pointer" }} onClick={toggle} />
        )}
        <GridViewOutlined />
        <div className="search">
          <SearchOutlined
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          {openUsernames && users.length > 0 && (
            <div className="search-usernames">
              {users?.map((user) => (
                <Link
                  to={`/profile/${user.id}`}
                  className="username"
                  key={user.id}
                  onClick={() => setOpenUsernames(false)}
                >
                  {user?.img && (
                    <img src={"/upload/" + user.img} alt={user.username} />
                  )}
                  <span>{user.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <Link
          to={`/profile/${currentUser.id}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PersonOutlined />
        </Link>
        <EmailOutlined />
        <NotificationsOutlined />
        <div className="user">
          <img
            src={"/upload/" + currentUser?.profilePic}
            alt={currentUser.name}
          />
          <Link to={`/profile/${currentUser.id}`}>
            <span>{currentUser.name}</span>
          </Link>
          <button className="logout" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
