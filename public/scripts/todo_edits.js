$(document).ready(function() {

  window.todoEdits = function() {
    let originalText;
    let todoId;
    let todoClass;

    $('.memo-text, .todo-status').click(function() {

      todoClass = $(this).attr("class");
      todoId = $(this).closest('article').attr("id");
      console.log(todoClass);

      if (todoClass === 'todo-status') {
        todoClass = $(this).children().attr("class");
        updateTodoStatus();
      }

      originalText = $(this).text();

    });

    const updateTodoStatus = function() {
      const dbColumn = 'completion_status';
      let status = false;
      console.log(todoClass);
      if (todoClass === 'fa-regular fa-circle') status = true;

      updateDatabase(status, dbColumn);

    };

    const updateMemoDetails = function(e) {
      let input = $(e.target),
        label = input && input.prev();

      const value = input.val();
      console.log('New Value', value);

      label.text(value === '' ? originalText : value);
      input.hide();
      label.show();

      updateDatabase(value, 'memo_details');
    };

    const updateDatabase = function(value, dbColumn) {

      if (todoClass === 'todo-category') dbColumn = 'categories.name';

      console.log('DB COLUMN', dbColumn);

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




    // Hides and unhides the
    $('.clickedit').hide()
      // .focusout(updateMemoDetails)
      .keyup(function(e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
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

    $('.fa-trash-can').click(function() {
      todoId = $(this).closest('article').attr("id");
     
      $.post('/api/todos/delete', {todoId});
      console.log(todoId)

    });
    };






    // $('.fa-trash-can').on('click', () => {
    //   console.log($('.fa-trash-can'));
    //   const values = {
    //     todoId: 1
    //   }
    //   console.log('TODO ID', values)
    //   $.post('/api/todos/delete', values,
    //     function(data) {
    //       console.log('Got this back!!!!!!!', data);
    //     }
    //   );
    // });


});
