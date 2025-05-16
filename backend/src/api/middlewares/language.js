function getLanguage(req, res, next) {
  //Lấy từ header
  const language = req.headers["accept-language"];
  req.language = req.query.lang || language || "vi"; // Lấy ngôn ngữ từ query hoặc mặc định là "en"
  next();
}

module.exports = { getLanguage };