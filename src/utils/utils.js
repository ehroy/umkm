import chalk from "chalk";
function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function RandomText(wordList, numWords) {
  let randomText = "";
  for (let i = 0; i < numWords; i++) {
    randomText += getRandomItem(wordList);
    if (i < numWords - 1) {
      randomText += ","; // Tambahkan spasi antara kata
    }
  }
  return randomText;
}

export function NikDate(nik) {
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

export function log(msg, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  };
  switch (type) {
    case "success":
      console.log(`[${timestamp}] ➤ ✅  ${chalk.green(msg)}`);
      break;
    case "custom":
      console.log(`[${timestamp}] ➤ ℹ️  ${chalk.magenta(msg)}`);
      break;
    case "error":
      console.log(`[${timestamp}] ➤ ❌  ${chalk.red(msg)}`);
      break;
    case "warning":
      console.log(`[${timestamp}] ➤ ⚠️  ${chalk.yellow(msg)}`);
      break;
    default:
      console.log(`[${timestamp}] ➤  ${msg}`);
  }
}
