$(document).ready(function(){
    $('#registrationForm').on('submit', function(event){
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var button = $(this).find('button[type="submit"]:focus').attr('id');


        $.ajax({
            type: 'POST',
            url: '/auth',
            data: {
                username: username,
                password: password,
                button: button
            },
            success: function(response){
                window.location.href = '/user.html';

            },
            error: function(xhr){
                var response = JSON.parse(xhr.responseText);
                var errorMessage = response.errors;
                $('#result').html('<p>' + errorMessage + '</p>');
            }
        });
    });
});
