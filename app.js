import readlineSync from "readline-sync";
import fs from "fs";
import fetch from "node-fetch";
import chalk from "chalk";
import { Solver } from "2captcha";
function getCookie() {
  const index = fetch("https://linkumkm.id/", {
    headers: {
      Host: "linkumkm.id",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
      "Accept-Language": "id,en-US;q=0.7,en;q=0.3",
      "Accept-Encoding": "gzip, deflate, br",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      Te: "trailers",
    },
  }).then(async (res) => {
    const headers = res.headers.raw()["set-cookie"];

    return headers;
  });

  return index;
}

function regisForm(
  cookie,
  csrf_linkumkm,
  fullname,
  phone_number,
  id_number,
  password,
  data
) {
  const index = fetch("https://linkumkm.id/umkmscore/register", {
    redirect: "manual",
    method: "POST",
    headers: {
      Host: "linkumkm.id",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
      "Accept-Language": "id,en-US;q=0.7,en;q=0.3",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Length": "312",
      Origin: "null",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      Te: "trailers",
      Cookie: cookie,
    },
    body: new URLSearchParams({
      csrf_linkumkm: csrf_linkumkm,
      fullname: fullname,
      kode_unik: "354770",
      nama_mantri: "Muhammad Dimas Fadli Djamhuri",
      link_referral: "muhammad....dimas....fadli....djamhuri.354770",
      phone_number: phone_number,
      id_number: id_number,
      password: password,
      password_retype: password,
      kode_captcha: data.toLocaleUpperCase(),
      honeypot: "",
    }),
  }).then(async (res) => {
    const headers = res.headers.raw()["location"][0];
    const csrf = res.headers.raw()["set-cookie"][0];

    return {
      headers,
      csrf,
    };
  });

  return index;
}

function regisForm2(
  cookie,
  csrf_linkumkm,
  dob,
  id_number,
  phone_number,
  randomText
) {
  const index = fetch("https://linkumkm.id/umkmscore/submit_profile", {
    redirect: "manual",
    method: "POST",
    headers: {
      Host: "linkumkm.id",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
      "Accept-Language": "id,en-US;q=0.7,en;q=0.3",
      "Accept-Encoding": "gzip, deflate, br",
      Origin: "null",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      Te: "trailers",
      Cookie: cookie,
    },
    body: new URLSearchParams({
      csrf_linkumkm: csrf_linkumkm,
      born_date: dob,
      id_number: id_number,
      phone_number: phone_number,
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
  }).then(async (res) => {
    const headers = res.headers.raw()["location"][0];
    const csrf = res.headers.raw()["set-cookie"][0];

    return {
      headers,
      csrf,
    };
  });

  return index;
}

function information(csrf_linkumkm, session) {
  const index = fetch(
    "https://linkumkm.id/umkmscore/mantri/muhammad....dimas....fadli....djamhuri.354770",
    {
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
        Priority: "u=0, i",
        Cookie: `${session} ${csrf_linkumkm}`,
      },
    }
  ).then(async (res) => {
    const headers = await res.text();

    return headers;
  });

  return index;
}

(async () => {
  var dataField = readlineSync.question("Data File : ");
  console.log();
  const data = fs.readFileSync(dataField, "utf8");
  const array = data.split("\n");
  for (let index = 0; index < array.length; index++) {
    var fullname = array[index].split("|")[0];
    var phone_number = array[index].split("|")[1];
    var id_number = array[index].split("|")[2];
    var password = array[index].split("|")[3];

    const cookies = await getCookie();
    var filteredCookies = cookies
      .map((cookie) => {
        const parts = cookie.split(";")[0]; // Ambil hanya bagian pertama sebelum ";"
        return parts;
      })
      .filter(Boolean);

    var cookie = filteredCookies.join("; ").replace("Path=/", "");
    console.log(cookie);
    var csrf = cookie.match("csrf_cookie_linkumkm=(.*?);")[1];
    var session = cookie.match("linkumkm_session=(.*?);")[1];
    const response = await fetch("https://linkumkm.id/capctha/capctha_mantri", {
      headers: {
        Host: "linkumkm.id",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
        "Accept-Language": "id,en-US;q=0.7,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        Priority: "u=0, i",
        Te: "trailers",
        Cookie: cookie,
      },
    });

    const buffer = await response.buffer();

    // Simpan CAPTCHA ke file
    fs.writeFileSync("captcha.jpg", buffer);
    const solver = new Solver("");
    const { data } = await solver.imageCaptcha(
      fs.readFileSync("captcha.jpg", "base64")
    );
    const registerForm = await regisForm(
      cookie,
      csrf,
      fullname,
      phone_number,
      id_number,
      password,
      data
    );
    var csrfdata = registerForm.csrf.match("csrf_cookie_linkumkm=(.*?);")[1];
    var csrf = `csrf_cookie_linkumkm=${csrfdata};`;
    var session = `linkumkm_session=${session};`;

    if (registerForm.headers.match("umkmscore/profile")) {
      console.log(
        chalk.white("[") +
          chalk.green(`${index + 1}/${array.length}`) +
          chalk.white("] ") +
          chalk.white(` ${fullname} | ${phone_number} `) +
          chalk.green("Success Register Form UMKM")
      );

      var gabungancookie = `${csrf} ${session}`;
      var dob = getBirthDateFromNIK(id_number);
      console.log(`     DOB : ${dob}`);

      // Daftar kata
      const words = ["padi", "jagung", "kapulaga", "kentang", "kol", "bawang"];

      // Jumlah kata dalam teks acak
      const numberOfWords = 2;

      const randomText = generateRandomText(words, numberOfWords);
      console.log(`     Jenis Produk : ${randomText}`);
      console.log(`     Alamat Usaha : Adisana`);
      console.log(`     Provinsi     : Jawa Tengah`);
      console.log(`     Kabupaten    : Brebes`);
      console.log(`     Kecamatan    : Bumiayu`);
      console.log(`     Desa         : Adisana`);

      const submitFormData = await regisForm2(
        gabungancookie,
        csrfdata,
        dob,
        id_number,
        phone_number,
        randomText
      );
      if (submitFormData.headers.match("scoring_revamp")) {
        console.log(chalk.green(`     Successfully Input Data`));
      } else {
        console.log(chalk.red(`     Failure Input Data`));
      }
    } else {
      const gettingData = await information(csrf, session);
      var status = await gettingData.match(
        '<p class="padding-right margin-no">(.*?)</p>'
      )[1];
      console.log(
        chalk.white("[") +
          chalk.green(`${index + 1}/${array.length}`) +
          chalk.white("] ") +
          chalk.white(` ${fullname} | ${phone_number} `) +
          chalk.red(`Failure Register ${status}`)
      );
    }
  }
})();

function getBirthDateFromNIK(nik) {
  // Pastikan NIK adalah string
  if (typeof nik !== "string" || nik.length !== 16) {
    throw new Error("NIK harus berupa string dengan panjang 16 karakter.");
  }

  // Ekstrak bagian dari NIK
  const tanggalLahir = parseInt(nik.slice(6, 8), 10); // 2 digit untuk tanggal
  const bulanLahir = parseInt(nik.slice(8, 10), 10); // 2 digit untuk bulan
  const tahunLahir = parseInt(nik.slice(10, 12), 10); // 2 digit untuk tahun

  // Tentukan tahun lengkap (misalnya, jika tahun < 22, asumsikan 2000-an, jika >= 22, asumsikan 1900-an)
  const tahunSekarang = new Date().getFullYear();
  const tahunSekarangAkhirDuaDigit = tahunSekarang % 100;

  let tahunLengkap;
  if (tahunLahir <= tahunSekarangAkhirDuaDigit) {
    tahunLengkap = 2000 + tahunLahir;
  } else {
    tahunLengkap = 1900 + tahunLahir;
  }

  // Format tanggal lahir menjadi 'YYYY-MM-DD'
  const tanggalLahirFormatted = `${tahunLengkap}-${bulanLahir
    .toString()
    .padStart(2, "0")}-${tanggalLahir.toString().padStart(2, "0")}`;

  return tanggalLahirFormatted;
}

function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function generateRandomText(wordList, numWords) {
  let randomText = "";
  for (let i = 0; i < numWords; i++) {
    randomText += getRandomItem(wordList);
    if (i < numWords - 1) {
      randomText += ","; // Tambahkan spasi antara kata
    }
  }
  return randomText;
}
