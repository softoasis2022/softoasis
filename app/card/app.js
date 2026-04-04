const express = require("express");
const app= express.Router();
const path = require("path");

//셀러가 판매하는 판매 상품을 구매 하면 제공 되는 카드를 구매자에게 발급하는 코드
//디자인은 ai 브랜드의 컨샙과 해당 상품을 보고 기본 프래임을 만든다.
//참고는 소프트오아시스 굿즈 구매시 게공되는 컬렉션 카드 시스템을 참고 하고
//만약 판매자가 직접 제작한 카드를 제공 한다면 해당 카드로 제공
//  요청 기본 루트는 /card

//타 사용자에게 해당 사용자의 카드를 노출 시킬때 /user
//사용자가 상품을 구매 하고 구매한 상품의 컬렉션 카드를 미리보기 할때 /shop/card
//카드 컬렉션북을 볼때

app.get("/", (req, res) => {

  res.sendFile("index.html", {
    root: path.join(__dirname, "pages","main", "html")
  });
});
app.use("/css", express.static(path.join(__dirname, "pages","main","css")));
app.use("/js", express.static(path.join(__dirname, "pages","main","js")));

module.exports = app;
