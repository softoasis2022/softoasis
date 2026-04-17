function parseDns(url){
    const result = String(url).split("//");

    if(result[0] == "https:"){
        const parts = result[1].split("/");
        root(parts);
    }
    else{
        console.log("보안 취급 주의");
    }
}

function root(rootlist){
    const domain = rootlist[0];

    // 👉 나머지 경로
    const paths = rootlist.slice(1);

    // 👉 객체 생성
    const data = {
        [domain]: paths
    };

    console.log(data);
}

const dns = "https://shopping.naver.com/ns/home";

parseDns(dns);