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
	var $roomForm = $('#roomForm');
	var $create = $('#create');	//button do tworzenia pokoju
	var $roomName = $('#roomName');


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
			$roomForm.hide();
		}
	
	});
	
	$create.click(function(e){
	
		e.preventDefault();
		
		if($roomName.val().length > 0){
			socket.emit('create room', $roomName.val());
		}
	
	});
	
		
    socket.on('connect', function () {
		$('#connStat').attr('src', 'img/bullet_green.png');
    });
		
    socket.on('history', function (data) {
	
        msgHistory = data;
		$.each(msgHistory, function(i, el){
		
			$chatLog.prepend(el + '<br/>');
		
		});
		
    });
		
    socket.on('rec msg', function (data) {
        $chatLog.append(data + '<br/>');
    });
	
	socket.on('showRooms', function(data){
		$selectRoom.html("");
		
		$.each(data, function(i, el){
			$selectRoom.append($( '<option>', {value: i, text: el} ));
		});
	});
	
	
});
