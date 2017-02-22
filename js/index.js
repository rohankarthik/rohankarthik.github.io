$(document).ready(function() {
   	'use strict';

	var home_components_key = 'Components';
	var home_components_current_state = [];

	get_home_components("home_objects.json", home_components_key);

	function get_home_components (file, home_components_key) {
		var home_components = home_components_key;

		$.get(file, function (data) {
			retrieve_home_components_state(data[home_components]);
		}, 'json');
	};

	function retrieve_home_components_state(data) {
		$.each(data, function (index, element) {
			home_components_current_state.push(data[index]['current-value']);
		});

		initiliaze_home_components();
	};
		
	function initiliaze_home_components(){
		set_light_state(home_components_current_state[0]);	
		set_temperature_value(home_components_current_state[2]);	
		set_curtain_state(home_components_current_state[1]);	
	}

	function set_light_state(value){
		if(value == 'Off')
			$('.room').removeClass('room.light');
		else
			$('.room').addClass('room.light');
	}

	function set_curtain_state(value){
		if(value == 'Closed')
			$('.door').removeClass('door.curtain');
		else
			$('.door').addClass('door.curtain');
	}

	function set_temperature_value(value){
		$('#temperature').val(value);
		$('#home_top').css('border-bottom', "220px solid #FFb400");
	}

	$('#light_switch').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();

		$('.room').toggleClass('light');

		if (home_components_current_state[0] == 'Off')
			home_components_current_state[0] = 'On';
		else
			home_components_current_state[0] = 'Off';
	});

	$('#curtain_switch').on('click', function(e){
		e.stopPropagation();
		e.preventDefault();
		
		$('.door').toggleClass('curtain');

		if (home_components_current_state[1] == 'Closed')
			home_components_current_state[1] = 'Open';
		else
			home_components_current_state[1] = 'Closed';
	});

	$('#temperature').on('click', function(e){
		e.stopPropagation();
		e.preventDefault();

		var temperatureValue = $(this).val();
		var cold_to_hot_color_hexs = ["0064ff","00a4ff","00c4ff","00e4ff","FFb400",
										"FF6e00","FF3c00","FF0a00","FF0010","FF0040"];

		for(var index = 0; index < 10; index++){
			 if ((temperatureValue >= 50 + 5*index) && (temperatureValue <= 55 + 5*index)){
			 	$('#home_top').css('border-bottom', "220px solid #"+ cold_to_hot_color_hexs[index]);
				break;
			}
		}
	});

	$('#post_to_server').on('click', function(e){
		var lightValue = home_components_current_state[0];
		var curtainValue = home_components_current_state[1];
		var temperatureValue = home_components_current_state[2];
		
		sendData(curtainValue, lightValue, temperatureValue);
	});

// Reference:https://github.com/marybeshaw/Just-Another-Automated-Home/blob/master/js/home-setup.js

    // since data persistent is not a requirement,
    // the "response" json file is just a stub, and simply returns a success case for 
    // setting a particular feature on the server.  
	function sendData(curtainValue, lightValue, temperatureValue) {
	    $.get('response.json', {
	        "light_value": lightValue,
	        "curtain_value": curtainValue,
	        "temperature_value": temperatureValue
	    }).done(function (data) {
	        if (data.success === false) 
				console.log("Error saving component values: " + data.success);
	        else
	        	console.log('success');
	    }, 'json');

	};

});

