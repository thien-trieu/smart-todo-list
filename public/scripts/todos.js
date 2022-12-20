/**
 * Fetches Todos from the server using jQuery and AJAX.
 * Loads and render the Todos into the page.
 */

$(document).ready(function() {

  window.renderTodos = function(todos) {
    for (const index in todos) {
      const status = todos[index].completion_status;
      const memo = todos[index].memo_details;
      const categoryName = todos[index].category_name;
      const todo = {
        status,
        memo,
        categoryName
      };
      const todoElement = createTodo(todo);
      $("#todos-container").prepend(todoElement);
    }
  };

  const createTodo = function(todo) {
    const complete = `<i class="fa-regular fa-circle"></i>`;
    const pending = `<i class="fa-regular fa-circle-check"></i>`;
    const status = todo.status ? pending : complete;

    let $todo = `
    <article class="todo">
      <div class="todo-status">
      ${ status }
      </div>
      <div class="todo-memo">${ todo.memo }</div>
      <div class="todo-category">
      <select name="" id="categories-dropdown">
        <option value="" selected>${todo.categoryName}</option>
        <option value="1">to watch</option>
        <option value="2">to eat</option>
        <option value="3">to read</option>
        <option value="4">to buy</option>
      </select>
    </div>
    <div class="todo-options">
      <i class="fa-solid fa-pen"></i>
      <i class="fa-solid fa-trash-can"></i>
      <!-- <i class="fa-solid fa-ellipsis"></i> -->
    </div>
    </article>
  `;
    return $todo;
  };

  $("#todo-form").submit(function(e) {
    e.preventDefault();
    const memo = $("#newTodo").val().trim();

    if (!memo) return;

    const data = $("#todo-form").serialize();

    $.post("/api/todos", data,
      function(data) {
        console.log(data)
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
