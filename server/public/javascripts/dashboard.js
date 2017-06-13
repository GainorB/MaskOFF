$('i').on('click', function () {
    $(this).prev().removeAttr('readonly');
    $(this).prev().focus();
});

$('.update_account').on('click', function () {
    let username = $('.username').val();
    let email = $('.email').val();
    let state = $('.state').val();
    let city = $('.city').val();
    let gender = $('.gender').val();
    let age = $('.age').val();

    var x = window.confirm("Are you sure you want to update your account? You'll need to re login.");
    if (x) {
        axios.put("http://localhost:3000/updateProfile", { username, email, state, city, gender, age }).catch(e => { console.log(e); });
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