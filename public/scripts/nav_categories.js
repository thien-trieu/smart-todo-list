// This script handles the category sorting nav bar selections
$(document).ready(function() {

  $('#nav-categories').click(function(e) {
    const categoryName = e.target.id;
    const childClass = $(e.target).attr('class');

    if (categoryName === 'nav-categories') return;

    const upperCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
    const actionLabel = categoryName !== 'inbox' ? 'To' : '';

    $(".todo-nav-left").html(
      `<i class="${childClass}"></i>
      <span> ${actionLabel} ${upperCategoryName}</span>`
    );


    $(".todo-nav-mobileview").html(
      `<i class="${childClass}"></i>
      <span> ${actionLabel} ${upperCategoryName}</span>`
    );

    let data;

    if (categoryName !== 'inbox') {
      data = {
        categoryName
      };
    }

    $.get("/api/todos", data,
      function(data) {
        console.log('DATA', data);
        $("#todos-container").empty().show("slow");
        renderTodos(data.todos);
      }
    );

  });

});
