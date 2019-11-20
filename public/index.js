/**
This function enables and disables the input fields based on whether the 
selected action verb is GET or POST. For GET, only the hid input field is
enabled and required. For POST, all the input fields are enabled and required.
*/
$("#select_action").change(function(){
  let action = $(this).find("option:selected").attr("id");
  switch (action){
    case "GET":
      $("#chunk_input").prop('disabled',true);
      $("#has_space_input").prop('disabled',true);
      break;
    case "POST":
      $("#chunk_input").prop('disabled',false);
      $("#has_space_input").prop('disabled',false);
      break;
  }
});

/**
This function starts when the web page has loaded and is ready. It captures the input values when
the form is submitted. Depending on the whether the action verb is GET or POST, it makes api calls
to the backend server using asynchornous javascript calls.
*/
$(function() { 
    $('form').on('submit', (event) => {
    	event.preventDefault();
    	let action_value = $('#select_action').val();
        $("#info").html('');
    	let hid_value = $('#hid_input').val();
    	let chunk_value = null;
    	let has_space_value = null;
    	if(action_value === "POST") {
    		has_space_value = $("#has_space_input").val();
    		chunk_value = $("#chunk_input").val();
            if(has_space_value!==null && isNaN(has_space_value)) {
                $("#info").html(`Malformed input: 'has space value' has to be an integer`);
                return;
            }
            if(!(Number.parseFloat(has_space_value) === 0 || Number.parseFloat(has_space_value) === 1 )) {
                $("#info").html(`Malformed input: 'has space value' can only be 0 or 1`);
                return;
            }
    	}

    	
    	switch(action_value) {
    		case "GET":
    			makeGetCall(hid_value);
    			break;
    		case "POST":
    			makePostCall(hid_value,chunk_value,has_space_value);
    			break;
    	}
    });
});

/**
This function will make a GET request to the server with the hid value input. If it returns
succesfully, it will display the data information or else print out an appropriate error
message for the client.
@param hid_value hid value input
*/
function makeGetCall(hid_value) {
	$.ajax({
	    url : `/data/${hid_value}`,
	    type : 'GET',
	    success : function(data) {              
	        const {message} = data;
	        const {hid,chunk,hasSpace} = message;
	        $("#info").html(`Found hid = ${hid}, chunk= ${chunk}, hasSpace = ${hasSpace}`);
	    },
	    error : function(response,error)
	    {
	        const data = JSON.parse(response.responseText);
	        const {message,status} = data;
	        $("#info").html(message);
	    }
});
}

/**
This function will make a POST request to the server with the hid value, chunk value and has-space
value. If it is successful, it will print the information for the new data object created. Else it
will show the appropriate error messge for the client.
@param hid_value 
@param chunk_value 
@param has_space_value 
*/
function makePostCall(hid_value,chunk_value,has_space_value) {
	// $.post(
	//   "/data",
	  // {
	  //   hid: hid_value,
	  //   chunk: chunk_value,
	  //   hasSpace: has_space_value
	  // },
	//   function(data, status){
	//   	console.log(data);
	//     console.log("Data: " + data + "\nStatus: " + status);
	//   }
	//  );
	const url = "/data";
	const json_data = { hid: hid_value, chunk: chunk_value, hasSpace: has_space_value};
	$.ajax({
        type: "POST",
        url: url,
        data: json_data,
        success: function(data,status) {
        	const {message} = data;
	        const {hid,chunk,hasSpace} = message;
	        $("#info").html(`Created hid = ${hid}, chunk= ${chunk}, hasSpace = ${hasSpace}`);
        },
        error: function(response,error) {
        	const data = JSON.parse(response.responseText);
        	const {message,status} = data;
        	$("#info").html(message);
        }
    });
}