let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) =>{
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function(){
        if(name.value.length == 0){
            textError.textContent ="";
            return;
        }
        try{
            checkName(name.value);
            textError.textContent ="";
        } catch (e){
            textError.textContent = e;
        }
    });

    const date = document.querySelector("#startDates");
    date.addEventListener('input', function(){
        const startDate = new Date(Date.parse(getInputValueById('#startDates')));
        try{
            checkStartDate(new Date(Date.parse(startDate)));
            setTextValue('.date-error', "");
        } catch (e) {
            setTextValue('.date-error',e);
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input',function(){
    output.textContent = salary.value;
    });

    checkForUpdate();
});

const save = (event) => {
    event.preventDefault();
    try{
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);
    } catch (e){
        return;
    }
}

const setEmployeePayrollObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")){
         employeePayrollObj.id = createNewEmployeeId();
    }
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#startDates');
    employeePayrollObj._startDate = date;
}

function createAndUpdateStorage(){

    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList){
        let empPayrollData = employeePayrollList.
                            find(empData => empData.id == employeePayrollObj.id);
        if(!empPayrollData){
            employeePayrollList.push(employeePayrollObj);
        } else {
            const index = employeePayrollList
                            .map(empData => empData.id)
                            .indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }
    } else {
        employeePayrollList = [employeePayrollObj]
    }
    alert("Success!!!");
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let setItems = [];
    allItems.forEach(item => {
        if(item.checked) setItems.push(item.value);
    });
    return setItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getInputElementValue = (id) => {
    let value = document.getElementById(id).value;
    return value;
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    setValue('#startDates', employeePayrollObj._startDate);
}

const resetForm = () => {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day','1');
    setValue('#month','January');
    setValue('#year','2020');
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item =>{
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }
        else if (item.value === value)
            item.checked = true;
    });
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}