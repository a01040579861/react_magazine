import React from "react";
import { Grid } from "../elements";
import Center from "./postLayout/Center";
import Left from "./postLayout/Left";
import Right from "./postLayout/Right";

const Post = (props) => {
  return (
    <>
      {props.layout === "center" ? (
        <Grid padding="20px 0px">
          <Center {...props} />
        </Grid>
      ) : props.layout === "right" ? (
        <Grid padding="20px 0px">
          <Right {...props} />
        </Grid>
      ) : (
        <Grid padding="20px 0px">
          <Left {...props} />
        </Grid>
      )}
    </>
  );
};

Post.defaultProps = {
  // user_info: {
  //   user_name: "test",
  //   user_profile:
  //     "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  // },
  image_url:
    "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  contents: "test",
  comment_cnt: 10,
  insert_dt: "2022-06-08 23:00:00",
};

export default Post;
