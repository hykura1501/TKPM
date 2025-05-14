function getLanguage(req, res, next) {
  req.language = req.query.lang || "en"; // Lấy ngôn ngữ từ query hoặc mặc định là "en"
  next();
}

module.exports = { getLanguage };