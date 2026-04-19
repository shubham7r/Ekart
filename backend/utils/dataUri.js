import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const getDataUri = (file) => {
  try {
    // ❌ safety check
    if (!file || !file.buffer) {
      console.log("❌ No file buffer found");
      return null;
    }

    const extName = path.extname(file.originalname).toString();

    // ✅ return FULL object (NOT .content)
    return parser.format(extName, file.buffer);
  } catch (error) {
    console.log("❌ DataUri Error:", error.message);
    return null;
  }
};

export default getDataUri;
