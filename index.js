import { Curl } from "./src/services/services.js";
import fetch from "node-fetch";
import fs from "fs";
import { Solver } from "2captcha";
import { Faker } from "@faker-js/faker";
import { log, NikDate, RandomText } from "./src/utils/utils.js";
(async () => {
  const Account = fs.readFileSync("data.txt", "utf8").split("\n");
  for (let index = 0; index < Account.length; index++) {
    const DataAccount = Account[index].split("|");
    const FullName = DataAccount[0];
    const Number = DataAccount[1];
    const Nik = DataAccount[2];
    const Password = DataAccount[3];

    const FetchCookie = await Curl("https://linkumkm.id/", null);
    const cookie = FetchCookie.cookie.replaceAll("Path=/", "");
    var csrf = cookie.match("csrf_cookie_linkumkm=(.*?);")[1];
    var session = cookie.match("linkumkm_session=(.*?);")[1];
    const response = await fetch("https://linkumkm.id/capctha/capctha_mantri", {
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
        Cookie: cookie,
      },
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simpan CAPTCHA ke file
    fs.writeFileSync("captcha.jpg", buffer);
    const solver = new Solver("6f70f17dd5ad83a01fbfa805b032a774");
    const { data } = await solver.imageCaptcha(
      fs.readFileSync("captcha.jpg", "base64")
    );
    log(`Capctha Fix ${data.toLocaleUpperCase()}`, "success");
    const FetchRegist = await Curl(
      "https://linkumkm.id/umkmscore/register",
      new URLSearchParams({
        csrf_linkumkm: csrf,
        fullname: FullName,
        kode_unik: "354770",
        nama_mantri: "Muhammad Dimas Fadli Djamhuri",
        link_referral: "muhammad....dimas....fadli....djamhuri.354770",
        phone_number: Number,
        id_number: Nik,
        password: Password,
        password_retype: Password,
        kode_captcha: data.toLocaleUpperCase(),
        honeypot: "",
      }),
      {
        cookie: cookie,
      }
    );
    if (FetchRegist.redirect.includes("umkmscore/profile")) {
      log(`register success direct ${FetchRegist.redirect}`, "success");
      const BirthDay = await NikDate(Nik);
      const words = ["padi", "jagung", "kapulaga", "kentang", "kol", "bawang"];

      // Jumlah kata dalam teks acak
      const numberOfWords = 2;
      const randomText = await RandomText(words, numberOfWords);
      console.log(`     Jenis Produk : ${randomText}`);
      console.log(`     Alamat Usaha : Adisana`);
      console.log(`     Provinsi     : Jawa Tengah`);
      console.log(`     Kabupaten    : Brebes`);
      console.log(`     Kecamatan    : Bumiayu`);
      console.log(`     Desa         : Adisana`);
      const FetchProfile = await Curl(
        "https://linkumkm.id/umkmscore/submit_profile",
        new URLSearchParams({
          csrf_linkumkm: csrf,
          born_date: BirthDay,
          id_number: Nik,
          phone_number: Number,
          business_sector: "1",
          produced: randomText,
          business_address: "adisana",
          province: "33",
          regency: "3329",
          subdistrict: "3329030",
          village: "3329030007",
          postal_code: "34411",
          url: "",
          honeypot: "",
        }),
        { cookie: cookie }
      );
      if (FetchProfile.redirect.includes("scoring_revamp")) {
        log(`Submit Data Success`, "success");
      } else {
        log(`Submit Data Failed....`, "error");
      }
    } else {
      const FetchData = await Curl(
        "https://linkumkm.id/umkmscore/mantri/muhammad....dimas....fadli....djamhuri.354770",
        null,
        { cookie: cookie }
      );
      var status = await FetchData.data.match(
        '<p class="padding-right margin-no">(.*?)</p>'
      )[1];
      log(status, "error");
    }
  }
})();
