/**
 * Fetches Todos from the server using jQuery and AJAX.
 * Loads and render the Todos into the page.
 */

$(document).ready(function() {
  const renderTodos = function(todos) {
    // const sortedData = Todos.sort((a, b) => b.created_at - a.created_at);
    // $("#todos-container").empty().show("slow");
    console.log('LOADED TODOS:', todos);

    for (const index in todos) {
      const status = todos[index].completion_status;
      const memo = todos[index].memo_details;
      const todo = {
        status,
        memo
      };

      const todoElement = createTodo(todo);
      $("#todos-container").append(todoElement);
    }
  };

  const createTodo = function(todo) {
    console.log('TODO:', todo);
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
    console.log('Values:', $("#new-item").val().trim());
    const memo = $("#new-item").val().trim();

    if (!memo) {
      $(".form-msg-box").slideDown();
      $(".error-msg").text("A blank tweet? Let's try that again by adding some text.");
      return;
    }

    $.ajax({
      url: "/api/todos",
      type: "post",
      data: $("#todo-form").serialize(),
    })
      .done(function() {
        $("#new-item").val('');
        loadTodos();
      });
  });

  $("#form").submit(function(event) {
    event.preventDefault();
    const text = $("#tweet-text").val().trim();

    if (!text) {
      $(".form-msg-box").slideDown();
      $(".error-msg").text("A blank tweet? Let's try that again by adding some text.");
      return;
    }

    if (text.length > 140) {
      $(".form-msg-box").slideDown();
      $(".error-msg").text("Text must be less than or equal to 140 characters.");
      return;
    }

    $.ajax({
      url: "/Todos",
      type: "post",
      data: $("#form").serialize(),
    })
      .done(function() {
        $("#tweet-text").val("");
        $(".counter").text("140");
        loadTodos();
      });
  });

  const loadTodos = function() {
    $.ajax("/api/todos", { method: "GET" })
      .then(function(data) {
        renderTodos(data.todos);
      });
  };

  loadTodos();

});
