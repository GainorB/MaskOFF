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

// TOGGLE TOOLTIP
$('#tooltip').on('click', function () {
    console.log("clicked");
});

// RENDER HTML SELECT INPUTS
function sneakerSelect(size){
    return `
                <select name=${size} required>
                <option value="Size 4" selected>Size 4</option>
                <option value="Size 4.5">Size 4.5</option>
                <option value="Size 5">Size 5</option>
                <option value="Size 5.5">Size 5.5</option>
                <option value="Size 6">Size 6</option>
                <option value="Size 6.5">Size 6.5</option>
                <option value="Size 7">Size 7</option>
                <option value="Size 7.5">Size 7.5</option>
                <option value="Size 8">Size 8</option>
                <option value="Size 8.5">Size 8.5</option>
                <option value="Size 9">Size 9</option>
                <option value="Size 9.5">Size 9.5</option>
                <option value="Size 10">Size 10</option>
                <option value="Size 10.5">Size 10.5</option>
                <option value="Size 11">Size 11</option>
                <option value="Size 11.5">Size 11.5</option>
                <option value="Size 12">Size 12</option>
                <option value="Size 12.5">Size 12.5</option>
                <option value="Size 13">Size 13</option>
                </select>
            `;
}

function clothingSelect(size){
    return `
                <select name=${size} required>
                <option value="Extra Small" selected>Extra Small</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
                <option value="2XL">2XL</option>
                </select>
            `;
}

// CATEGORIES AND SIZES
$('#category').change(function(){
    if($('#category').val() === "Footwear"){
        $('#size').hide();
        $('#whatsize').hide();

        $('.changeSize').html(sneakerSelect("size"));
        $('.changeWhatSize').html(sneakerSelect("whatsize"));

    } else if ($('#category').val() === "Clothing"){
        $('#size').hide();
        $('#whatsize').hide();

        $('.changeSize').html(clothingSelect("size"));
        $('.changeWhatSize').html(clothingSelect("whatsize"));

    } else if ($('#category').val() === "Accessories"){
        $('#size').hide();
        $('#whatsize').hide();

        $('.changeSize').html(
            `
                <input type="text" name="size" value="One Size" readonly>
            `);
        $('.changeWhatSize').html(
             `
                <input type="text" name="whatsize" value="One Size" readonly>
            `);
    }
});

// PREVENT NEGATIVE NUMBERS IN THE NUMBER INPUT
$('#number').keydown(function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
});