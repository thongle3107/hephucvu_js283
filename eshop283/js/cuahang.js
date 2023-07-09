let cuaHang={};

const xuatCuahang=(cuaHang,tag)=>{
    let html=``;
    html+=`
    <div class="text-left text-white">
        <h1 class="fw-bolder">
            ${cuaHang.Ten}
        </h1>
        <p class="lead fw-normal text-white-50 mb-0">
           Adress: ${cuaHang.Dia_chi} <br> Phone: ${cuaHang.Dien_thoai} <br> Email: ${cuaHang.Email}
        </p>
    </div>
    `
    tag.innerHTML=html;
}