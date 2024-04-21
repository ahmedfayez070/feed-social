import Posts from "../../components/posts/Posts";
import "./profile.scss";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";

import {
  FacebookTwoTone,
  LinkedIn,
  Instagram,
  Pinterest,
  Twitter,
  Place,
  Language,
  EmailOutlined,
  MoreVert,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const [openUpdate, setOpenUpdate] = useState(false);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get(`/user/find/${userId}`).then((res) => {
        return res.data;
      }),
  });

  const { isLoading: loading, data: relationData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get(`/relationship?followedUserId=${userId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (followed) => {
      if (!followed) return makeRequest.post("/relationship", { userId });
      return makeRequest.delete("/relationship?userId=" + userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationData.includes(currentUser.id));
  };

  if (isLoading || loading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={"/upload/" + data?.coverPic}
          alt={data.name}
          className="cover"
        />
        <img
          src={"/upload/" + data?.profilePic}
          alt={data.name}
          className="profile-img"
        />
      </div>
      <div className="profile-container">
        <div className="u-info">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoTone fontSize="large" className="icon" />
            </a>
            <a href="http://facebook.com">
              <Instagram fontSize="large" className="icon" />
            </a>
            <a href="http://facebook.com">
              <Twitter fontSize="large" className="icon" />
            </a>
            <a href="http://facebook.com">
              <LinkedIn fontSize="large" className="icon" />
            </a>
            <a href="http://facebook.com">
              <Pinterest fontSize="large" className="icon" />
            </a>
          </div>
          <div className="center">
            <span className="name">{data.name}</span>
            <div className="info">
              <div className="item">
                <Place />
                <span>{data?.city || "---"}</span>
              </div>
              <div className="item">
                <Language />
                <span>{data?.website}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationData?.includes(currentUser.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlined />
            <MoreVert />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
