import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { actionCreators as postActions } from "../app/services/postReducer";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function Delete(props) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  // console.log(props.id);
  React.useEffect(() => {
    dispatch(postActions.getPostFB());
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    dispatch(postActions.deletePostFB(props.id));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        <DeleteIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"정말로 삭제하시겠습니까?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            삭제시 데이터 복구 불가
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            (삭제하려면 삭제버튼)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <CancelIcon /> 취소
          </Button>
          <Button onClick={handleDelete} autoFocus color="error">
            <DeleteIcon /> 삭제
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
