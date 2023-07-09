let dsTivi = [];
let dsNhom = [];
let ds=[];




const locGia=(tag)=>{
    document.getElementById("lblGia").innerHTML=`${Number(tag.value).toLocaleString()}<sup>đ</sup>`
    let tmp =ds.filter(x=>x.Don_gia_Ban<=Number(tag.value));
    console.log(tag.value)
    xuatSanphamTivi(tmp,thLstTivi)
}

const keyCode=(event)=>{
    if (event.keyCode == 13) {
        //event.keyCode == 13  => người dùng nhấn phím Enter
        let gtTim = event.target.value
        //console.log(gtTim)
        let dsTim = ds.filter(x => x.Ten.toLowerCase().includes(gtTim.toLowerCase()))
        xuatSanphamTivi(dsTim,thLstTivi)
    }
}


const sxGia=(tag)=>{
    let sort=tag.getAttribute("sort")
    if(Number(sort)==1){
        // Sắp Giá tăng
        ds.sort((a,b)=>{
            return a.Don_gia_Ban - b.Don_gia_Ban
        })
        sort=-1
        tag.innerHTML="PRICE &dArr;"
    }else{
        // Sắp Giá giảm
        ds.sort((a,b)=>{
            return b.Don_gia_Ban - a.Don_gia_Ban
        })
        sort=1
        tag.innerHTML="PRICE &uArr;"
    }
    tag.setAttribute("sort",sort)
    xuatSanphamTivi(ds,thLstTivi)
}

const sxTen=(tag)=>{
    let sort=tag.getAttribute("sort")
    if(Number(sort)==1){
        // Sắp Tên tăng
        ds.sort((a,b)=>{
            return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase())
        })
        sort=-1
        tag.innerHTML="NAME &dArr;"
    }else{
        // Sắp Tên giảm
        ds.sort((a,b)=>{
            return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase())
        })
        sort=1
        tag.innerHTML="NAME &uArr;"
    }
    tag.setAttribute("sort",sort)
    xuatSanphamTivi(ds,thLstTivi)
}

const xuatSanphamtheoNhom=(maNhom)=>{
    console.log(maNhom);
    if(maNhom=="ALL"){
        ds=dsTivi;
    }else{
        ds=dsTivi.filter(x=>x.Nhom.Ma_so.toLowerCase()==maNhom.toLowerCase());
    }

    xuatSanphamTivi(ds,thLstTivi)

}

const xuatNhom=(dsNhom=[],tag)=>{
    let html=``
    dsNhom.forEach(nhom=>{
        html+=`
        <button class="btn btn-sm btn-outline-dark mt-auto" onclick="xuatSanphamtheoNhom('${nhom.Ma_so}')" >${nhom.Ten}</button>
        `
    })
    tag.innerHTML=html;
}

const taoNhom = () => {
    dsNhom = Array.from(new Set(dsTivi.map(x => x.Nhom.Ma_so))).map(Ma_so => {
        nhom = {
            Ma_so: Ma_so,
            Ten: dsTivi.find(x => x.Nhom.Ma_so == Ma_so).Nhom.Ten.toUpperCase()
        }
        return nhom
    })

    dsNhom.unshift({
        "Ma_so":"ALL",
        "Ten":"ALL"
    })

}
const xuatSanphamTivi = (ds = [], tag) => {
    let html = ``;
    ds.forEach(sp => {
        html += `
        <div class="col mb-5">
            <div class="card h-100">
                <!-- Product image-->
                <img class="card-img-top" src="${urlImage}/${sp.Ma_so}.png" alt="..." onclick="showModal(this,'${sp.Ten}')" />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder">
                            ${sp.Ten}
                        </h5>
                        <small class="text-secondary">Hãng Sản xuất:${sp.Nhom.Ten.toUpperCase()}</small>
                        <!-- Product reviews-->
                        <div class="d-flex justify-content-center small text-warning mb-2">
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                        </div>
                        <!-- Product price-->
                        ${sp.Don_gia_Ban.toLocaleString()}<sup>đ</sup>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                    <input type="number" min="1" max="10" value="1" id="sl${sp.Ma_so}" />
                    <a class="btn btn-sm btn-outline-dark mt-auto" href="javaScript:void(0)" onclick="addCart('${sp.Ma_so}','1')">Add to cart</a>
                    </div>
                </div>
            </div>
        </div>
    `
        
    })
    tag.innerHTML = html;
}



