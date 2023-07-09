/* 
maNhom 
1 tivi
2 food
3 mobile
*/
const xuatSanphamSale=(ds=[],tag,maNhom)=>{
    let html=``;

    ds.slice(0,4).forEach(sp=>{
        html+=`
        <div class="col mb-5">
            <div class="card h-100">
                <!-- Sale badge-->
                <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
                <!-- Product image-->
                <img class="card-img-top" src="${urlImage}/${sp.Ma_so}.png" alt="..." onclick="showModal(this,'${sp.Ten}')" />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder">${sp.Ten}</h5>
                        <!-- Product reviews-->
                        <div class="d-flex justify-content-center small text-warning mb-2">
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                            <div class="bi-star-fill"></div>
                        </div>
                        <!-- Product price-->
                        <span class="text-muted text-decoration-line-through">
                            ${sp.Don_gia_Ban.toLocaleString()}<sup>đ</sup>
                        </span>
                        ${(sp.Don_gia_Ban*0.9).toLocaleString()}<sup>đ</sup>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <input type="number" min="1" max="10" value="1" id="sl${sp.Ma_so}" />
                        <a class="btn btn-sm btn-outline-dark mt-auto" href="javaScript:void(0)" onclick="addCart('${sp.Ma_so}','${maNhom}')">Add to cart</a>
                    </div>
                </div>
            </div>
        </div> 
        `
    })

    tag.innerHTML=html;

}