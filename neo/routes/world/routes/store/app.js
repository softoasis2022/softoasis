const express = require("express");
const { route } = require("../town/app");
const { get } = require("request");
const routes = express.Router();

routes.get("/",()=>{
    //스토어 홈

});
routes.post("/",()=>{
    //스토어 홈 요청 사항
    //아직은 없음
    //추후 추가 예정

});
routes.get("/",()=>{
    //상품 상세 페이지

});
routes.post("/",()=>{
    //상품 옵션 셩택후 요청

});
routes.get("/",()=>{
    //장바구니

});
routes.post("/",()=>{
    //장바구니 상품 리스트

});
routes.get("/",()=>{
    //결제 창
});
routes.post("/",()=>{
    //결제 창
    //결제 명세서 번호 로 요청후
});


module.exports = routes