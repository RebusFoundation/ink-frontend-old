import { fetchWrap } from "../api/fetch-wrap.js";

export async function uploadMedia(doc) {
  const { book, media } = await doc;
  const uploader = uploadData(doc);
  const response = await window.fetch("/api/whoami", {
    credentials: "include"
  });
  const { user } = await response.json();
  for (const item of media) {
    await uploader(item, user);
  }
  const mediaPaths = media.map(item => item.documentPath);
  for (const item of book.resources) {
    if (!mediaPaths.includes(item.url)) {
      await uploader(
        {
          documentPath: item.url,
          mediaType: item.encodingFormat,
          json: {}
        },
        user
      );
    }
  }
  return book;
}

function uploadData(doc) {
  const { zip, book } = doc;
  return async function uploader(item, user) {
    if (
      item.mediaType.includes("javascript") ||
      item.mediaType.includes("jscript") ||
      item.mediaType.includes("ecmascript")
    ) {
      return;
    }
    try {
      const data = new window.FormData();
      const filename = decodeURI(item.url)
        .split("/")
        .pop();
      let file;
      if (item.file) {
        file = item.file;
      } else {
        const blob = await zip.file(decodeURI(item.documentPath)).async("blob");
        file = new window.File([blob], filename, { type: item.mediaType });
      }
      data.append("file", file);
      data.append("documentPath", item.documentPath);
      data.append("mediaType", item.mediaType);
      data.append("json", JSON.stringify(item.json));
      return upload(data, `${book.id}/file-upload`, user);
    } catch (err) {
      console.error(err);
      err.httpMethod = "Parser";
      throw err;
    }
  };
}

async function upload(payload, endpoint, user) {
  try {
    const response = await fetchWrap(endpoint, {
      credentials: "include",
      method: "POST",
      body: payload,
      headers: new window.Headers({
        Authorization: `Bearer ${user.token}`
      })
    });
    return response.json();
  } catch (err) {
    console.error("upload error: ", err, err.status, err.response);
    err.httpMethod = "POST/Upload Media";
    throw err;
  }
}
