import { fetchWrap } from "./fetch-wrap.js";

export async function create(session) {
  const newReader = {
    type: "Person",
    summary: `Reader profile`
  };
  try {
    await fetchWrap(session.profile.create, {
      method: "POST",
      body: JSON.stringify(newReader),
      headers: new window.Headers({
        Authorization: `Bearer ${session.user.token}`,
        "content-type": "application/ld+json"
      })
    });
    const reader = await window.fetch("/api/whoami", {
      credentials: "include"
    });
    return reader.json();
  } catch (err) {
    err.httpMethod = "POST/Create Profile";
    throw err;
  }
}
