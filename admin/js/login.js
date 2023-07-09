const dangNhap=()=>{
    let ten=document.querySelector("#Th_Ten_Dang_nhap").value.trim();
    let matkhau=document.querySelector("#Th_Mat_khau").value.trim();
    if(ten!="" && matkhau!=""){
        let nguoidung={
            "Ten_Dang_nhap":ten,
            "Mat_khau": matkhau
        }
        apiDangnhap(nguoidung).then(result=>{
            if(result.Noi_dung){
                // Lưu session
                sessionStorage.setItem('USER',JSON.stringify(result.Noi_dung));
                // Chuyển trang
                window.location=`quantri.html`;
            }else{
                alert('Thông tin đăng nhập không hợp lệ')
            }
        }).catch(err=>{
            console.log(err)
        })
    }else{
        alert('Dữ liệu không hợp lệ')
    }

}

