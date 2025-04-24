import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { log } from "../utils/utils.js";
const cookieHelpers = (arrayCookie) => {
  let newCookie = "";
  for (let index = 0; index < arrayCookie.length; index++) {
    const element = arrayCookie[index];
    if (index < arrayCookie.length - 1) {
      newCookie += element.split(";")[0] + "; ";
    } else {
      newCookie += element.split(";")[0];
    }
  }
  return newCookie;
};

export async function Curl(
  url,
  body = null,
  headers = {},
  maxRetries = 100,
  retryDelay = 2000
) {
  let attempt = 0;

  const httpsAgent = new HttpsProxyAgent(
    "http://85c44fd62977884ef255:80c25c131ce15195@gw.dataimpulse.com:823"
  );

  while (attempt < maxRetries) {
    try {
      attempt++;

      const options = {
        method: body ? "POST" : "GET",
        headers: {
          Host: "linkumkm.id",
          "Cache-Control": "max-age=0",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Sec-Gpc": "1",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-User": "?1",
          "Sec-Fetch-Dest": "document",
          "Sec-Ch-Ua":
            '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"macOS"',
          "Accept-Language": "id-ID,id;q=0.6",
          "Accept-Encoding": "gzip, deflate, br",
          ...headers,
        },
        redirect: "manual", // penting untuk tidak mengikuti redirect
        body: body ? body : null,
        agent: httpsAgent,
      };

      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");
      const cookies = response.headers.raw()["set-cookie"];
      const cookie = cookies ? cookieHelpers(cookies) : null;
      const redirect = response.headers.get("location") || null;
      const status = response.status;

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      log(
        `🔄 Attempt ${attempt}/${maxRetries} - Fetched ${url} successfully.`,
        "warning"
      );
      return { data, cookie, redirect, status };
    } catch (error) {
      log(`⚠️ Fetch failed (Attempt ${attempt}): ${error.message}`, "warning");
      if (attempt >= maxRetries) {
        throw new Error("Request failed after maximum retries");
      }
      log(`⏳ Retrying in ${retryDelay / 1000} seconds...`, "warning");
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}
