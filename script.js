document.addEventListener("DOMContentLoaded", () => {
  //Grabbing elements
  let addTaskButton = document.getElementById("addTaskButton");
  let taskInput = document.getElementById("taskInput");
  let taskList = document.getElementById("taskList");
  

  //fetching tasks from local storage and rendering them on DOM
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    renderTasks(task);
  });

  //Grabbing task input upon the user clicking the add button
  addTaskButton.addEventListener("click", () => {
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    let selectedPriority = document.querySelector(
    'input[name="priority"]:checked'
  ).id;

    const newTaskObj = {
      id: Date.now(),
      text: taskText,
      completed: false,
      priority: selectedPriority,
    };

    tasks.push(newTaskObj);
    saveTask();
    setTimeout(
      document.querySelectorAll('input[name="priority"]').forEach((radio) => {
        radio.checked = false;
      }),
      1000
    );
    taskInput.value = "";
    renderTasks(newTaskObj);
  });

  function renderTasks(task) {
    let newTask = document.createElement("li");
    newTask.setAttribute("data-id", task.id);
    if (task.completed) newTask.classList.add("completed", "flex");
    newTask.className =
      "task relative w-[100%] hover:bg-slate-900 duration-300 cursor-pointer bg-slate-900 ml-0 rounded-lg p-3 mb-2 h-max flex justify-between";

    //Task text element
    let taskTextSpan = document.createElement("span");
    taskTextSpan.innerText = task.text;

    // Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className =
      "bg-slate-600 p-1 h-7 cursor-pointer rounded-lg justify-self-end hover:text-white hover:bg-slate-900 border-2 border-slate-500";

    //strip creation
    let strip = document.createElement("span");

    //strip color selection
    if (task.priority === "high") {
      strip.classList.add("bg-red-500");
    }
    if (task.priority === "medium") {
      strip.classList.add("bg-amber-500");
    } else {
      strip.classList.add("bg-green-500");
    }

    //strip structuring
    strip.classList.add(
      "absolute",
      "rounded-l-lg",
      "left-0",
      "top-0",
      "h-full",
      "w-3",
      "duration-500"
    );

    // Append order matters
    setTimeout(() => {
      newTask.appendChild(strip);
      newTask.appendChild(taskTextSpan);
      newTask.appendChild(deleteButton);
      taskList.appendChild(newTask);
    }, 50);

    //Strip hover animation
    newTask.addEventListener("mouseover", () => {
      strip.classList.replace("left-0", "right-0");
      strip.classList.replace("rounded-l-lg", "rounded-r-lg");
      strip.classList.replace("w-3", "w-2");
      strip.classList.add("transition-all", "duration-300", "ease-in-out");
    });
    newTask.addEventListener("mouseout", () => {
      strip.classList.replace("right-0", "left-0");
      strip.classList.replace("rounded-r-lg", "rounded-l-lg");
      strip.classList.replace("w-2", "w-3");
    });

    // Completion toggle
    newTask.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      saveTask();
    });

    // Delete
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      // newTask.classList.add("bg-slate-100");
      setTimeout(() => {
        newTask.remove();
      }, 50);

      saveTask();
    });
  }

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    tasks = tasks.filter((t) => t.id !== task.id);
    newTask.remove();
    saveTask();
  });

  function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
