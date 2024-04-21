import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {
  const username = req.query.username;

  const q = "SELECT * FROM users WHERE `username` like ?";

  if (!username) {
    return res.status(200).json([]);
  }

  db.query(q, ["%" + username + "%"], (err, data) => {
    if (err) return res.status(500).json(err);
    let users = [];
    for (const user of data) {
      users.push({
        username: user.username,
        id: user.id,
        img: user.profilePic,
      });
    }
    return res.status(200).json(users);
  });
};

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const q = "SELECT * FROM users WHERE `id` = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...others } = data[0];
    return res.status(200).json(others);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("You must be logged in");

  jwt.verify(token, "ksKNFJKETHJsagdsfasadfsDGSBRsfgdsh", (err, userInfo) => {
    if (err) return res.status(403).json("You must log in again");

    const q =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `coverPic`=?, `profilePic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.status(200).json("Updated");
        return res.status(403).json("You can update only your profile");
      }
    );
  });
};
