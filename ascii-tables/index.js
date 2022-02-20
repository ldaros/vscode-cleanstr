exports.createTable = function (csv, tableStyle) {
  // set up the style
  let cTL, cTM, cTR;
  let cML, cMM, cMR;
  let cBL, cBM, cBR;
  let hdV, hdH;
  let spV, spH;

  let prefix = "";
  let suffix = "";

  let input = csv;
  let style = tableStyle;
  let headerStyle = "top";
  let trimInput = true;
  let hasHeaders = headerStyle == "top";
  let separator = ","; // csv separator

  //Default separator is comma
  if (separator == "") separator = ",";

  // split rows
  let rows = input.split(/[\r\n]+/);

  // extraneous last row, so delete it
  if (rows[rows.length - 1] == "") rows.pop();

  // calculate the max size of each column
  let colLengths = [];
  let isNumberCol = [];

  for (let i = 0; i < rows.length; i++) {
    if (trimInput) rows[i] = rows[i].trim();

    // replace tabs with single characters to keep correct spacing
    rows[i] = rows[i].replace(/\t/g, "    ");

    let cols = rows[i].split(separator);
    for (let j = 0; j < cols.length; j++) {
      let data = cols[j];
      let isNewCol = colLengths[j] == undefined;
      if (isNewCol) {
        isNumberCol[j] = true;
      }

      if (isNewCol || colLengths[j] < data.length) {
        colLengths[j] = data.length;
      }
    }
  }

  // default styles
  let hasHeaderSeparators = true;
  let hasTopLine = false;
  let hasBottomLine = false;
  let hasLeftSide = true;
  let hasRightSide = true;

  // prettier-ignore
  if (style == "compact") { // ascii - compact
    cML = " "; cMM = " "; cMR = " ";
    hdV = " "; hdH = "-";
    spV = " "; spH = "-";
  }

  // prettier-ignore
  if (style == "gfm") { // github markdown
    cTL = "|"; cTM = "|"; cTR = "|";
    cML = "|"; cMM = "|"; cMR = "|";
    cBL = "|"; cBM = "|"; cBR = "|";
    hdV = "|"; hdH = "-";
    spV = "|"; spH = "-";
  }

  // prettier-ignore
  if (style == "unicode_single_line") { // unicode one line
    hasTopLine = true;
    hasBottomLine = true;

    cTL = "\u250C"; cTM = "\u252C"; cTR = "\u2510";
    cML = "\u251C"; cMM = "\u253C"; cMR = "\u2524";
    cBL = "\u2514"; cBM = "\u2534"; cBR = "\u2518";
    hdV = "\u2502"; hdH = "\u2500";
    spV = "\u2502"; spH = "\u2500";
  }

  // output the text
  let output = "";

  // output the top most row
  // Ex: +---+---+
  if (hasTopLine) {
    let topLineHorizontal = "";

    topLineHorizontal = hdH;

    output += getSeparatorRow(
      colLengths,
      cTL,
      cTM,
      cTR,
      topLineHorizontal,
      prefix,
      suffix
    );
  }

  for (let i = 0; i < rows.length; i++) {
    // Separator Rows
    if (hasHeaders && hasHeaderSeparators && i == 1) {
      // output the header separator row
      output += getSeparatorRow(colLengths, cML, cMM, cMR, hdH, prefix, suffix);
    }

    for (let j = 0; j <= colLengths.length; j++) {
      // output the data
      if (j == 0) output += prefix;

      let cols = rows[i].split(separator);
      let data = cols[j] || "";

      let verticalBar = "";

      if (hasHeaders && i == 0) verticalBar = hdV;
      else verticalBar = spV;

      if (j < colLengths.length) {
        data = _pad(data, colLengths[j]);
        if (j == 0 && !hasLeftSide) output += "  " + data + " ";
        else output += verticalBar + " " + data + " ";
      } else if (hasRightSide) {
        output += verticalBar + suffix + "\n";
      } else output += suffix + "\n";
    }
  }

  // output the bottom line
  // Ex: +---+---+
  if (hasBottomLine) {
    output += getSeparatorRow(colLengths, cBL, cBM, cBR, spH, prefix, suffix);
  }

  return output;
};

function getSeparatorRow(
  lengths,
  left,
  middle,
  right,
  horizontal,
  prefix,
  suffix
) {
  let rowOutput = prefix;

  for (let j = 0; j <= lengths.length; j++) {
    if (j == 0) {
      rowOutput += left + _repeat(horizontal, lengths[j] + 2);
    } else if (j < lengths.length) {
      rowOutput += middle + _repeat(horizontal, lengths[j] + 2);
    } else {
      rowOutput += right + suffix + "\n";
    }
  }
  return rowOutput;
}

function _pad(text, length) {
  return text + _repeat(" ", length - text.length);
}

function _repeat(str, num) {
  return new Array(num + 1).join(str);
}
