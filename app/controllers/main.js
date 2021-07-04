const service = new UserService ();
const validation = new Validation();

function getEle (id) {
    return document.getElementById(id)
}

let mangUser = []

let deleteId;

let editId;


// get API
function getUserList(params) {
    service.getUserListAPI()
        .then(result => {
            renderUsers(result.data)
            mangUser = result.data
            return mangUser
        })
        .catch(error => {
            console.log(error)
        })
}

getUserList();

function renderUsers(userList) {
    let html = "";
    userList.map((user, index) => {
        let css = ""
        if(index % 2 === 0) {
            css = ""
        } else {
            css = "den"
        }
        html += `
            <tr class=${css}>
                <td>${index +1}</td>
                <td>${user.taiKhoan}</td>
                <td>${user.matKhau}</td>
                <td>${user.hoTen}</td>
                <td>${user.email}</td>
                <td>${user.ngonNgu}</td>
                <td>${user.loaiND}</td>
                <td>
                    <button class="btn btn-danger" data-toggle="modal" data-target="#ModalDelete" onclick="handleTrashBtn(${user.id})"><i class="fas fa-trash"></i></button>
                    <button class="btn btn-primary" onclick="handleSuaBtn(${user.id})"
                    data-toggle="modal"
                    data-target="#myModal">
                        <i class="fas fa-user-edit"></i>
                    </button>
                </td>
            </tr>
        `
    })

    document.querySelector("#tblDanhSachNguoiDung").innerHTML = html;
}


// them moi
function handleThemMoiBtn () {
    document.querySelector(".modal-title").innerHTML = "Thêm mới người dùng";
    document.querySelector(".modal-footer").innerHTML = `
    <button class="btn btn-success" type="submit"
        onclick="handleThemMoi(event)">
        Thêm người dùng
    </button>
    `;

    resetErrorMessage();

    getEle("TaiKhoan").disabled = false;
    getEle("MatKhau").type = "password";

    // reset input
    getEle("TaiKhoan").value = "";
    getEle("HoTen").value= "";
    getEle("MatKhau").value= "";
    getEle("Email").value= "";
    getEle("HinhAnh").value= "";
    getEle("loaiNguoiDung").selectedIndex= 0;
    getEle("loaiNgonNgu").selectedIndex= 0; 
    getEle("MoTa").value= "";

}


function layThongTinNhanVien(isAdd) {
    let TaiKhoan = getEle("TaiKhoan").value;
    let HoTen = getEle("HoTen").value;
    let MatKhau = getEle("MatKhau").value;
    let Email = getEle("Email").value;
    let HinhAnh = getEle("HinhAnh").value;
    let loaiNguoiDung = getEle("loaiNguoiDung").value;
    let loaiNgonNgu = getEle("loaiNgonNgu").value; 
    let MoTa = getEle("MoTa").value;

// validation
    var isValid = true;
        
    
    // TaiKhoan
    if (isAdd) {
        isValid&=validation.kiemTraRong(
            TaiKhoan,
            "TaiKhoanError",
            "* Vui lòng nhập tài khoản."
        )&& 
        validation.kiemTraTrung(
            TaiKhoan,
            "TaiKhoanError",
            "* Tài khoản đã tồn tại!",
            mangUser
        );
    }

    // name

    isValid&=validation.kiemTraRong(
        HoTen,
        "HoTenError",
        "* Vui lòng nhập tên người dùng."
    )&&
    validation.kiemTraChu(
        HoTen,
        "HoTenError",
        "* Vui lòng nhập chữ."
    )

    //password 
    isValid&=validation.kiemTraRong(
        MatKhau,
        "MatKhauError",
        "* Vui lòng nhập mật khẩu."
    )&&
    validation.kiemTraDoDaiKyTu(
        MatKhau,
        "MatKhauError",
        "* Vui lòng nhập từ 6 - 8 ký tự.",
        6,
        8
    )&&
    validation.kiemTraPassword(
        MatKhau,
        "MatKhauError",
        "* Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự thường và 1 ký tự đặc biệt."
    )



    // email 
    isValid&=validation.kiemTraRong(
        Email,
        "EmailError",
        "* Vui lòng nhập email người dùng."
    )&&
    validation.kiemTraEmail(
        Email,
        "EmailError",
        "* Email không đúng định dạng!"
    )

    // hinhAnh
    isValid&=validation.kiemTraRong(
        HinhAnh,
        "HinhAnhError",
        "* Vui lòng nhập hình ảnh người dùng."
    )


    // loaiNguoiDung
    isValid&=validation.kiemTraSelect(
        "loaiNguoiDung",
        "loaiNguoiDungError",
        "Vui lòng chọn loại người dùng."
    )


    // loaiNgonNgu
    isValid&=validation.kiemTraSelect(
        "loaiNgonNgu",
        "loaiNgonNguError",
        "Vui lòng chọn loại người dùng."
    )

    // MoTa
    isValid&=validation.kiemTraRong(
        MoTa,
        "MoTaError",
        "* Vui lòng nhập trường này."
    )&&
    validation.kiemTraDoDaiKyTu(
        MoTa,
        "MoTaError",
        "* Độ dài mô tả không được vượt quá 60 ký tự.",
        0,
        60
    )



    if (isValid) {
        let user = new User (TaiKhoan, HoTen, MatKhau, Email, loaiNguoiDung, loaiNgonNgu, MoTa, HinhAnh);
        return user
    }

    return null;
}


// addUser
function handleThemMoi(event) {
    event.preventDefault()
    let user = layThongTinNhanVien(true)
    if (user) {
        service.addUserAPI(user)
        .then(result => {
            getUserList()
            document.querySelector(".close").click()
        })
        .catch(error => {
            console.log(error)
        })
    }
}


// deleteUser

function handleTrashBtn(id) {
    deleteId = id
    // console.log(userName)
    // document.querySelector(".delete-user").innerHTML = userName
}

function deleteUser() {
    service.deleteUserAPI(deleteId)
        .then(result =>{
            getUserList()
            document.querySelector(".close-delete").click()
        })
        .catch(error =>{
            console.log(error)
        })
}


// edit user
function handleSuaBtn(id) {
    editId = id;
    document.querySelector(".modal-title").innerHTML = "Chỉnh sửa người dùng";
    document.querySelector(".modal-footer").innerHTML = `
    <button class="btn btn-warning" type="submit"
        onclick= "updateUser(event)">
        Cập nhật người dùng
    </button>
    `
    resetErrorMessage()
    service.getInforUser(id)
        .then(result =>{
            const userEdit = result.data
            let TaiKhoan = getEle("TaiKhoan");
            let HoTen = getEle("HoTen");
            let MatKhau = getEle("MatKhau");
            let Email = getEle("Email");
            let HinhAnh = getEle("HinhAnh");
            let loaiNguoiDung = getEle("loaiNguoiDung");
            let loaiNgonNgu = getEle("loaiNgonNgu"); 
            let MoTa = getEle("MoTa");

            TaiKhoan.value = userEdit.taiKhoan;
            TaiKhoan.disabled = true;


            HoTen.value = userEdit.hoTen;
            MatKhau.value = userEdit.matKhau;
            MatKhau.type = "text"

            Email.value = userEdit.email;
            HinhAnh.value = userEdit.hinhAnh;
            loaiNguoiDung.value = userEdit.loaiND;
            loaiNgonNgu.value = userEdit.ngonNgu;
            MoTa.value = userEdit.moTa;
        })
        .catch(error => {
            console.log(error)
        })
}

function updateUser(event) {
    event.preventDefault()
    let user = layThongTinNhanVien(false)
    if (user) {
        service.updateUserAPI(user, editId)
            .then(result => {
                getUserList()
                document.querySelector(".close").click()
            })
            .catch(error => {
                console.log(error)
            })
    }


}

// tim kiem
function handleTimKiem() {
    let searchValue = document.querySelector(".searchInput").value.toLowerCase().trim()

    let mangSearch = []

    mangUser.map(user => {
        let lowerCase = user.hoTen.toLowerCase().trim()
        if (lowerCase.includes(searchValue)) {
            mangSearch.push(user)
        }
    })

    if (mangSearch.length) {
        renderUsers(mangSearch)
    } else {
        document.querySelector("#tblDanhSachNguoiDung").innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Không tìm thấy kết quả.</td>
            </tr>
        `
    }

    document.querySelector(".reset").classList.remove("d-none")
}

// reset error message

function resetErrorMessage() {
    getEle("TaiKhoanError").innerHTML = '';
    getEle("HoTenError").innerHTML = '';
    getEle("MatKhauError").innerHTML = '';
    getEle("EmailError").innerHTML = '';
    getEle("HinhAnhError").innerHTML = '';
    getEle("loaiNguoiDungError").innerHTML = '';
    getEle("loaiNgonNguError").innerHTML = '';
    getEle("MoTaError").innerHTML = '';
}