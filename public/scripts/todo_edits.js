$(document).ready(function() {

  let originalText;
  let todoId;
  let todoClass;
  let category_name;


  window.todoEdits = function() {

    // Captures the element that user wants to EDIT. TODO: text, completion status(circle check mark) or category(dropdown)
    $('.memo-text, .todo-status').click(function() {

      todoClass = $(this).attr("class");
      todoId = $(this).closest('article').attr("id");

      // edits completion status
      if (todoClass === 'todo-status') {
        todoClass = $(this).children().attr("class");
        updateTodoStatus($(this));
      }

      // the selected category in drop down to edit
      if (todoClass === 'categories-dropdown') {
        todoClass = $(this).children().attr("class");
      }

      // oringal TEXT of TODO item that user wants to edit
      originalText = $(this).text();
    });

    // Update TODO item category via dropdown menu
    $('.categories-dropdown').change(function() {
      const value = $(this).val();
      todoId = $(this).closest('article').attr("id");

      // updates the category name and sends update to the database
      updateDatabase(value, 'category_name');
    });

    // Hides/unhides the input area in the TODO item memo field, user can update memo details here.
    $('.clickedit').hide().keyup(function(e) {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {

        // Edits the TODO item's orginal text to the new input that user enters
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


      submitEditForm();
    });

  };

  const submitEditForm = function() {
    $(".edit-form").submit(function(e) {
      e.preventDefault();

      const memo_details = $("#newMemo").val().trim();
      const todoId = $(this).attr('id');

      category_name = $(this).find(":selected").val();

      // check we got NEW edit details to submit
      console.log(
        `NEW EDIT DETAILS to submit
              The new memo_details for TODO item is: ${memo_details}.
              The new category is: ${category_name}.
              The TODO ID# is: ${todoId}`
      );

      if (!memo_details) return;

      const data = {
        memo_details,
        category_name,
        todoId
      };

      // Hide the edit form after submit button is clicked
      $('#editForm').hide();

      // LOADING spinner
      $('.spinner').show();

      $.post("/api/todos/update", data,
        function(data) {

          // Confirm we got the updated data back from the database
          console.log('Got this back from the DATABASE: ', data);

          // Update the specific TODO item's article with the edits
          todoArticleUpdate(data);

        }
      );
    });

  };

  // Update the specific TODO item's article with the edits
  const todoArticleUpdate = function(data) {

    // Grabbing the specific TODO article's by TODO id #
    const $todoitem = $(`#${data.id}`);

    // Update memo details with EDIT details
    $todoitem.find('label').text(data.memo_details).show();

    // Update drop down with EDIT details
    $todoitem.find('select')
      .html(createCategoryDropdown(
        {
          categoryId: data.category_id,
          categoryName: category_name
        }
      ));

    // Done loading, hide spinner.
    $('.spinner').hide();
  };

  // Close edit form if user clicks 'X' or outside the edit form
  const closeEditform = () => {

    // close if user clicks onto document, away from the EDIT form
    $(document).mouseup(function(e) {
      const container = $("#editForm");

      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });

    // close if user clicks the 'X'
    $('.fa-xmark').click(function() {
      console.log('clicked!');
      $('#editForm').hide();
    });
  };

  // HTML for Edit Form when the 'PENCIL' icon is clicked
  const createEditForm = (todo) => {
    let $editForm = `
      <form id="${todo.todoId}" class="edit-form">
          <div class="edit-form-header">
            <label class="edit-header"> Update Smart To-Do Task </label>
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="edit-form-main">
            <div class="edit-todo-memo">
              <label class="edit-title">Title: </label>
              <input id="newMemo" class="clickedit" type="text" value="${todo.memo}"/>
            </div>
            <div class="edit-todo-category">
              <label class="edit-category">Category: </label>
              <select name="" class="categories-dropdown" id="dropmenu">
              ${createCategoryDropdown(todo)}
              </select>
            </div>
            <button type="submit" class="edit-save">Save</button>
          </div>
        </form>
      `;

    return $editForm;
  };

  // Edits completion status when user clicks on 'CIRCLE' icon to add a check mark to update as completed.
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

  // Edits the TODO item's orginal text to the new input that user enters
  const updateMemoDetails = function(e) {
    const input = $(e.target);
    const label = input && input.prev();
    const value = input.val();

    label.text(value === '' ? originalText : value);
    input.hide();
    label.show();

    // Sends update to the database
    updateDatabase(value, 'memo_details');
  };

  // Receives value that user wants to update and sends that value to database to update.
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
