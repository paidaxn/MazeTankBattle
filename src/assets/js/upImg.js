/* eslint-disable import/prefer-default-export */
import { Loading, Message } from "element-ui";
import api from "@/api/index";

export function uploadImgByBase64(proj, imageData, successFn) {
  let loadingInstance = Loading.service({
    text: "上传中",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  let uptoken = "";
  let src = "";
  api
    .uptoken()
    .then(res => {
      uptoken = res.uptoken;
      let random = Math.random()
        .toString()
        .slice(-6);
      let key = "base64upload/" + proj + "/" + new Date().getTime() + random + ".png";
      var url = "https://upload.qiniup.com/putb64/-1/key/" + base64encode(key);
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          loadingInstance.close();

          if (xhr.status === 200) {
            Message.success("上传成功");
            let rt = xhr.responseText;
            if (!rt.code || !rt.hash || !rt.key || !rt.error) {
              rt = JSON.parse(rt);
            }
            if (rt.error) {
              console.log(rt.error);
            } else if (rt.key) {
              src = process.env.VUE_APP_QINIU_PREFIX + rt.key;
              successFn(src);
            }
          }
        }
      };
      if (imageData.indexOf("base64") > 0) {
        imageData = imageData.substring(imageData.indexOf("base64") + 7);
      }
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.setRequestHeader("Authorization", "UpToken " + uptoken);
      xhr.send(imageData);
    })
    .catch(err => {
      console.log(err);
    });
}

function base64encode(str) {
  let base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let out, i, len;
  let c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "===";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xf) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return out;
}

export function uploadVideoByBase64(proj, videoData, successFn) {
  let loadingInstance = Loading.service({
    text: "上传中",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  let uptoken = "";
  let src = "";
  api
    .uptoken()
    .then(res => {
      uptoken = res.uptoken;
      let random = Math.random()
        .toString()
        .slice(-6);
      let key = "base64upload/" + proj + "/" + new Date().getTime() + random + ".mp4";
      var url = "https://upload.qiniup.com/putb64/-1/key/" + base64encode(key);
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          loadingInstance.close();

          if (xhr.status === 200) {
            Message.success("上传成功");
            let rt = xhr.responseText;
            if (!rt.code || !rt.hash || !rt.key || !rt.error) {
              rt = JSON.parse(rt);
            }
            if (rt.error) {
              console.log(rt.error);
            } else if (rt.key) {
              src = process.env.VUE_APP_QINIU_PREFIX + key;
              successFn(src);
            }
          }
        }
      };
      if (videoData.indexOf("base64") > 0) {
        videoData = videoData.substring(videoData.indexOf("base64") + 7);
      }
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.setRequestHeader("Authorization", "UpToken " + uptoken);
      xhr.send(videoData);
    })
    .catch(err => {
      console.log(err);
    });
}
