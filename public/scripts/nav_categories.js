$(document).ready(function() {

  $('#nav-categories').click(function(e) {
    const categoryName = e.target.id;
    const childClass = $(e.target).attr('class');

    const categoriesId = {
      'to-watch': 1,
      'to-eat': 2,
      'to-read': 3,
      'to-buy': 4
    };

    const data = {
      categoryId: categoriesId[categoryName]
    };

    $(".todo-view-nav-left").html(
      `<i class="${childClass}"></i>
       <p>${categoryName}</p>
      `
    );

    $.get("/api/todos", data,
      function(data) {
        console.log('DATA', data);
        $("#todos-container").empty().show("slow");
        renderTodos(data.todos);
      }
    );

  });

});
