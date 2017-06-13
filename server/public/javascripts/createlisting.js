let i = 1;

// ADDING IMAGE INPUTS
$('.fa-plus').on('click', function(){
    i = i + 1;
    $('#insertImages').append(`<p><input type="text" name="image${i}" placeholder="Image${i}"> <i class="fa fa-minus" aria-hidden="true"></i></p>`);
    
    // DISABLE ONCLICK ONCE 5 IMAGE INPUTS ARE ADDED
    if ( i === 5) {
        $('.fa-plus').off('click');
    }
});

// REMOVING IMAGE INPUTS
$('body').on('click', '.fa-minus', function(){
    $(this).parent('p').remove();
});

// TOOLTIP
$('.fa-question').on('click', function () {
    console.log("clicked")
    $(this).find('#tooltip').append(`test`);
    //$('#tooltip', $(this)).append(`test`);
    //$('#tooltip').$(this).append(`test`);
    //$(this).prev().append('test');
    //$('#tooltip').append(`test`);
    //$(this).prev().focus();
});