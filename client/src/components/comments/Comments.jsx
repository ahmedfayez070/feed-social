import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import moment from "moment";
import "./comments.scss";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [desc, setDesc] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      makeRequest.get(`/comment?postId=${postId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comment", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt={currentUser.name} />
        <input
          type="text"
          placeholder="Write a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
      {data?.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/upload/" + comment.profilePic} alt={comment.name} />
          <div className="info">
            <span className="name">{comment.name}</span>
            <p className="desc">{comment.desc}</p>
          </div>
          <div className="time">{moment(comment.createdAt).fromNow()}</div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
