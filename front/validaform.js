$(function() {
  $('#footer-form').submit(function() {
    const name = $('#name').val();
    const email = $('#email').val();
    const message = $('#message').val();

    const sendData = {
      name,
      email,
      message,
    };

    $("#submitbtn").prop('value', 'Emviando...');

    try {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/form-message',
        data: sendData,
        success: function (data) {
          $("#submitbtn").prop('value', 'Enviado!');
          console.log('Submission was successful.');
          console.log(data);
        },
        error: function (data) {
          $("#submitbtn").prop('value', 'Ocorreu um erro!');
          console.log('An error occurred.');
          console.log(data);
        }
      });
    } catch (e) {
      console.log(e)
    }

      return false;
  }); 
});
