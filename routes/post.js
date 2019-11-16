const router = require("express").Router();
const verify = require("./verifytoken");
router.get("/", verify, (req, res) => {
  res.send(req.user);
  res.json({
    posts: {
      title: "my first post",
      description: "random data you shouldnot access"
    }
  });
});
module.exports = router;
