import { BaseConfig } from "@config";
import { store } from "@store"
import * as actionTypes from "./actionTypes";

export const _TOKEN = () => {
  try {
    return store.getState().auth.login.data.token;
  } catch (error) {
    return null
  };
}
const _REQUEST2SERVER = (url, params = null) => {
  const isGet = (params == null);
  return new Promise(function (resolve, reject) {
    fetch(`${BaseConfig.SERVER_HOST}/api/${url}`, {
      method: isGet ? 'get' : 'post',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${_TOKEN()}`
      },
      ...(!isGet && { body: JSON.stringify(params) })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) resolve(res);
        else reject(res);
      })
      .catch(err => reject(err));
  });
}

export const getTypeAndStyles = (params) => {
  return _REQUEST2SERVER(`get_tyles_styles`, params);
}
export const registration = (params) => {
  return _REQUEST2SERVER(`register`, params);
}

export const login = (params) => {
  return _REQUEST2SERVER(`login`, params);
}

export const uploadPost = (params) => {
  return _REQUEST2SERVER(`upload_post`, params);
}

export const getPosts = (params) => {
  return _REQUEST2SERVER(`get_posts`, params);
}

export const getPros = (params) => {
  return _REQUEST2SERVER(`get_pros`, params);
}

export const sendConnect = (params) => {
  return _REQUEST2SERVER(`send_connect`, params);
}
export const getPendings = (params) => {
  return _REQUEST2SERVER(`get_pendings`, params);
}
export const uploadRecipe = (params) => {
  return _REQUEST2SERVER(`upload_recipe`, params);
}
export const getRecipes = (params) => {
  return _REQUEST2SERVER(`get_recipes`, params);
}
export const getUserInfo = (params) => {
  return _REQUEST2SERVER(`get_user_info`, params);
}
export const removePending = (params) => {
  return _REQUEST2SERVER(`remove_pending`, params);
}
export const updateToken = (params) => {
  return _REQUEST2SERVER(`update_token`, params);
}
export const getBadge = (params) => {
  return _REQUEST2SERVER(`get_badge`, params);
}
export const getConnections = (params) => {
  return _REQUEST2SERVER(`get_connections`, params);
}
export const applyPending = (params) => {
  return _REQUEST2SERVER(`apply_pending`, params);
}
export const viewRecipe = (params) => {
  return _REQUEST2SERVER(`view_recipe`, params);
}
export const getUserProfile = (params) => {
  return _REQUEST2SERVER(`get_profile`, params);
}
export const updateProfile = (params) => {
  return _REQUEST2SERVER(`update_profile`, params);
}
export const sendReport = (params) => {
  return _REQUEST2SERVER(`send_report`, params);
}
export const getContacts = (params) => {
  return _REQUEST2SERVER(`get_contacts`, params);
}
export const makeChatRoom = (params) => {
  return _REQUEST2SERVER(`make_chatroom`, params);
}
export const setBlock = (params) => {
  return _REQUEST2SERVER(`set_block`, params);
}
export const getBlocks = (params) => {
  return _REQUEST2SERVER(`get_blocks`, params);
}
export const removeBlock = (params) => {
  return _REQUEST2SERVER(`remove_block`, params);
}
export const sendMessage = (params) => {
  return _REQUEST2SERVER(`send_message`, params);
}
export const signOut = (params) => {
  return _REQUEST2SERVER(`sign_out`, params);
}
