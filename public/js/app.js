$(document).ready(function(){
  /* Traverse the DOM to delete row elements. */
  $(document).on('click', '.deleteRow', function(){   // Bind click event to deleteRow.
    var sendId = $(this).parent().parent().children().filter('.id')[0]; // Find id for children of grandparent.
    var sendData = {};
    sendData.id = $(sendId).text();
    sendData.table = $(location).attr('href'); // Reference attribute from the corresponding table.
    sendData.table = sendData.table.substr(sendData.table.lastIndexOf('/') + 1);  // Extract only characters from row to delete.
    console.log(sendData);
    $.ajax({ // Send DELETE request to delete-row.
      method:"DELETE",
      url:"delete-row",
      data: sendData
    }).done(function(data){
      var chooseRow = '#row';
      chooseRow += data; // Set row and its data.
      $(chooseRow).remove(); // Take row out of the DOM.
    });
  });

  /* Traverse the DOM to edit row elements. */
  $(document).on('click', '.editRow', function(){  // Bind click event to editRow.
    var chooseRow = $(this).parent().parent().children();  // Select children of grandparent as row.
    $(chooseRow).each(function(ind, elem){
      var elementText = $(elem).text();
      if($(elem).hasClass('id')){ // Not an editable DOM element.
        return;
      }
      else if ($(elem).hasClass('edit-buttons')) { // Replace edit-button with update-button upon selection of edit.
        $(elem).children().filter('.editRow').removeClass('editRow').addClass('updateRow').text("Update");
      }
      else if(!(parseInt(elementText, 10) > -1)){ // If parsed result is not a nonnegative int, then input is text.
        var setHTML = "<input type='text' class='form-control' value='" + elementText + "'/>";
        $(elem).html(setHTML);
      }
      else { // Input is a number.
        var setHTML = "<input type='number' class='form-control' value='" + elementText + "'/>";
        $(elem).html(setHTML);
      }
    })
  });

  /* Traverse the DOM to update row elements. */
  $(document).on('click', '.updateRow', function(){  // Bind click event to updateRow.
    var sendData = {};
    sendData.columns = {};
    $(this).parent().parent().children().not('.edit-buttons').each(function(ind,elem){
             $(elem).children().removeClass('has-error');
              if($(elem).children().val() == ''){ // Empty element is not sent.
                $(elem).children().addClass('has-error');
              }
              else {
                if( $(elem).hasClass('id')){ // Validate whether element has a class to obtain attribute.
                  sendData[$(elem).attr('class')] = $(elem).text();
                }
                else { // Send value // Get attribute of child element.
                  sendData.columns[$(elem).attr('class')] = $(elem).children().val();
                }
              }
    });
    sendData.table = $(location).attr('href');
    sendData.table = sendData.table.substr(sendData.table.lastIndexOf('/') + 1);
    console.log(sendData);
    $.ajax({ // Send POST request to update-row.
      method:"POST",
      url:"update-row",
      data: sendData
    }).done(function(data){
      var chooseRow = "#row";
      chooseRow += data.id;
      $(chooseRow).children().not('.id').each(function(ind, elem){
        if ($(elem).hasClass('edit-buttons')) { // Replace update-button with edit-button upon selection of update.
          $(elem).children().filter('.updateRow').removeClass('updateRow').addClass('editRow').text("Edit");
        }
        else { // Update column with user input.
          for(var key in data.columns){
            if($(elem).hasClass(key)){
              $(elem).html(data.columns[key]);
            }
          }
        }
      });
    });
  });

  /* Traverse the DOM to add row elements. */
  $(document).on('click', '#addRow', function(){ // Bind click event to addRow.
    var sendData = {};
    var dataSafe = true;
    sendData.columns = {};
    sendData.table = $(location).attr('href'); // Reference attribute from the corresponding table.
    sendData.table = sendData.table.substr(sendData.table.lastIndexOf('/') + 1);
    console.log(sendData);
    $(this).parent().parent().children().not('.edit-buttons').children().each(function(ind,elem){
    $(elem).parent().removeClass('has-error');
    var key = $(elem).attr('id').substr(3);
    if($(elem).val() == ''){
     dataSafe = true;   // Allow user input as empty column.
    }
    sendData.columns[key] = $(elem).val();
    });
    if(dataSafe){ // Send POST request to add-row.
      $.ajax({
        method:"POST",
        url:"add-row",
        data: sendData
      }).done(function(data){
        location.reload();
      });
    }
    else {
      return;
    }
  });
});
