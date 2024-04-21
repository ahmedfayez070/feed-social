import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/post?userId=" + userId).then((res) => {
        return res.data;
      }),
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="posts">
      {data?.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

export default Posts;
