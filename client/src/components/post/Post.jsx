import "./post.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import {
  MoreHoriz,
  ShareOutlined,
  TextsmsOutlined,
  FavoriteOutlined,
  FavoriteBorderOutlined,
} from "@mui/icons-material";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: commentsLength } = useQuery({
    queryKey: [`commentsLength${post.id}`],
    queryFn: () =>
      makeRequest.get(`/comment?postId=${post.id}`).then((res) => {
        return res.data.length;
      }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/like?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/like?postId=" + post.id);
      return makeRequest.post("/like", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/post/" + postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLikes = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDeletePost = () => {
    deleteMutation.mutate(post.id);
  };

  if (isLoading) return "Loading...";

  return (
    <div>
      <div className="post">
        <div className="container">
          <div className="user">
            <div className="user-info">
              <img src={"/upload/" + post.profilePic} alt={post.name} />
              <div className="details">
                <Link to={`/profile/${post.userId}`}>
                  <span className="name">{post.name}</span>
                </Link>
                <span className="date">{moment(post.createdAt).fromNow()}</span>
              </div>
            </div>
            <div className="icon">
              <MoreHoriz onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && post.userId === currentUser.id && (
                <button className="delete" onClick={handleDeletePost}>
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="content">
            {post?.desc && <p>{post.desc}</p>}
            {post?.img && (
              <div className="img">
                <img src={`/upload/` + post.img} alt="" />
              </div>
            )}
          </div>
          <div className="buttons">
            <div className="button">
              {data.includes(currentUser.id) ? (
                <FavoriteOutlined
                  style={{ color: "red" }}
                  onClick={handleLikes}
                />
              ) : (
                <FavoriteBorderOutlined onClick={handleLikes} />
              )}
              <span>{data?.length} Likes</span>
            </div>
            <div className="button" onClick={() => setOpen(!open)}>
              <TextsmsOutlined />
              <span>{commentsLength} Comments</span>
            </div>
            <div className="button">
              <ShareOutlined />
              <span>Share</span>
            </div>
          </div>
        </div>
      </div>
      {open && <Comments postId={post.id} />}
    </div>
  );
};

export default Post;
