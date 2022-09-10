const dataShow = document.querySelector("#dataShow")    
const formAdd = document.querySelector("#formAdd")
const addField = document.querySelector(".addField");
const addBalance = document.querySelector("#addBalance")


const readFromStorage = (key="users", dataType="array") => {
    let data
    try{
        data = JSON.parse(localStorage.getItem(key)) || []
        if(!Array.isArray(data) && dataType=="array") throw new Error("No Data")
    }
    catch(e){
        data = []
    }
    return data
}

const writeToStorage = (data, key="users") => {
    localStorage.setItem(key, JSON.stringify(data))
}

const heads = ["name", "intial balance"];
const createUserObject = (formAdd) =>{
    let user = { id: Date.now(), "remaining balance": formAdd.elements["intial balance"].value };
    heads.forEach(head => user[head]= formAdd.elements[head].value)
    return user 
}
const createMyElem = (elem, parent, txt, classes) =>{
    const myElem = document.createElement(elem);
    parent.appendChild(myElem);    
    if(txt) myElem.innerText= txt
    if(classes)  myElem.classList = classes
    
    return myElem
}
const showUser = (user, operText)=>{
    writeToStorage({ ...user,  oper: operText} , "user")
    window.location.href = "single.html"
}

const deleteUser = (users, i)=>{
    users.splice(i,1)
    writeToStorage(users)
    drawData(users)
}

const drawData = (users) => {
    dataShow.innerHTML=""
    if(users.length==0){
        let tr = createMyElem("tr", dataShow, "", "alert alert-danger")
        let td = createMyElem("td", tr, "no data found", "")
        td.setAttribute("colspan", "5")
    }
    users.forEach((user, i)=>{
        let tr = createMyElem("tr", dataShow)
        createMyElem("td", tr, user.id)
        createMyElem("td", tr, user.name)
        createMyElem("td", tr, user["intial balance"])
        createMyElem("td", tr, user["remaining balance"])
        let td = createMyElem("td", tr)
        
        

        let addBalance = createMyElem("button", td, "Add Balance", "btn btn-primary mx-2")
        addBalance.addEventListener("click", () => showUser(users[i], "Add"))

        let withDraw = createMyElem("button", td, "Withdraw", "btn btn-warning mx-2")
        withDraw.addEventListener("click", () => showUser(users[i], "Withdraw"))

        let dele = createMyElem("button", td, "Delete", "btn btn-danger mx-2")
        dele.addEventListener("click", () => deleteUser(users, i));
    })
}


const funOper = (user) => {
    let value = Number(addField.value);
        user["remaining balance"] = user.oper === "Add" ? String(+user["remaining balance"] + value) : String(+user["remaining balance"] - value);
        let users = readFromStorage("users");
        let index = users.findIndex((u => u.id === user.id));
        users[index] = user;
        writeToStorage(users, "users");
        window.location.href = './index.html';
}


if(formAdd){
    formAdd.addEventListener("submit", function(e){
        e.preventDefault()
        const user = createUserObject(this)
        const users = readFromStorage()
        users.push(user)
        writeToStorage(users)
        window.location.href="index.html"
    })
}

if(dataShow) {
    const users = readFromStorage()
    drawData(users)
}

if (addBalance) {
    let user = readFromStorage("user", "object");
    let button = createMyElem("button", addBalance, user.oper);
    button.addEventListener("click", (e)=> funOper(user));
}




