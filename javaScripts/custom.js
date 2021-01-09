//------------------------------------------------------------------------------------------------------
// My Task Board 
// Written by: Shahar Avshalom
// Version: 1.1
// January 2021
//------------------------------------------------------------------------------------------------------

// Global variables ------------------------------------------------------------------------------------

// Form variables
var taskTitle = document.getElementById("myTaskTitle");
var taskDate = document.getElementById("myTaskDate");
var taskTime = document.getElementById("myTaskTime");

// Object and local Storage variables
var tasksJSON; // String
var Tasks; // Object

// inner HTML variables 
var output = "";


// Core Functions ------------------------------------------------------------------------------------

function init() {

    // init Language & Tasks
    initLanguage();
    getTasksFromLocalStorage();

    // init Date and Time
    insertDefaultDate();
    insertDefaultTime();

    upDateHTML();
}

function addTask() {

    newTask = {
        _title: taskTitle.value,
        _date: taskDate.value,
        _time: taskTime.value
    };
    // Add to object and localStorage
    Tasks.push(newTask);
    setTasksToLocalStorage();

    // Clean the Form
    taskTitle.value = "";
    insertDefaultDate();
    insertDefaultTime();

    upDateHTML("newTask");
    return false;

}

function deleteTask(me) {

    let place = me.getAttribute("taskID");
    // Delete the task from the object
    Tasks.splice(place, 1);
    // Update local storage and web page
    setTasksToLocalStorage();
    upDateHTML();

}

function upDateHTML(isNewTask) {

    output = "";
    getTasksFromLocalStorage();

    for (let index = 0; index < Tasks.length; index++) {

        // Just a new note fade-in
        if (index == Tasks.length - 1 && isNewTask == "newTask") {
            output += `<div class = "col-md-3" style="animation: FadeIn 5s; -webkit-animation: FadeIn 5s;">`;
        } else {
            output += `<div class = "col-md-3">`;
        }

        // Create a note 
        output += `<div class="card" >
                        <div class="card-header">
                            <button type="button" taskID="${index}" onclick="deleteTask(this)" > <i class="far fa-times-circle"></i> </button>  
                        </div>
                        <div class="card-body">${Tasks[index]._title}</div> 
                        <div class="card-footer">${Tasks[index]._date}<br>${Tasks[index]._time}</div>
                    </div>`;

        output += "</div>";

    }

    document.getElementById("Display").innerHTML = output;

}

// Local Storage Functions ----------------------------------------------------------------------------- 

function getTasksFromLocalStorage() {
    tasksJSON = localStorage.getItem("savedTasks") == null ? JSON.stringify([]) : localStorage.getItem("savedTasks");
    Tasks = JSON.parse(tasksJSON);
}

function setTasksToLocalStorage() {
    tasksJSON = JSON.stringify(Tasks);
    localStorage.setItem("savedTasks", tasksJSON);
}

function getLanguageFromLocalStorage() {
    tasksJSON = localStorage.getItem("taskBoardLanguage") == null ? JSON.stringify([]) : localStorage.getItem("taskBoardLanguage");
    return JSON.parse(tasksJSON)
}

function setLanguageToLocalStorage(language) {
    jsonToSave = JSON.stringify(language);
    localStorage.setItem("taskBoardLanguage", jsonToSave);
}


// Date and Time Functions -----------------------------------------------------------------------------

function insertDefaultDate() {

    let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    let day = pad(tomorrow.getDate(), 2);
    let month = pad(tomorrow.getMonth() + 1, 2);
    let year = pad(tomorrow.getFullYear(), 4);

    taskDate.value = `${year}-${month}-${day}`;
}

function insertDefaultTime() {

    let time = new Date();

    let hour = pad(time.getHours(), 2);
    let minutes = pad(time.getMinutes(), 2);
    taskTime.value = `${hour}:${minutes}`;
}

// Add zeros to the date / time
function pad(str, max) {
    str = str.toString();
    // A recursion that adds zeros as needed
    return str.length < max ? pad("0" + str, max) : str;
}

// End ------------------------------------------------------------------------------------------------- 


// Localization ----------------------------------------------------------------------------------------
function initLanguage() {
    const LanguageFromLocalStorage = getLanguageFromLocalStorage();
    LanguageFromLocalStorage.length ? document.getElementById("htmlLanguage").value = LanguageFromLocalStorage : document.getElementById("htmlLanguage").value = "English";
    changeLanguage()
}

function changeLanguage() {

    const len = document.getElementById("htmlLanguage").value

    document.querySelectorAll('.myTaskBoard').forEach((element) => {
        element.innerText = dictionary[len]['myTaskBoard']
    });

    document.getElementById("chooseLanguage").innerText = dictionary[len]['chooseLanguage']
    document.getElementById("backToAvshalomsProjects").innerText = dictionary[len]['backToAvshalomsProjects']
    document.getElementById("myTaskTitle").setAttribute("placeholder", `${dictionary[len]['taskTitle']}`)
    document.getElementById("addTaskBtn").innerText = dictionary[len]['addTaskBtn']
    document.getElementById("resetTaskBtn").innerText = dictionary[len]['resetTaskBtn']

    setLanguageToLocalStorage(len)

}

const dictionary = {
    Hebrew: {
        myTaskBoard: "לוח המשימות שלי",
        chooseLanguage: "בחר שפה",
        backToAvshalomsProjects: "חזור לפרוייקטים של אבשלום",
        taskTitle: "תיאור המשימה",
        addTaskBtn: "הוסף משימה",
        resetTaskBtn: "אפס משימה"
    },
    English: {
        myTaskBoard: "My Task Board",
        chooseLanguage: "Choose a language:",
        backToAvshalomsProjects: "Back to Avshaloms projects",
        taskTitle: "Task title",
        addTaskBtn: "Add Task",
        resetTaskBtn: "Reset Task"
    }
}
