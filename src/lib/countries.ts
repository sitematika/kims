/**
 * Коды стран для поля телефона.
 *
 * Названия стран не храним: их отдаёт браузер через Intl.DisplayNames
 * на языке сайта — иначе пришлось бы держать список на четырёх языках
 * и обновлять его руками.
 *
 * mask — группировка цифр национального номера. Заодно задаёт их
 * количество: по числу решёток.
 */
export type Country = { iso: string; dial: string; mask: string };

export const countries: Country[] = [
  { iso: "UA", dial: "380", mask: "## ### ## ##" },
  { iso: "PL", dial: "48", mask: "### ### ###" },
  { iso: "LV", dial: "371", mask: "## ### ###" },
  { iso: "LT", dial: "370", mask: "### ## ###" },
  { iso: "EE", dial: "372", mask: "#### ####" },
  { iso: "ES", dial: "34", mask: "### ### ###" },
  { iso: "DE", dial: "49", mask: "#### #######" },
  { iso: "AT", dial: "43", mask: "### ######" },
  { iso: "CH", dial: "41", mask: "## ### ## ##" },
  { iso: "CZ", dial: "420", mask: "### ### ###" },
  { iso: "SK", dial: "421", mask: "### ### ###" },
  { iso: "HU", dial: "36", mask: "## ### ####" },
  { iso: "RO", dial: "40", mask: "### ### ###" },
  { iso: "BG", dial: "359", mask: "### ### ###" },
  { iso: "MD", dial: "373", mask: "## ### ###" },
  { iso: "IT", dial: "39", mask: "### ### ####" },
  { iso: "FR", dial: "33", mask: "# ## ## ## ##" },
  { iso: "PT", dial: "351", mask: "### ### ###" },
  { iso: "NL", dial: "31", mask: "# ## ## ## ##" },
  { iso: "BE", dial: "32", mask: "### ## ## ##" },
  { iso: "GB", dial: "44", mask: "#### ######" },
  { iso: "IE", dial: "353", mask: "## ### ####" },
  { iso: "SE", dial: "46", mask: "## ### ## ##" },
  { iso: "NO", dial: "47", mask: "### ## ###" },
  { iso: "DK", dial: "45", mask: "## ## ## ##" },
  { iso: "FI", dial: "358", mask: "## ### ####" },
  { iso: "GR", dial: "30", mask: "### ### ####" },
  { iso: "HR", dial: "385", mask: "## ### ####" },
  { iso: "SI", dial: "386", mask: "## ### ###" },
  { iso: "RS", dial: "381", mask: "## ### ####" },
  { iso: "TR", dial: "90", mask: "### ### ## ##" },
  { iso: "GE", dial: "995", mask: "### ## ## ##" },
  { iso: "AM", dial: "374", mask: "## ### ###" },
  { iso: "AZ", dial: "994", mask: "## ### ## ##" },
  { iso: "KZ", dial: "7", mask: "### ### ## ##" },
  { iso: "UZ", dial: "998", mask: "## ### ## ##" },
  { iso: "KG", dial: "996", mask: "### ### ###" },
  { iso: "AE", dial: "971", mask: "## ### ####" },
  { iso: "IL", dial: "972", mask: "## ### ####" },
  { iso: "US", dial: "1", mask: "### ### ####" },
  { iso: "CA", dial: "1", mask: "### ### ####" },
  { iso: "CY", dial: "357", mask: "## ######" },
  { iso: "MT", dial: "356", mask: "#### ####" },
  { iso: "LU", dial: "352", mask: "### ### ###" },
  { iso: "IS", dial: "354", mask: "### ####" },
];

/** Флаг страны эмодзи из двухбуквенного кода */
export function flagOf(iso: string) {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)),
  );
}

/** Сколько цифр в национальном номере по маске */
export function digitsInMask(mask: string) {
  return mask.split("#").length - 1;
}

/** Раскладывает цифры по маске: 671112233 -> 67 111 22 33 */
export function applyMask(digits: string, mask: string) {
  let out = "";
  let i = 0;
  for (const char of mask) {
    if (i >= digits.length) break;
    if (char === "#") {
      out += digits[i];
      i += 1;
    } else {
      out += char;
    }
  }
  return out + digits.slice(i);
}

/** Страна по умолчанию для языка сайта */
export function defaultIso(locale: string) {
  if (locale === "es") return "ES";
  if (locale === "en") return "GB";
  return "UA";
}
