/**
 * Fetches Todos from the server using jQuery and AJAX.
 * Loads and render the Todos into the page.
 */

$(document).ready(function() {

  window.renderTodos = function(todos) {
    for (const index in todos) {
      const id = todos[index].id;
      const status = todos[index].completion_status;
      const memo = todos[index].memo_details;
      const categoryName = todos[index].category_name;
      const todo = {
        id,
        status,
        memo,
        categoryName
      };
      const todoElement = createTodo(todo);
      $("#todos-container").prepend(todoElement);
    }

    // $('.todo-id').hide();
    todoEdits();
  };

  const createTodo = function(todo) {
    const complete = `<i class="fa-regular fa-circle"></i>`;
    const pending = `<i class="fa-regular fa-circle-check"></i>`;
    const status = todo.status ? pending : complete;

    let $todo = `
    <article id="${todo.id}" class="todo">
      <div class="left-side">
        <div class="todo-status">
          ${ status }
        </div>
        <div class="todo-memo">
          <label class="memo-text">${ todo.memo }</label>
          <input class="clickedit" type="text" />
        </div>
      </div>
      <div class="right-side">
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
