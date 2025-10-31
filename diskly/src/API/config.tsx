export const API_URL = "http://localhost:8080";
export const WS_URL = "ws://localhost:8080";

export async function checkBackendStatus() {
  try {
    const res = await fetch(`${API_URL}`);
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function logout_session() {
  await fetch(`${API_URL}/accounts/logout`, {
    method: "GET",
    credentials: "include",
  }).then((res) => {
    if (res.ok) {
      window.location.href = "/";
    }
  });
}
