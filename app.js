const endpoint  = "http://localhost:8080";
let seletedId = null;

window.addEventListener("load", initialApp);

async function initialApp ()  {
    await updateBoatTable();

    // document.querySelector("#form-create-boat").addEventListener("submit", createBoatSubmit);
    document.querySelector("#updateButton").addEventListener("click", updateBoatModel)
    document.querySelector("#createButton").addEventListener("click", createBoatSubmit);
}

async function createBoatSubmit(event) {
    event.preventDefault();

    let type = document.querySelector("#create-boat-type").value;
    let json = JSON.stringify({"type" : type})

    const response = await fetch(`${endpoint}/createboat`, {
        method: "PUT",
        body:json,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok){
        await updateBoatTable();
    }
}

async function updateBoatModel (event) {
    event.preventDefault();

    var type       = document.getElementById("update-boat-type").value;
    const json     = JSON.stringify({"type" : type})
    const response = await fetch(`${endpoint}/updateboat/${selectedId}`, {
        method: "POST",
        body:json,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok){
        document.querySelector("#dialog-update-boat").close();
        await updateBoatTable();
    }

}

async function GetAllBoats ()
{
    const response = await fetch(`${endpoint}/boats`);
    const data     = await response.json();

    return data;
}

async function deleteBoatById (id) {
    const response = await fetch(`${endpoint}/deleteboat/${id}`, {method: "DELETE"});

    //test om response gik godt
    if(response.ok){
        await updateBoatTable();
    }
}

// async function showUpdateDialog(boat){
//     seletedId = boat.id;
//     const form = document.querySelector("#form-update-boat");
//     form.type.value = boat.type;
//     document.querySelector("#dialog-update-boat").showModal();
// }


function showUpdateDialog(boat) {
    console.log(boat);
    selectedId = boat.id; // store the selected teacher's id in global variable
    const updateInputField = document.querySelector("#update-boat-type");
    updateInputField.value = boat.type;
    document.querySelector("#dialog-update-boat").showModal(); // display the modal
}

async function updateBoatTable ()
{
    var boats = await GetAllBoats();

    document.querySelector("#boat-table tbody").innerHTML = "";

    for (var i = 0; i < boats.length; i++)
    {
        let boat = boats[i];
        let html = /*html*/ `
        <tr>
            <td>${boat.id}</td>
            <td>${boat.type}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </td>
        </tr>
        `;

        document.querySelector("#boat-table tbody").insertAdjacentHTML("beforeend", html);
        document
            .querySelector("#boat-table tbody tr:last-child .btn-delete")
            .addEventListener("click", async function (){
                await deleteBoatById(boat.id);
            })
        document

            .querySelector("#boat-table tbody tr:last-child .btn-update")
            .addEventListener("click", async function (){
                await showUpdateDialog(boat);
            })
    }
}


