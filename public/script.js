$(document).ready(async function(){
    const todos = await $.getJSON('/api/todos')
    console.log(todos)
    showTodos(todos)

    $('#inputField').focus();

    $('#inputField').on('keypress', function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13){
            createTodo();
        }
    })

    $('#todo-list').on('click', '.text', function(){
        updateTodo($(this))
    })

    $('#todo-list').on('click', '.delete', function(){
        removeTodo($(this).parent())
    })

    $('#login-btn').on('click', function(){
        loginToApp()
    })

    $('#logout-btn').on('click', function(){
        logoutFromApp()
    })
})

function showTodos (todos){
    for (let item of todos){
        showTodo(item)
    }
}

function showTodo (todo){
    let elem = $(`<li>
                    <span class="text ${ todo.isCompleted ? 'completed' : ''} "> ${todo.text} </span>
                    <a class="delete">-</a>
                </li>`)
    $('#todo-list').prepend(elem);
    elem.data('id', todo._id)
    elem.data('isCompleted', todo.isCompleted)
}

async function updateTodo(elem){
    const updatedTodo = await $.ajax({
        type :'PUT',
        url : `/api/todo/${elem.parent().data('id')}`,
        data: { isCompleted: !elem.parent().data('isCompleted')}
    })
    elem.toggleClass('completed')
}

async function removeTodo(elem){
    const deletedTodo = await $.ajax({
        type :'DELETE',
        url: `/api/todo/${elem.data('id')}`
    })
    elem.remove();
}

async function createTodo(){
    const userInput = $('#inputField').val();
    const createdTodo = await $.post('/api/todo', {text: userInput})
    $('#inputField').val('');
    $('#inputField').focus();
    showTodo(createdTodo);
}

async function loginToApp(){
    window.location.replace("/oauth/google");
}

async function logoutFromApp(){
    window.location.replace("/logout");
    alert("you are now logged out!");
}