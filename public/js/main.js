$(function(){

	var socket = io.connect();
	var msgHistory = [];
	var selectedRoom = 'Room0';
	
	//zmienne DOM:
	var $chatLog = $('#chatLog');
	var $selectRoom = $('#selectRoom');
	var $messageForm = $('#messageForm');
	var $nameForm = $('#nameForm');
	var $set = $('#set');	//button do nazwy
	var $send = $('#send');	//button do wiadomosci
	var $message = $('#message');
	var $name = $('#name');


	//--------ZAMIANA TAGÓW---------
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
		
    var replaceTag = function (tag) {
        return tagsToReplace[tag] || tag;
    };
		
    var safe_tags_replace = function (str) {
        return str.replace(/[&<>]/g, replaceTag);
    };
	//--------------------------------
	
	$chatLog.hide();
	$messageForm.hide();
	
	//Przypisuje funkcje klik do buttonow:
	$send.click(function(e){
	
		e.preventDefault();	//deaktywacja "defaultowego" dzialania buttona
		
		if($message.val().length > 0){
			console.log($message.val());
			socket.emit('send msg', safe_tags_replace($message.val()));
			$message.val('');	//czyszcze inputa
		}
	
	});
	
	$set.click(function(e){
	
		e.preventDefault();
		
		if($name.val().length > 0){
			console.log($name.val());
			socket.emit('set name', $name.val());
			
			//przypisuje usera do pokoju(jesli zostal wybrany)
			if($selectRoom.val()){
				selectedRoom = $selectRoom.val();
			}
			socket.emit('join room', selectedRoom);
			
			$chatLog.show();
			$messageForm.show();
			$selectRoom.hide();
			$nameForm.hide();
		}
	
	});
	
		
    socket.on('connect', function () {
        $(".bulb").first.html("");
    });
		
    socket.on('history', function (data) {
	
        msgHistory = data;
		$.each(msgHistory, function(i, el){
		
			$chatLog.append(el + '<br/>');
		
		});
		
    });
		
    socket.on('rec msg', function (data) {
        $chatLog.append(data + '<br/>');
    });
	
	
});
