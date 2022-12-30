// This script handles search bar functionality
$(document).ready(function() {
  let timeoutID = null;

  const searchTodos = function(string) {
    const data = {search: string};
    $.get("/api/todos", data,
      function(data) {
        $("#todos-container").empty().show("slow");
        renderTodos(data.todos);
      }
    );
  };

  $('#searchBox').keyup(function() {
    clearTimeout(timeoutID);
    const value = $(this).val();
    timeoutID = setTimeout(() => searchTodos(value), 500);
  });

});
