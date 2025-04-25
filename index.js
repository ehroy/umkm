import { Curl } from "./src/services/services.js";
import fetch from "node-fetch";
import fs from "fs";
import { Solver } from "2captcha";
import { Faker } from "@faker-js/faker";
import { log, NikDate, RandomText } from "./src/utils/utils.js";
import * as cheerio from "cheerio";
import inquirer from "inquirer";
import config from "./src/config/config.json" with { type: "json" };
const {address,apikey} = config
// misal ini isi HTML-nya
const html = fs.readFileSync("form.html", "utf8"); // atau langsung string

const $ = cheerio.load(html);
const options = [];

$('select[name="province"] option').each((i, el) => {
  const value = $(el).attr("value");
  const text = $(el).text().trim();

  // skip jika value kosong (seperti "Pilih")
  if (value) {
    options.push({ value, text });
  }
});
(async () => {
  let data_alamat = [];
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "province",
      message: "Pilih Provinsi:",
      choices: options.map((p) => ({ name: p.text, value: p.value })),
    },
  ]);
  data_alamat.push({ ...answer });
  const GetRegency = await Curl(
    `https://linkumkm.id/master/regency/${answer.province}`,
    null
  );
  const GetSubsctrict = JSON.parse(GetRegency.data).data;
  const answersubsctrict = await inquirer.prompt([
    {
      type: "list",
      name: "kabupaten",
      message: "Pilih Kabupaten:",
      choices: GetSubsctrict.map((p) => ({
        name: p.msrgName,
        value: p.msrgId,
      })),
    },
  ]);
  data_alamat.push({ ...answersubsctrict });
  const Village = await Curl(
    `https://linkumkm.id/master/subdistrict/${answersubsctrict.kabupaten}`,
    null
  );
  const GetVillage = JSON.parse(Village.data).data;
  const answervilage = await inquirer.prompt([
    {
      type: "list",
      name: "desa",
      message: "Pilih Kecamatan:",
      choices: GetVillage.map((p) => ({
        name: p.mssdName,
        value: p.mssdId,
      })),
    },
  ]);
  data_alamat.push({ ...answervilage });
  const PostCode = await Curl(
    `https://linkumkm.id/master/village/${answervilage.desa}`,
    null
  );
  const GetPostCode = JSON.parse(PostCode.data).data;
  const answerpost = await inquirer.prompt([
    {
      type: "list",
      name: "pos",
      message: "Pilih Desa:",
      choices: GetPostCode.map((p) => ({
        name: p.maviName,
        value: p.maviId,
      })),
    },
  ]);
  data_alamat.push({ ...answerpost });
  const Kode = await Curl(
    `https://linkumkm.id/master/postcode/${answerpost.pos}`,
    null
  );
  const GetKode = JSON.parse(Kode.data).data;
  const answercode = await inquirer.prompt([
    {
      type: "list",
      name: "code_post",
      message: "Pilih Pos:",
      choices: GetKode.map((p) => ({
        name: p.mspcdNumber,
        value: p.mspcdId,
      })),
    },
  ]);
  data_alamat.push({ ...answercode });

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
    let data
    do {
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
      const solver = new Solver(apikey);
       data = await solver.imageCaptcha(
        fs.readFileSync("captcha.jpg", "base64")
      );
    } while (data.data.length !== 5);
    log(`Capctha Fix ${data.data.toLocaleUpperCase()}`, "success");
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
        kode_captcha: data.data.toLocaleUpperCase(),
        honeypot: "",
      }),
      {
        cookie: cookie,
      }
    );
    log(FetchRegist.redirect, "warning");
    if (FetchRegist.redirect.includes("umkmscore/profile")) {
      log(`register success direct ${FetchRegist.redirect}`, "success");
      const BirthDay = await NikDate(Nik);
      const words = ["padi", "jagung", "kapulaga", "kentang", "kol", "bawang"];

      // Jumlah kata dalam teks acak
      const numberOfWords = 2;
      const randomText = await RandomText(words, numberOfWords);
      console.log(`     Jenis Produk : ${randomText}`);
      console.log(`     Alamat Usaha : Adisana`);
      const FetchProfile = await Curl(
        "https://linkumkm.id/umkmscore/submit_profile",
        new URLSearchParams({
          csrf_linkumkm: csrf,
          born_date: BirthDay,
          id_number: Nik,
          phone_number: Number,
          business_sector: "1",
          produced: randomText,
          business_address:address,
          province: data_alamat[0].province,
          regency: data_alamat[1].kabupaten,
          subdistrict: data_alamat[2].desa,
          village: data_alamat[3].pos,
          postal_code: data_alamat[4].code_post,
          url: "",
          honeypot: "",
        }),
        { cookie: cookie }
      );
      if (FetchProfile.redirect.includes("scoring_revamp")) {
        log(`Submit Data Success`, "success");
        // const FetchScoring = await Curl(
        //   "https://linkumkm.id/scoring_revamp",
        //   null,
        //   { cookie: cookie }
        // );
        // fs.appendFileSync('data.html',FetchScoring.data)
        const FetchAccept = await Curl(
          "https://linkumkm.id/access/kebijakanprivasiupdate/",
          null,
          { cookie: cookie }
        );
        const questionsAndAnswers = [
          { question: "1", answer: "1" },
          { question: "2", answer: "8" },
          { question: "3", answer: "13" },
          { question: "4", answer: "20" },
          { question: "5", answer: "22" },
          { question: "6", answer: "24" },
          { question: "7", answer: "26" },
          { question: "8", answer: "29" },
          { question: "9", answer: "32" },
          { question: "10", answer: "35" },
          { question: "11", answer: "39" },
          { question: "12", answer: "42" },
          { question: "13", answer: "45" },
          { question: "14", answer: "48" },
          { question: "15", answer: "52" },
          { question: "16", answer: "54" },
          { question: "17", answer: "57" },
          { question: "18", answer: "59" },
          { question: "19", answer: "62" },
          { question: "20", answer: "64" },
          { question: "21", answer: "66" },
          { question: "22", answer: "74" },
          { question: "23", answer: "80" },
          { question: "24", answer: "82" },
          { question: "25", answer: "85" },
          { question: "26", answer: "89" },
          { question: "27", answer: "92" },
          { question: "28", answer: "95" },
          { question: "29", answer: "104" },
        ];
        for (let index = 0; index <= 1; index++) {
          for (const { question, answer } of questionsAndAnswers) {
            const response = await Curl(
              "https://linkumkm.id/scoring_revamp/submit",
              new URLSearchParams({ question, answer }),
              { cookie: cookie }
            );
            const result = JSON.parse(response.data).data;
            log(
              `Q ${question} : Question Total : ${result.total_question} Terjawab ${result.user_answer} Precentage ${result.persentase}%`,
              "warning"
            );
          }
          
        }
        const FetchCalculating = await Curl(
          "https://linkumkm.id/scoring_revamp/calc",
          null,
          { cookie: cookie }
        );
        console.log(FetchCalculating);
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
