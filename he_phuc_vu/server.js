require('dotenv').config();
const http = require("http");
const port = process.env.PORT;
const fs = require("fs");
const db = require("./mongoDB");
const sendMail=require("./sendMail");
const imgCloud= require("./cloudinaryImages")

const server = http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    let ket_qua = `Server NodeJS - Method:${method} - Url:${url}`;
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*'); 
    if (method == "GET") {
        if (url == "/dsTivi") {
            try {
                db.getAll("tivi").then(result => {
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })    
            } catch (error) {
                console.log(err) 
            }
            
        } else if (url == "/dsDienthoai") {
            try {
                db.getAll("mobile").then(result=>{
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })
            } catch (error) {
               console.log(error)
            }
        }
        else if (url == "/dsQuangcao") {
            try {
                db.getAll("commerce").then(result=>{
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })
            } catch (error) {
               console.log(error)
            }
        } else if (url == "/Cuahang") {
            try {
                db.getAll("store").then(result => {
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })    
            } catch (error) {
                console.log(err) 
            }
        } else if (url == "/dsHocsinh") {
            try {
                db.getAll("student").then(result => {
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })    
            } catch (error) {
                console.log(err) 
            }
        } else if (url == "/dsNguoidung") {
            try {
                db.getAll("user").then(result => {
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })    
            } catch (error) {
                console.log(err) 
            }
        } else if (url == "/dsMathang") {
            try {
                db.getAll("food").then(result => {
                    ket_qua=JSON.stringify(result);
                    res.writeHead(200,{"Content-Type":"text/json,charset=utf-8"});
                    res.end(ket_qua);
                })    
            } catch (error) {
                console.log(err) 
            }
        } else if (url.match("\.png$")) {
            let imagePath = `images/${url}`;
            if (!fs.existsSync(imagePath)) {
                imagePath = `images/noImage.png`;
            }
            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/png" });
            fileStream.pipe(res);
        } else {
            res.writeHead(200, { "Content-Type": "text/json,charset=utf-8" });
            res.end(ket_qua);
        }
    } else if (method == "POST") {
        // Lấy nội dung Client gởi về Server
        let noi_dung_nhan = ``;
        req.on("data", (data) => {
            noi_dung_nhan += data
        })
        // Xử lý
        if (url == "/Dathang") {
            req.on("end", () => {
                let dsDathang = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": [] };
                dsDathang.forEach(item => {
                    let filter = {
                        "Ma_so": item.key
                    }
                    let collectionName = (item.manhom == 1) ? "tivi" : (item.manhom == 2) ? "food" : "mobile";
                    db.getOne(collectionName, filter).then(result => {
                        item.dathang.So_Phieu_Dat = result.Danh_sach_Phieu_Dat.length + 1;
                        result.Danh_sach_Phieu_Dat.push(item.dathang);
                        // Update
                        let capnhat = {
                            $set: { Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat }
                        }
                        let obj = {
                            "Ma_so": result.Ma_so,
                            "Update": true
                        }
                        db.updateOne(collectionName, filter, capnhat).then(result => {
                            if (result.modifiedCount == 0) {
                                obj.Update = false
                            }
                            ket_qua.Noi_dung.push(obj);
                            console.log(ket_qua.Noi_dung)
                            if (ket_qua.Noi_dung.length == dsDathang.length) {
                                res.end(JSON.stringify(ket_qua));
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }).catch(err => {
                        console.log(err);
                    })

                })
            })
        }
        else if(url == "/Lienhe"){
            req.on("end",function(){
                //let thongTin=JSON.parse(noi_dung_Nhan);
                let Ket_qua = { "Noi_dung": true };
                let from=`admin.shoptt@gmail.com`;
                let to=`lethong3107@gmail.com`;

                let subject=`Test Mail`;
                let body=`<b>Test Mail</b>`

                // let subject=thongTin.tieude;
                // let body=thongTin.noidung;
                sendMail.Goi_Thu_Lien_he(from,to,subject,body).then(result=>{
                    console.log(result)
                    res.end(JSON.stringify(Ket_qua));
                }).catch(err=>{
                    console.log(err);
                    Ket_qua.Noi_dung=false;
                    res.end(JSON.stringify(Ket_qua));
                })
            })
        }
        else if (url == "/Dangnhap") {
            req.on("end", () => {
                let ket_qua = {
                    "Noi_dung": true
                }
                let user=JSON.parse(noi_dung_nhan);
                let dieukien = {
                    $and: [
                        { "Ten_Dang_nhap": user.Ten_Dang_nhap },
                        { "Mat_khau": user.Mat_khau }
                    ]
                }
                db.getOne("user",dieukien).then(result=>{
                    console.log(result)
                    ket_qua.Noi_dung = {
                        "Ho_ten": result.Ho_ten,
                        "Nhom": {
                            "Ma_so": result.Nhom_Nguoi_dung.Ma_so,
                            "Ten": result.Nhom_Nguoi_dung.Ten
                        }
                    };
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));

                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung=false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })	
            })
        }
        else if (url == "/ThemDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("mobile", mobile).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        }
        else if (url == "/ImagesDienthoai") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------
                
                // let kq = saveMedia(img.name, img.src)
                // if (kq == "OK") {
                //     res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                //     res.end(JSON.stringify(Ket_qua));
                // }else{
                //     Ket_qua.Noi_dung=false
                //     res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                //     res.end(JSON.stringify(Ket_qua));
                // }

                // upload img host cloudinary ------------------------------
                
                imgCloud.UPLOAD_CLOUDINARY(img.name,img.src).then(result=>{
                    console.log(result);
                    res.end(JSON.stringify(Ket_qua));

                }).catch(err=>{
                    Ket_qua.Noi_dung=false
                    res.end(JSON.stringify(Ket_qua))
                })
                
            })

        }
        else if (url == "/SuaDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("mobile",mobile.condition,mobile.update).then(result=>{
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua)) 
                })
            })
        }
        else if (url == "/XoaDienthoai") {
            req.on('end', function () {
                let mobile = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("mobile",mobile).then(result=>{
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
                
            })

        }
        ///////////////
        else if (url == "/ThemTivi") {
            req.on('end', function () {
                let tivi = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.insertOne("tivi", tivi).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        }
        else if (url == "/ImagesTivi") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------
                
                // let kq = saveMedia(img.name, img.src)
                // if (kq == "OK") {
                //     res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                //     res.end(JSON.stringify(Ket_qua));
                // }else{
                //     Ket_qua.Noi_dung=false
                //     res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                //     res.end(JSON.stringify(Ket_qua));
                // }

                // upload img host cloudinary ------------------------------
                
                imgCloud.UPLOAD_CLOUDINARY(img.name,img.src).then(result=>{
                    console.log(result);
                    res.end(JSON.stringify(Ket_qua));

                }).catch(err=>{
                    Ket_qua.Noi_dung=false
                    res.end(JSON.stringify(Ket_qua))
                })
                
            })

        }
        else if (url == "/SuaTivi") {
            req.on('end', function () {
                let tivi = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.updateOne("tivi",tivi.condition,tivi.update).then(result=>{
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua)) 
                })
            })
        }
        else if (url == "/XoaTivi") {
            req.on('end', function () {
                let tivi = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": true };
                db.deleteOne("tivi",tivi).then(result=>{
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua))
                })
                
            })

        }
    }

})

server.listen(port, () => {
    console.log(`Service Run IP: http://localhost:${port}`)
})

function saveMedia(Ten, Chuoi_nhi_phan) {
    var Kq = "OK"
    try {
        var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
        var Duong_dan = "images//" + Ten
        fs.writeFileSync(Duong_dan, Nhi_phan.data);
    } catch (Loi) {
        Kq = Loi.toString()
    }
    return Kq
}