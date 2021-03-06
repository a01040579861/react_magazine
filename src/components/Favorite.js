import * as React from "react";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { actionCreators as postActions } from "../app/services/postReducer";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";

const StyledCheck = styled(Checkbox)({
  color: "#ff6d75",
  "&.Mui-checked": {
    color: "#ff3d47",
  },
});

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

export default function Favorite(props) {
  const [check, setCheck] = React.useState(false);
  const dispatch = useDispatch();
  const user_info = useSelector((state) => state.user.user);
  const favorite_list = props.props.favorite_list;
  console.log(favorite_list);

  // console.log(user_info.uid);
  console.log(props.id);
  const onClick = () => {
    dispatch(postActions.favoriteFB(props.props.id, user_info.uid));
    if (favorite_list.includes(user_info.uid.toString())) {
      setCheck(false);
      // console.log(check);
    } else {
      setCheck(true);
      // console.log(check);
    }
  };
  console.log(user_info);
  const onNonClick = () => {
    alert("로그인 후 이용해주세요");
  };
  React.useEffect(() => {
    dispatch(postActions.getPostFB());
    if (user_info === null) {
      if (favorite_list === null) {
        if (favorite_list.includes(user_info.uid.toString())) {
          setCheck(true);
          console.log(check);
        } else {
          setCheck(false);
          console.log(check);
        }
      }
    }
  }, []);

  return (
    <>
      {user_info ? (
        <StyledCheck
          checked={check}
          icon={<FavoriteBorderIcon />}
          checkedIcon={<FavoriteIcon />}
          onChange={onClick}
          value={1}
        />
      ) : (
        <StyledRating
          disabled
          onClick={onNonClick}
          name="customized-10"
          defaultValue={0}
          precision={1}
          max={1}
          getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        />
      )}
    </>
  );
}
