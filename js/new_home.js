let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    if(site_properties.use_local_storage.match("true")){
        getEmployeePayrollDataFromStorage();
    } else getEmployeePayrollDataFromServer();
});

const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromStorage = () => {
    empPayrollList = localStorage.getItem('EmployeePayrollList') ?
                        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer = () => {
    makePromiseCall("GET", site_properties.server_url, true)
        .then(responseText => {
            empPayrollList = JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("GET Error Status: "+JSON.stringify(error));
            empPayrollList = [];
            processEmployeePayrollDataResponse();
        });
}

//Tempelate literal ES6 feature
const createInnerHtml = () => {
    if (empPayrollList.length == 0) return;
    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th>"+
                        "<th>Salary</th><th>Start Date</th><th>Actions</th>";
    let innerHtml = `${headerHtml}`;
    for (const empPayrollData of empPayrollList) {
        innerHtml = `${innerHtml}
            <tr>
                <td>
                    <img class="profile" src="${empPayrollData._profilePic}" alt="">
                    </td>
                    <td>${empPayrollData._name}</td>
                    <td>${empPayrollData._gender}</td>
                    <td>${getDeptHtml(empPayrollData._department)}</td>
                    <td>${empPayrollData._salary}</td>
                    <td>${stringifyDate(empPayrollData._startDate)}</td>
                    <td>
                        <img id="${empPayrollData.id}" onclick="remove(this)"
                            src="../assets/icons/delete-black-18dp.svg" alt="delete">
                        <img id="${empPayrollData.id}" alt="edit" onclick="update(this)"
                            src="../assets/icons/create-black-18dp.svg">
                </td>
            </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml;
}

const remove = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if(!empPayrollData) return;
    const index = empPayrollList
                    .map(empData => empData.id)
                    .indexOf(empPayrollData.id);
    empPayrollList.splice(index, 1);
    if(site_properties.use_local_storage.match("true")){
        localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
        //document.querySelector(".emp-count").textContent = empPayrollList.length;
        createInnerHtml();
    } else {
        const deleteURL = site_properties.server_url + empPayrollData.id.toString();
        makePromiseCall("DELETE", deleteURL, false)
            .then(responseText => {
                createInnerHtml();
            })
            .catch(error => {
                console.log("DELETE Error Status: "+JSON.stringify(error));
            });
    }
}