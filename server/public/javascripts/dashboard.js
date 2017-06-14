$('i').on('click', function () {
    $(this).prev().removeAttr('readonly');
    $(this).prev().focus();
});

$('.update_account').on('click', function () {
    let username = $('.username').val();
    let email = $('.email').val();
    let state = $('.state').val();
    let city = $('.city').val();
    let age = $('.age').val();

    var x = window.confirm("Are you sure you want to update your account? You'll need to re login.");
    if (x) {
        axios.put("http://localhost:3000/updateProfile", { username, email, state, city, age }).catch(e => { console.log(e); });
    }
    window.location.href = "/";
});

$('.delete_account').on('click', function () {

    var x = window.confirm("Are you sure you want to delete your account?");
    if (x) {
        axios.delete("http://localhost:3000/deleteAccount").catch(e => { console.log(e); });
    }
    window.location.href = "/";
});

// PREVENT NEGATIVE NUMBERS IN THE NUMBER INPUT
$('#number').keydown(function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
});