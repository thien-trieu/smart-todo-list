$(document).ready(function() {

  let originalText;
  let todoId;
  let todoClass;

  //
  window.todoEdits = function() {
    $('.memo-text, .todo-status').click(function() {

      todoClass = $(this).attr("class");
      todoId = $(this).closest('article').attr("id");
      if (todoClass === 'todo-status') {
        todoClass = $(this).children().attr("class");
        updateTodoStatus($(this));
      }

      if (todoClass === 'categories-dropdown') {
        todoClass = $(this).children().attr("class");
      }

      originalText = $(this).text();
    });

    $('.categories-dropdown').change(function() {
      const value = $(this).val();
      todoId = $(this).closest('article').attr("id");
      updateDatabase(value, 'category_name');
    });

    // Hides and unhides the input field in the todo element
    $('.clickedit').hide().keyup(function(e) {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        updateMemoDetails(e);
        return false;
      } else {
        return true;
      }
    })
      .prev().click(function() {
        $(this).hide();
        $(this).next().attr("value", originalText).show().focus();
      });

    // Deletes the todo once the delete icons is clicked on
    $('.fa-trash-can').click(function() {
      todoId = $(this).closest('article').attr("id");
      $.post('/api/todos/delete', {todoId});
      $(this).closest('article').remove();
    });

    $('.fa-pen').click(function() {
      const $todoItem = $(this).closest('article');
      const memo = $(this).parent().parent().prev().find('.memo-text');

      console.log('MEMO', memo);
      todoId = $todoItem.attr("id");
      todoClass = $(this).attr("class");

      const todo = {
        id: todoId,
        todoClass
      };

      $('#editForm').show();
      $('#editForm').html(createEditForm(todo));

    });
  };

  const createEditForm = (todo)=> {
    let $editForm = `
      <form id="${todo.id}" class="edit-form">
          <div class="edit-form-header">
            <label> Update Todo Item</label>
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="edit-form-main">
            <div class="todo-memo class">
              <label class="memo-text">Title</label>
              <input class="clickedit" type="text" value="categoryName"/>
            </div>
            <div class="todo-category">
              <label class="memo-text">Category</label>
              <select name="" class="categories-dropdown">
                <option catid="catId" value="categoryName" selected>categoryName</option>
                <option value="watch">watch</option>
                <option value="eat">eat</option>
                <option value="read">read</option>
                <option value="buy">buy</option>
              </select>
            </div>
            <button type="submit">Save</button>
          </div>
        </form>
      `;

    return $editForm;
  };

  const updateTodoStatus = function($this) {
    console.log('this', $this.children());
    const dbColumn = 'completion_status';
    let status;
    // if (todoClass === 'fa-regular fa-circle') status = true;
    if (todoClass === 'fa-regular fa-circle') {
      status = true;
      $this.children().removeClass('fa-circle').addClass('fa-circle-check');
      $this.next().addClass('completed-todo');
    }

    if (todoClass === 'fa-regular fa-circle-check') {
      status = false;
      $this.children().removeClass('fa-circle-check').addClass('fa-circle');
      $this.next().removeClass('completed-todo');
    }

    updateDatabase(status, dbColumn);
  };

  const updateMemoDetails = function(e) {
    const input = $(e.target);
    const label = input && input.prev();
    const value = input.val();

    label.text(value === '' ? originalText : value);
    input.hide();
    label.show();

    updateDatabase(value, 'memo_details');
  };

  const updateDatabase = function(value, dbColumn) {
    if (todoClass === 'todo-category') dbColumn = 'categories.name';
    const data = {
      [dbColumn]: value,
      todoId,
    };

    $.post('/api/todos/update', data,
      function(data) {
        console.log('Got this back:', data);
      }
    );
  };
});
