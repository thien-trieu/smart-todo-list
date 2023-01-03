$(document).ready(function() {

  let originalText;
  let todoId;
  let todoClass;
  let category_name;


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
      $.post('/api/todos/delete', { todoId });
      $(this).closest('article').remove();
    });

    // When the 'PENCIL' icon is clicked, show TODO edit form
    $('.fa-pen').click(function(e) {

      const $todoItem = $(this).closest('article');
      const memo = $todoItem.find('.memo-text').text();
      const categoryName = $todoItem.find(":selected").val();
      const categoryId = $todoItem.find('option').attr('catid');

      todoId = $todoItem.attr("id");
      todoClass = $(this).attr("class");

      // check we got the correct TODO item to edit.
      console.log(
        `Pencil clicked to edit this MEMO: ${memo}.
      The current category for this is ${categoryName}.
      The category ID# is ${categoryId}`
      );


      const currentTodo = {
        memo,
        todoId,
        todoClass,
        categoryName,
        categoryId
      };

      console.log('Details of the current TODO item you want to edit: ', currentTodo);

      // Show the edit form after the 'Pencil' icon is clicked and update the html in the Editform to match current TODO details
      $('#editForm').show().html(createEditForm(currentTodo));

      // Close edit form if user clicks 'X' or outside the edit form
      closeEditform();

      //
      submitEditForm();
    });

  };

  const submitEditForm = function() {
    $(".edit-form").submit(function(e) {
      e.preventDefault();

      const memo_details = $("#newMemo").val().trim();
      const todoId = $(this).attr('id');

      category_name = $(this).find(":selected").val();

      // check we got new edit details to submit
      console.log(
        `NEW EDIT DETAILS to submit
              The new memo_details for TODO item is: ${memo_details}.
              The new category is ${category_name}.
              The TODO ID# is ${todoId}`
      );


      if (!memo_details) return;

      const data = {
        memo_details,
        category_name,
        todoId
      };


      $('#editForm').hide();
      console.log('DATA', data);

      $('.spinner').show();
      $.post("/api/todos/update", data,
        function(data) {
          console.log('Data back', data);
          console.log('Category Name back?', data.category_name);

          formUpdate(data);

        }
      );
    });

  };


  const formUpdate = function(data) {

    const $todoitem = $(`#${data.id}`);

    $todoitem.find('label').text(data.memo_details).show();
    $todoitem.find('select').html(createCategoryDropdown(
      {
        categoryId: data.category_id,
        categoryName: category_name
      }
    ));


    $('.spinner').hide();
  };

  const closeEditform = () => {
    $(document).mouseup(function(e) {
      const container = $("#editForm");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
    $('.fa-xmark').click(function() {
      console.log('clicked!');
      $('#editForm').hide();
    });
  };

  const createEditForm = (todo) => {
    let $editForm = `
      <form id="${todo.todoId}" class="edit-form">
          <div class="edit-form-header">
            <label> Update Todo Item</label>
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="edit-form-main">
            <div class="todo-memo">
              <label class="memo-text">Title</label>
              <input id="newMemo" class="clickedit" type="text" value="${todo.memo}"/>
            </div>
            <div class="todo-category">
              <label class="memo-text">Category</label>
              <select name="" class="categories-dropdown">
              ${createCategoryDropdown(todo)}
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
