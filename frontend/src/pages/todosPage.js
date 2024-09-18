export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-start",
    "h-screen",
    "bg-gray-200"
  );

  // Botón de Inicio
  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-purple-500", // Color cambiado
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-purple-600", // Color al hacer hover
    "mb-4"
  );
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  // Título
  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "Lista de Tareas";

  // Contenedor para la tabla y el botón de "Agregar Tarea"
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("flex", "gap-4", "items-start", "w-full", "justify-center"); // Para alinear en fila

  // Tabla
  const table = document.createElement("table");
  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";
  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Título";
  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completada";
  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "ID del Propietario";
  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2");
  th5.textContent = "Acciones";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);

  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Botón para mostrar el formulario de creación
  const btnCreate = document.createElement("button");
  btnCreate.classList.add(
    "bg-indigo-500", // Color cambiado
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-indigo-600", // Color al hacer hover
    "mb-4"
  );
  btnCreate.textContent = "Crear Tarea";

  // Añadir tabla y botón de "Crear Tarea" en el mismo contenedor
  tableContainer.appendChild(table);
  tableContainer.appendChild(btnCreate);

  container.appendChild(btnHome);
  container.appendChild(title);
  container.appendChild(tableContainer); // Añadir contenedor con la tabla y el botón

  // Formulario de creación y edición de tarea
  const taskForm = document.createElement("form");
  taskForm.classList.add("mb-4", "hidden");

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Título de la tarea";
  titleInput.classList.add("border", "p-2", "mb-2", "w-full");

  const completedInput = document.createElement("input");
  completedInput.type = "checkbox";
  completedInput.classList.add("mb-2");

  const completedLabel = document.createElement("label");
  completedLabel.textContent = "¿Completada?";
  completedLabel.classList.add("ml-2");

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add(
    "bg-teal-500", // Color cambiado
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-teal-600"
  );
  submitButton.textContent = "Agregar Tarea";

  taskForm.appendChild(titleInput);
  taskForm.appendChild(completedInput);
  taskForm.appendChild(completedLabel);
  taskForm.appendChild(submitButton);

  container.appendChild(taskForm);

  // Variable para almacenar el ID de la tarea a editar
  let editingTaskId = null;

  // Mostrar el formulario al hacer clic en el botón "Crear Tarea"
  btnCreate.addEventListener("click", () => {
    editingTaskId = null;
    titleInput.value = "";
    completedInput.checked = false;
    submitButton.textContent = "Agregar Tarea";
    taskForm.classList.remove("hidden");
  });

  // Enviar el formulario al backend
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value;
    const completed = completedInput.checked;

    if (editingTaskId) {
      // Actualizar tarea existente
      fetch(`http://localhost:4000/todos/${editingTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, completed }),
      })
        .then((response) => response.json())
        .then((data) => {
          const row = document.querySelector(`tr[data-id="${editingTaskId}"]`);

          if (row) {
            const tdTitle = row.querySelector("td:nth-child(2)");
            const tdCompleted = row.querySelector("td:nth-child(3)");

            // Actualiza los valores
            tdTitle.textContent = data.todo.title;
            tdCompleted.textContent = data.todo.completed ? "Sí" : "No";

            // Limpiar el formulario
            titleInput.value = "";
            completedInput.checked = false;

            // Ocultar el formulario
            taskForm.classList.add("hidden");

            alert("Tarea actualizada con éxito");
          }
        })
        .catch((error) => {
          console.error("Error al actualizar la tarea:", error);
          alert("Error al actualizar la tarea");
        });
    } else {
      // Crear nueva tarea
      fetch("http://localhost:4000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, completed }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.todo) {
            // Agregar la nueva tarea a la tabla sin recargar la página
            const tr = document.createElement("tr");
            tr.setAttribute("data-id", data.todo.id);

            const td1 = document.createElement("td");
            td1.classList.add("border", "px-4", "py-2");
            td1.textContent = data.todo.id;

            const td2 = document.createElement("td");
            td2.classList.add("border", "px-4", "py-2");
            td2.textContent = data.todo.title;

            const td3 = document.createElement("td");
            td3.classList.add("border", "px-4", "py-2");
            td3.textContent = data.todo.completed ? "Sí" : "No";

            const td4 = document.createElement("td");
            td4.classList.add("border", "px-4", "py-2");
            td4.textContent = data.todo.owner;

            const td5 = document.createElement("td");
            td5.classList.add("border", "px-4", "py-2");

            // Botón de eliminar
            const btnDelete = document.createElement("button");
            btnDelete.classList.add(
              "bg-red-500",
              "text-white",
              "p-2",
              "rounded",
              "hover:bg-red-600"
            );
            btnDelete.textContent = "Eliminar";

            btnDelete.addEventListener("click", () => {
              fetch(`http://localhost:4000/todos/${data.todo.id}`, {
                method: "DELETE",
                credentials: "include",
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.message === "Tarea eliminada con éxito") {
                    tr.remove(); // Eliminar la fila de la tabla
                    alert("Tarea eliminada con éxito");
                  } else {
                    alert("Error al eliminar la tarea");
                  }
                })
                .catch((error) => {
                  console.error("Error al eliminar la tarea:", error);
                  alert("Error al eliminar la tarea");
                });
            });

            // Botón de editar
            const btnEdit = document.createElement("button");
            btnEdit.classList.add(
              "bg-yellow-500",
              "text-white",
              "p-2",
              "rounded",
              "hover:bg-yellow-600",
              "ml-2"
            );
            btnEdit.textContent = "Editar";

            btnEdit.addEventListener("click", () => {
              editingTaskId = data.todo.id;
              titleInput.value = data.todo.title;
              completedInput.checked = data.todo.completed;
              submitButton.textContent = "Guardar Cambios";
              taskForm.classList.remove("hidden");
            });

            td5.appendChild(btnEdit);
            td5.appendChild(btnDelete);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);

            tbody.appendChild(tr);

            // Limpiar el formulario
            titleInput.value = "";
            completedInput.checked = false;

            // Ocultar el formulario
            taskForm.classList.add("hidden");

            alert("Tarea agregada con éxito");
          }
        })
        .catch((error) => {
          console.error("Error al agregar la tarea:", error);
          alert("Error al agregar la tarea");
        });
    }
  });

  // Cargar las tareas existentes al cargar la página
  fetch("http://localhost:4000/todos", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.todos) {
        data.todos.forEach((todo) => {
          const tr = document.createElement("tr");
          tr.setAttribute("data-id", todo.id);

          const td1 = document.createElement("td");
          td1.classList.add("border", "px-4", "py-2");
          td1.textContent = todo.id;

          const td2 = document.createElement("td");
          td2.classList.add("border", "px-4", "py-2");
          td2.textContent = todo.title;

          const td3 = document.createElement("td");
          td3.classList.add("border", "px-4", "py-2");
          td3.textContent = todo.completed ? "Sí" : "No";

          const td4 = document.createElement("td");
          td4.classList.add("border", "px-4", "py-2");
          td4.textContent = todo.owner;

          const td5 = document.createElement("td");
          td5.classList.add("border", "px-4", "py-2");

          // Botón de eliminar
          const btnDelete = document.createElement("button");
          btnDelete.classList.add(
            "bg-red-500",
            "text-white",
            "p-2",
            "rounded",
            "hover:bg-red-600"
          );
          btnDelete.textContent = "Eliminar";

          btnDelete.addEventListener("click", () => {
            fetch(`http://localhost:4000/todos/${todo.id}`, {
              method: "DELETE",
              credentials: "include",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.message === "Tarea eliminada con éxito") {
                  tr.remove(); // Eliminar la fila de la tabla
                  alert("Tarea eliminada con éxito");
                } else {
                  alert("Error al eliminar la tarea");
                }
              })
              .catch((error) => {
                console.error("Error al eliminar la tarea:", error);
                alert("Error al eliminar la tarea");
              });
          });

          // Botón de editar
          const btnEdit = document.createElement("button");
          btnEdit.classList.add(
            "bg-yellow-500",
            "text-white",
            "p-2",
            "rounded",
            "hover:bg-yellow-600",
            "ml-2"
          );
          btnEdit.textContent = "Editar";

          btnEdit.addEventListener("click", () => {
            editingTaskId = todo.id;
            titleInput.value = todo.title;
            completedInput.checked = todo.completed;
            submitButton.textContent = "Guardar Cambios";
            taskForm.classList.remove("hidden");
          });

          td5.appendChild(btnEdit);
          td5.appendChild(btnDelete);

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);

          tbody.appendChild(tr);
        });
      }
    })
    .catch((error) => {
      console.error("Error al cargar las tareas:", error);
    });

  return container;
};
