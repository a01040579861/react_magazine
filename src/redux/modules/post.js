// 리덕스
import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
// 이미지 저장
import { storage } from "../../shared/firebase";
import { actionCreators as imageActions } from "./image";
// API연결
import { instance, token } from "../../services/axios";

// 액션 정의
const GET_POST = "GET_POST";
const GET_ONE_POST = "GET_ONE_POST";
const ADD_POST = "ADD_POST";
const UPDATE_POST = "UPDATE_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";

// action creators
const getPost = createAction(GET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const getOnePost = createAction(GET_ONE_POST, (post) => ({ post }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const updatePost = createAction(UPDATE_POST, (postId, post) => ({
  postId,
  post,
}));
const deletePost = createAction(DELETE_POST, (postId) => ({ postId }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// 초기화 정보
const initialState = {
  list: [],
  paging: { next: true, page: 0, size: 3 },
  is_loading: false,
};

const initialPost = {
  contents: "testContents_admin",
  imageUrl: "testUrl_admin",
  layoutType: "RIGHT",
};

// 미들웨어
const getPostAxios = (page = 0, size = 3) => {
  return function (dispatch, getState, { history }) {
    let _paging = getState().post.paging;
    if (_paging.start && !_paging.next) {
      return;
    }
    dispatch(loading(true));
    instance
      .get(`api/post?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(getPost(res.data));
      })
      .catch((err) => console.log("getPostAxios: ", err.response));
  };
};

const getOnePostAxios = (postId) => {
  return function (dispatch, getState, { history }) {
    instance
      .get(`api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        history.push(`/post/${postId}`);
        dispatch(getOnePost(res.data));
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
};

const addPostAxios = (contents = "", layout = "") => {
  return function (dispatch, getState, { history }) {
    const _user = getState().user.user;
    const user_info = {
      nickname: _user.nickname,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      layoutType: layout,
    };

    const _image = getState().image.preview;

    const _upload = storage
      .ref(`images/${user_info.nickname}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          dispatch(imageActions.uploadImage(url));
          return url;
        })
        .then((url) => {
          const postData = { ..._post, imageUrl: url };
          instance
            .post("api/post", postData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            })
            .then((doc) => {
              history.push("/");
              dispatch(addPost(doc.data));
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("글쓰기에 문제 발생");
              console.log("글작성: ", err.response);
            });
        })
        .catch((err) => {
          window.alert("이미지 업로드에 문제 발생");
          console.log("글작성: ", err.response);
        });
    });
  };
};

const updatePostAxios = (postId = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!postId) {
      console.log("게시물 정보 없음");
      return;
    }

    const _image = getState().image.preview;
    // const _postIdx = getState().post.list.find((p) => p.postId === postId);
    const _post = getState().post.list[0];
    console.log(_post)
    const updatePostData = {
      ...post,
      imageUrl: _post.imageUrl,
    };

    if (_image === _post.imageUrl) {
      instance
        .put(`api/post/${postId}`, updatePostData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(updatePost(postId, updatePostData))
          history.replace("/");
          dispatch(updatePost(postId, updatePostData));
        })
        .catch((err) => console.log("업데이트 게시글: ", err.response));
      return;
    } else {
      const _upload = storage
        .ref(`images/${postId}_${new Date().getTime()}`)
        .putString(_image, "data_url");
      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            return url;
          })
          .then((url) => {
            instance
              .put(
                `api/post/${postId}`,
                { ...post, imageUrl: url },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
                }
              )
              .then((res) => {
                console.log(res)
                history.replace("/");
                dispatch(updatePost(postId, { ...post, imageUrl: url }));
              })
              .catch((err) => console.log(" ", err.response));
          })
          .catch((err) => {
            console.log("업데이트 게시글: ", err.response);
          });
      });
    }
  };
};

const deletePostAxios = (postId = null) => {
  return function (dispatch, getState, { history }) {
    if (!postId) {
      console.log("게시물 정보 없음");
      return;
    }

    instance
      .delete(`api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then(() => {
        history.replace("/");
        dispatch(deletePost(postId));
      })
      .catch((err) => console.log("게시글삭제: ", err.response));
  };
};

export default handleActions(
  {
    [GET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);
        draft.paging.page += 1;
        if (action.payload.post_list < 3) {
          draft.paging.next = false;
        }
        draft.is_loading = false;
      }),
    [GET_ONE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(action.payload.post);
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),

    [UPDATE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list[0] = { ...action.payload.post };
      }),

    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getPost,
  getOnePost,
  addPost,
  updatePost,
  deletePost,
  getPostAxios,
  getOnePostAxios,
  addPostAxios,
  updatePostAxios,
  deletePostAxios,
};

export { actionCreators };
