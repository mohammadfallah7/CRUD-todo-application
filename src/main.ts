import "bootstrap/dist/css/bootstrap.css";

type Task = {
  id: number;
  text: string;
};
const storage = localStorage.getItem("tasks");
let tasks: Task[] = storage ? JSON.parse(storage) : [];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <h1 class="display-6 mt-3 mb-4">To-Do Application</h1>

    <input id="task-text" type="text" placeholder="write your task..." class="form-control mb-3" />
    <button id="submit-btn" class="btn btn-primary mb-3">Submit</button>

    <ul id="task-list" class="list-group mt-4"></ul>
  </div>
`;

const text = document.getElementById("task-text") as HTMLInputElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;

const readTask = (tasks: Task[]) => {
  taskList.innerHTML = tasks
    .map((task) => {
      return `
        <li data-id="${task.id}" data-text="${task.text}" class="list-group-item d-flex justify-content-between align-items-center">
          ${task.text}
          <div>
            <button class="btn btn-sm btn-outline-primary mx-2 edit-btn">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");

  localStorage.setItem("tasks", JSON.stringify(tasks));

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskId = (event.target as HTMLElement)
        .closest("li")
        ?.getAttribute("data-id");
      const taskText = (event.target as HTMLElement)
        .closest("li")
        ?.getAttribute("data-text");

      if (taskId && taskText) {
        editTask({ id: parseInt(taskId), text: taskText }, text.value);
      }
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskId = (event.target as HTMLElement)
        .closest("li")
        ?.getAttribute("data-id");

      if (taskId) {
        deleteTask(parseInt(taskId));
      }
    });
  });
};

const createTask = () => {
  if (text.value) {
    tasks = [{ id: Date.now(), text: text.value }, ...tasks];
    readTask(tasks);
    text.value = "";
  } else {
    console.log("Input is empty!");
  }
};

const deleteTask = (id: number) => {
  tasks = tasks.filter((task) => task.id !== id);
  readTask(tasks);
};

const editTask = (task: Task, updatedText: string) => {
  if (text.value) {
    tasks = tasks.map((el) =>
      el.id === task.id ? { ...el, text: updatedText } : el
    );
    readTask(tasks);
    text.value = "";
  } else {
    console.log("Input is empty!");
  }
};

readTask(tasks);

submitBtn.addEventListener("click", () => {
  createTask();
});
