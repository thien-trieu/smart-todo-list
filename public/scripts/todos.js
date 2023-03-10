/**
 * Fetches Todos from the server using jQuery and AJAX.
 * Loads and render the Todos into the page.
 */

$(document).ready(function() {

  window.renderTodos = function(todos) {
    $('.spinner').hide();
    for (const index in todos) {
      const id = todos[index].id;
      const status = todos[index].completion_status;
      const memo = todos[index].memo_details;
      const categoryName = todos[index].category_name;
      const categoryId = todos[index].category_id;
      const todo = {
        id,
        status,
        memo,
        categoryName,
        categoryId
      };
      const todoElement = createTodo(todo);
      $("#todos-container").prepend(todoElement);
    }
    todoEdits();
  };

  const createTodo = function(todo) {
    const complete = `<i class="fa-regular fa-circle"></i>`;
    const pending = `<i class="fa-regular fa-circle-check"></i>`;
    const status = todo.status ? pending : complete;
    const statusClass = todo.status ? 'completed-todo' : '';

    let $todo = `
    <article id="${todo.id}" class="todo">
      <div class="left-side">
        <div class="todo-status">
          ${ status }
        </div>
        <div class="todo-memo">
          <label class="memo-text ${statusClass}">${ todo.memo }</label>
          <input class="clickedit" type="text" />
        </div>
      </div>
      <div class="right-side">
        <div class="todo-category">
          <select name="" class="categories-dropdown">
            ${createCategoryDropdown(todo)}
          </select>
        </div>
        <div class="todo-options">
          <i class="fa-solid fa-pen"></i>
          <i class="fa-solid fa-trash-can"></i>
          <!-- <i class="fa-solid fa-ellipsis"></i> -->
        </div>
      </div>
    </article>
  `;
    return $todo;
  };

  window.createCategoryDropdown = (todo) => {
    const categories = ['watch', 'eat', 'read', 'buy'];
    let dropdowns = `<option catid="${todo.categoryId}" value="${todo.categoryName}" selected>${todo.categoryName}</option>`;
    categories.forEach(category => {
      if (category !== todo.categoryName) {
        dropdowns += `<option value="${category}">${category}</option>`;
      }
    });
    return dropdowns;
  };

  $("#todo-form").submit(function(e) {
    e.preventDefault();
    const memo = $("#newTodo").val().trim();

    if (!memo) return;

    const data = $("#todo-form").serialize();
    $('.spinner').show();
    $.post("/api/todos", data,
      function(data) {
        console.log(data);
        $("#newTodo").val('');
        renderTodos([data]);
      }
    );
  });

  const loadTodos = function() {
    $.get("/api/todos", function(data) {
      renderTodos(data.todos);
    }
    );
  };

  loadTodos();

});
