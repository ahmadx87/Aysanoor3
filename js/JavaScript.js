var animations = [""];
var AnimationListIndices = "";
var deviceIP = "http://192.168.4.1/"
var currentHash;
var colorR = 255;
var colorG = 255;
var colorB = 255;
if(localStorage.listSaveArray){
var listSaveArray=JSON.parse(localStorage.listSaveArray);
}
else{listSaveArray=[];}
//I use listSaveArray to store saved animation lists. it is like this:
//[['name','animation list'],['name','anim list'],...]

document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//	
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	navigator.splashscreen.hide();
}

var lastreq = 0;

function onBackKeyDown(e) {
    e.preventDefault();
        $.hyc.ui.alert({
            content: 'آیا مایلید از نرم افزار خارج شوید؟',
            buttons: [{
                name: 'بله',
                id: 'confirmBtn',
                color: '#fff',
                bgColor: '#f31',
                callback: function() {
                    $("#sortable").empty();
                    $("#sortable").append(localStorage.animationListSave);
                    this.close();
                    navigator.app.exitApp();
                },
                closable: false
            }, {
                name: 'خیر',
                id: 'cancelBtn',
                color: '#000',
                bgColor: '#fff',
                callback: function() {
                    this.close();
                },
                closable: false
            }],
            closable: false
        });
}

$(document).ready(function () {
	
	//view intialization
	////////////////////
	$('#listAddButton').css('opacity', '0.5');
	$('#listMoveUpButton').css('opacity', '0.5');
	$('#listMoveDownButton').css('opacity', '0.5');
	
	
	setTimeout(function () {
		var widthSize = $(window).width() * .7;
		$('#colorPickerDiv').css({
			'width': widthSize,
			'height': widthSize
		});

		$('#colorPickerInput').wheelColorPicker({
			format: 'hsv',
			sliders: 'w',
			layout: 'block',
			autoResize: false
		});


	}, 0);


	$('#colorPickerInput').on('slidermove', function () {
		/*var color=$(this).wheelColorPicker('getColor');
		console.log(color);
		colorR=Math.round(color.r*255);
		colorG=Math.round(color.g*255);
		colorB=Math.round(color.b*255);
		$("#RValueHTML").text(colorR);
		$("#GValueHTML").text(colorG);
		$("#BValueHTML").text(colorB);*/
	});

	$('#colorPickerInput').on('sliderup', function () {
		/*var d = new Date();
        var currenttime = d.getTime(); //get the time of this change event
        var interval = currenttime - lastreq;
		lastreq=currenttime;
		var color=$(this).wheelColorPicker('getColor');
		console.log(color);
		colorR=Math.round(color.r*255);
		colorG=Math.round(color.g*255);
		colorB=Math.round(color.b*255);
		$("#RValueHTML").text(colorR);
		$("#GValueHTML").text(colorG);
		$("#BValueHTML").text(colorB); */
	});

	$('label').on('click', false);
	
	$("#popupRGBDialog").css('width', $(window).width() * .9);
	$(".popupDialog").css('width', $(window).width() * .8);
	//$("#listLoadSavePopup").css('height', $(window).height() * .9);
	
	
	$("#RGBTable").click(function () {
		$("#popupRGBDialog").popup("open");
		var color = $('#colorPickerInput').wheelColorPicker('getColor');
		colorR = Math.round(color.r * 255);
		colorG = Math.round(color.g * 255);
		colorB = Math.round(color.b * 255);
		$('#colorSliderR').val(Math.round(color.r * 255)).slider('refresh');
		$('#colorSliderG').val(Math.round(color.g * 255)).slider('refresh');
		$('#colorSliderB').val(Math.round(color.b * 255)).slider('refresh');
		$("#colorSliderRNumber").text($('#colorSliderR').val());
		$("#colorSliderGNumber").text($('#colorSliderG').val());
     	$("#colorSliderBNumber").text($('#colorSliderB').val());
	});
	
	$("#listLoadSaveButton").click(function () {
	$("#listLoadSavePopup").popup("open");
	});
	
	$('#listSaveButton').on('tap',function(){
		$("#listLoadSavePopup").popup("close");
		$('#listLoadSavePopup').one("popupafterclose", function(){$('#listSavePopup').popup("open")}).popup("close");
		//$("#listLoadSavePopup").bind({popupafterclose:function(event, ui)  { $('#listSavePopup').popup('open');console.log('openedsave'); }});
	});
	
	$('#listLoadButton').on('tap',function(){
		$("#listLoadSavePopup").popup("close");
		var savedListHTMLstring="";
		for ( var i = 0; i < listSaveArray.length; i++) {
		savedListHTMLstring += "<option value=\"" + i + "\">" + listSaveArray[i][0] + "</option>";
	}
	$("#savedListDropDown").html(savedListHTMLstring);
	$("#savedListDropDown").selectmenu().selectmenu('refresh');
	$('#listLoadSavePopup').one("popupafterclose", function(){$('#listLoadPopup').popup("open")}).popup("close");
		//$("#listLoadSavePopup").bind({popupafterclose:function(event, ui)  { $('#listLoadPopup').popup('open');  console.log('openedload');}});
		
	});
	
	
	$('#saveBtn').on('tap',function(){
		if (!/\S/.test($('#saveListNameInput').val())){
			console.log('empty'); 
		$('#saveListNameInput').css({'border-bottom':'1px solid red', 'background':'#FDD'});
			localStorage.removeItem('listSaveArray');
			} // \S find any non space char
		else{
			var animArray=[];
			$('#olAnimationList li').each(function (index) { //this part generates the string to be sent to controller, like -1-0-3-2-0			
			for (var i = 0; i < animations.length; i++) {
				if ($(this).text() == animations[i]) {
					animArray[index]=i;
					break;
				}
			}
		    });
			console.log(animArray);
			if(listSaveArray.length){										
			var nameSequence=[$('#saveListNameInput').val(),animArray]
			listSaveArray[listSaveArray.length]=nameSequence;
			localStorage.listSaveArray=JSON.stringify(listSaveArray);
			}
			else{
				var nameSequence=[$('#saveListNameInput').val(),animArray]
				localStorage.listSaveArray=JSON.stringify([nameSequence]);
			}
			console.log(localStorage.listSaveArray);
			$('#listSavePopup').popup('close');
			$('#successMsg').html('لیست ذخیره شد <i class="icon-rainemo-thumbsup"></i> ');
			$('#successMsg').css('left', $(window).width()/2-$('#successMsg').width()/2);
			$("#successMsg").show().delay(2000).fadeOut();
		}
	});
	
	$('#loadBtn').on('tap',function(){
		console.log($('#savedListDropDown').val());
		var animationIndexArray=listSaveArray[$('#savedListDropDown').val()][1];
		console.log(animationIndexArray);
		$("#olAnimationList").empty();
		for (var i = 0; i < animationIndexArray.length; i++) {
			$("#olAnimationList").append('<li><span class="handle"><i class="icon-raincancel"></i></span>' + animations[animationIndexArray[i]] + '</li>');
		}
	});
	
	$('#listLoadDeleteButton').on('tap',function(){
		itemToRemove=listSaveArray[$('#savedListDropDown').val()][0];
		console.log(itemToRemove);
		var msg='آیتم " '+itemToRemove+' " حذف خواهد شد. آیا ادامه می دهید؟';
		$.hyc.ui.alert({
            content: msg,
            buttons: [{
                name: 'بله',
                id: 'confirmBtn',
                color: '#fff',
                bgColor: '#f31',
                callback: function() {
                    listSaveArray.splice($('#savedListDropDown').val(),1);
					console.log(listSaveArray.length);
					savedListHTMLstring="";
					for ( var i = 0; i < listSaveArray.length; i++) {
						savedListHTMLstring += "<option value=\"" + i + "\">" + listSaveArray[i][0] + "</option>";
					}
					$("#savedListDropDown").html(savedListHTMLstring);
					$("#savedListDropDown").selectmenu("refresh", true);
					localStorage.listSaveArray=JSON.stringify(listSaveArray);
                    this.close();   					
                },
                closable: false
            }, {
                name: 'خیر',
                id: 'cancelBtn',
                color: '#000',
                bgColor: '#fff',
                callback: function() {
                    this.close();
                },
                closable: false
            }],
            closable: false
        });
	});
	
	$( "#listSavePopup" ).on( "popupafterclose", function( event, ui ) {
		console.log('closed');
		$('#saveListNameInput').css({'border-bottom':'1px solid #AAF', 'background':'#FFF'});
		$('#saveListNameInput').val("");
	} );
	
	
	
	$('#okButtonRGBDialog').on('tap', function(){
	   $('#colorPickerInput').wheelColorPicker('setColor', {r: $('#colorSliderR').val()/255, g: $('#colorSliderG').val()/255, b:$('#colorSliderB').val()/255});
	});



});
//localStorage.chosenColorG = Math.round(color.getRgb().g * 255);


$(document).ready(function () {

	// check if we are connected to device WiFi
	///////////////////////////////////////////


	/////////////////////////////////////////////

	setInterval(function () {
		currentHash = window.location.href;
	}, 1000);

	"use strict";
	if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
		$("body").addClass("ios7");
		$("body").append('');
	}

	/// Brightness slider

	$('#brightnessSlider').slider({
		highlight: true,
		stop: function (event, ui) {
			$(".brightnessVal").html($('#brightnessSlider').val());
			$(".brightnessVal").append(" درصد ");
			//TODO: send command to ESP
		}
	});

	var lastreq = 0;
	$('#brightnessSlider').on("change", function () {
		localStorage.setItem("brightnessValue", $('#brightnessSlider').val());
		var d = new Date();
		var currenttime = d.getTime(); //get the time of this change event
		var interval = currenttime - lastreq; //how many milliseconds since the last request
		if (interval >= 100) { //more than 100 milliseconds
			lastreq = currenttime; //set lastreq for next change event
			$(".brightnessVal").html($('#brightnessSlider').val());
			$(".brightnessVal").append(" درصد ");
			//TODO: send command to ESP
		}

	});
	
	$('#colorSliderR').on("change", function () {
			$("#colorSliderRNumber").text($('#colorSliderR').val());
			//TODO: send command to ESP
	});
	
	$('#colorSliderG').on("change", function () {
			$("#colorSliderGNumber").text($('#colorSliderG').val());
			//TODO: send command to ESP
	});
	
	$('#colorSliderB').on("change", function () {
			$("#colorSliderBNumber").text($('#colorSliderB').val());
			//TODO: send command to ESP
	});


	// gHue slider

	$('#gHueChangeTimeIntervalSlider').slider({
		stop: function (event, ui) {
			localStorage.setItem("gHueChangeTimeIntervalVal", $('#gHueChangeTimeIntervalSlider').val());
			$(".gHueTimeVal").html($('#gHueChangeTimeIntervalSlider').val());
			//TODO: send command to ESP
		}
	});

	var lastreqHue = 0;
	$('#gHueChangeTimeIntervalSlider').on("change", function () {
		localStorage.setItem("gHueChangeTimeIntervalVal", $('#gHueChangeTimeIntervalSlider').val());
		var d = new Date();
		var currenttime = d.getTime(); //get the time of this change event
		var interval = currenttime - lastreqHue; //how many milliseconds since the last request
		if (interval >= 100) { //more than 100 milliseconds
			lastreqHue = currenttime; //set lastreqHue for next change event
			$(".gHueTimeVal").html($('#gHueChangeTimeIntervalSlider').val());
			//TODO: send command to ESP
		}

	});


	/////////////////

	/// FPS slider


	$('#FPSSlider').on("change", function () {
		$(".FPSVal").html($('#FPSSlider').val());
		localStorage.setItem("FPSValue", $('#FPSSlider').val());
	});
	///////////////////

	/// AnimationDuration slider


	$('#AnimationDurationSlider').on("change", function () {
		$(".AnimationDurationVal").html($('#AnimationDurationSlider').val());
		localStorage.setItem("AnimationDurationValue", $('#AnimationDurationSlider').val());
	});
	///////////////////

	//animation selector

	animations = ["رنگین کمان", "رنگین کمان+درخشش", "رنگین کمان+درخشش 2", "تپش تصادفی", "ستاره دنباله دار", "3 ستاره دنباله دار", "رفت و برگشتی", "7 رنگ پیوسته"];
	var selectionHTMLstring = "";

	for ( var i = 0; i < animations.length; i++) {
		selectionHTMLstring += "<option value=\"" + i + "\">" + animations[i] + "</option>";
	}

	$("#animationDropDown").prepend(selectionHTMLstring);
	$("#animationDropDown").on('change', function () {
		localStorage.animSelectionIndex = $('#animationDropDown').val();
	});


	$(".brightnessVal").html(localStorage.brightnessValue);
	$('#brightnessSlider').val(localStorage.brightnessValue).slider('refresh');
	$(".brightnessVal").append(" درصد ");
	$(".gHueTimeVal").html(localStorage.gHueChangeTimeIntervalVal);
	$('#gHueChangeTimeIntervalSlider').val(localStorage.gHueChangeTimeIntervalVal).slider('refresh');
	$(".FPSVal").html(localStorage.FPSValue);
	$('#FPSSlider').val(localStorage.FPSValue).slider('refresh');
	$(".AnimationDurationVal").html(localStorage.AnimationDurationValue);
	$('#AnimationDurationSlider').val(localStorage.AnimationDurationValue).slider('refresh');


	if ($.isNumeric(localStorage.numberOfLEDS)) {
		$("#numberOfLEDSinput").val(localStorage.numberOfLEDS);
	} else {
		$("#numberOfLEDSinput").val("100");
	}

	/// RGB color slider selection
	$('#colorRSlider').slider(); //if slider() method is not applied we get error when we call refresh method on the slider
	$('#colorGSlider').slider();
	$('#colorBSlider').slider();

	if ($.isNumeric(localStorage.chosenColorR)) {
		$('#colorRSlider').val(localStorage.chosenColorR).slider('refresh');
		$("#colorRSlider").css("background", 'rgb(' + $("#colorRSlider").val() + ',0,0)');
	} else {
		$("#colorRSlider").val("0").slider('refresh');
	}

	if ($.isNumeric(localStorage.chosenColorG)) {
		$("#colorGSlider").val(localStorage.chosenColorG).slider('refresh');
		$("#colorGSlider").css("background", 'rgb(0,' + $("#colorGSlider").val() + ',0)');
	} else {
		$("#colorGSlider").val("0").slider('refresh');
	}

	if ($.isNumeric(localStorage.chosenColorB)) {
		$("#colorBSlider").val(localStorage.chosenColorB).slider('refresh');
		$("#colorBSlider").css("background", 'rgb(0,0,' + $("#colorBSlider").val() + ')');
	} else {
		$("#colorBSlider").val("0").slider('refresh');
	}

	$("#modeOptions").trigger("change");
	// end of initialization


});

$(document).ready(function () {


	$('#colorRSlider').on("change", function () {
		$("#chromoselectorInput").chromoselector('setColor', 'rgb(' + $("#colorRSlider").val() + ',' + localStorage.chosenColorG + ',' + localStorage.chosenColorB + ')');
		$(this).css("background", 'rgb(' + $("#colorRSlider").val() + ',0,0)');
	});

	$('#colorGSlider').on("change", function () {
		$("#chromoselectorInput").chromoselector('setColor', 'rgb(' + localStorage.chosenColorR + ',' + $("#colorGSlider").val() + ',' + localStorage.chosenColorB + ')');
		$(this).css("background", 'rgb(0,' + $("#colorGSlider").val() + ',0)');
	});

	$('#colorBSlider').on("change", function () {
		$("#chromoselectorInput").chromoselector('setColor', 'rgb(' + localStorage.chosenColorR + ',' + localStorage.chosenColorG + ',' + $("#colorBSlider").val() + ')');
		$(this).css("background", 'rgb(0,0,' + $("#colorBSlider").val() + ')');
	});


});


$(document).ready(function () {


	if (localStorage.AnimationListIndices) {
		var animationIndexArray=JSON.parse(localStorage.AnimationListIndices);
		for (var i = 0; i < animationIndexArray.length; i++) {
			$("#olAnimationList").append('<li><span class="handle"><i class="icon-raincancel"></i></span>' + animations[animationIndexArray[i]] + '</li>');
		}
	} else {
		for (var i = 0; i < animations.length; i++) {
			$("#olAnimationList").append('<li><span class="handle"><i class="icon-raincancel"></i></span>' + animations[i] + '</li>');
		}
	}
	
	$("#listSendButton").click(function () {
		if ($('#olAnimationList li').length<1){
			$('#successMsg').html(' لیست خالی است <i class="icon-rainemo-displeased"></i>');
		$('#successMsg').css('left', $(window).width()/2-$('#successMsg').width()/2);
		$("#successMsg").show().delay(2000).fadeOut();
		}
		else{
		var animArray=[];
		var AnimationListIndices = "";
		$('#olAnimationList li').each(function (index) { //this part generates the string to be sent to controller, like -1-0-3-2-0
			for (var i = 0; i < animations.length; i++) {
				if ($(this).text() == animations[i]) {
					AnimationListIndices = AnimationListIndices + "-" + (i + 1).toString();
					animArray[index]=i;
					break;
				}
			}
		})
		AnimationListIndices += "-";
		localStorage.AnimationListIndices = JSON.stringify(animArray);
		$('#successMsg').html('لیست ارسال شد <i class="icon-rainemo-thumbsup"></i> ');
		$('#successMsg').css('left', $(window).width()/2-$('#successMsg').width()/2);
		$("#successMsg").show().delay(2000).fadeOut();
		}
	});


		$("#animationDropDown option[value='0']").attr('selected', 'selected');
		$('#animationDropDown').selectmenu().selectmenu('refresh');

	$("#olAnimationList").selectable({
		stop: function (event, ui) { //If multiple items are selected, deselect all.
			if ($('.ui-selected').length > 1) {
				$(event.target).children('.ui-selected').removeClass('ui-selected');
			}
			if ($('#olAnimationList .ui-selected').index() >= 0) {
				$('#listAddButton').css('opacity', '1');
				$('#listMoveDownButton').css('opacity', '1');
				$('#listMoveUpButton').css('opacity', '1');
			} else {
				$('#listAddButton').css('opacity', '0.5');
				$('#listMoveDownButton').css('opacity', '.5');
				$('#listMoveUpButton').css('opacity', '.5');
			}
			if($('#olAnimationList .ui-selected').index()==0) {
				$('#listMoveUpButton').css('opacity', '0.5');
			}
			if($('#olAnimationList .ui-selected').index()==($('#olAnimationList li').length-1)) {
				$('#listMoveDownButton').css('opacity', '0.5');
			}
		}
	});



	$("#listAddButton").on("tap", function () {
		if ($('#olAnimationList li').length== 0){
			$('#olAnimationList').append('<li><span class="handle"><i class="icon-raincancel"></i></span>'+ $('#animationDropDown option:selected').text() + '</li>');
			$('#olAnimationList li').eq(0).addClass('ui-selected');
		}
		else if ($('#olAnimationList .ui-selected').index() != -1) {
			if ($('#olAnimationList li').length < 30) {
				$('#olAnimationList .ui-selected').before('<li><span class="handle"><i class="icon-raincancel"></i></span>' + $('#animationDropDown option:selected').text() + '</li>');
				var $s = $('#listContainer');
				var selectedLiItemOffsetTop = $('#olAnimationList .ui-selected').offset().top;
				var listContainerOffsetTop = $s.offset().top;
				if (isSelectedInView()){
				$s.scrollTop($s.scrollTop() + (selectedLiItemOffsetTop - listContainerOffsetTop));
				}

				$("#olAnimationList").selectable();

			} else {
				$.hyc.ui.alert({
					content: 'حداکثر 30 انیمیشن می توانید اضافه کنید.',
					buttons: [{
						name: 'قبول',
						id: 'confirmBtn',
						color: '#fff',
						bgColor: '#3c3',
						callback: function () {
							this.close();
						},
						closable: true
					}, ],
					closable: true
				});
			}
		}
	});


$("#olAnimationList").on("tap",".handle", function () {
			$(this).parent().remove();			
		$("#olAnimationList").find("li").removeClass('ui-selected');
	});

	$("#listMoveUpButton").on("tap", function () {
		
		var $selectedItem = ($('#olAnimationList .ui-selected').index());

		if ($('#olAnimationList li').length > 1 && $selectedItem != -1 && $selectedItem != 0) {
			$('#olAnimationList li').eq($selectedItem - 1).before('<li>' + $('#olAnimationList li').eq($selectedItem).html() + '</li>');
			$('#olAnimationList .ui-selected').remove();
			$('#olAnimationList li').eq($selectedItem - 1).addClass('ui-selected');
			var $s = $('#listContainer');

			var selectedLiItemOffsetTop = $('#olAnimationList .ui-selected').offset().top;
			var listContainerOffsetTop = $s.offset().top;
			if (isSelectedInView()){
			/* to animate:*/ $s.animate({scrollTop: ($s.scrollTop() + (selectedLiItemOffsetTop - listContainerOffsetTop)-$('#olAnimationList .ui-selected').height()*2)},100);
			//$s.scrollTop($s.scrollTop() + (selectedLiItemOffsetTop - listContainerOffsetTop)-$('#olAnimationList li').height()*2);
		}
		}


	});
	
	$("#listMoveDownButton").on("tap", function () {


		var $selectedItem = ($('#olAnimationList .ui-selected').index());

		if ($('#olAnimationList li').length > 1 && $selectedItem != -1 && $selectedItem != $('#olAnimationList li').length - 1) {
			$('#olAnimationList li').eq($selectedItem + 1).after('<li>' + $('#olAnimationList li').eq($selectedItem).html() + '</li>');
			$('#olAnimationList .ui-selected').remove();
			$('#olAnimationList li').eq($selectedItem + 1).addClass('ui-selected');
			var $s = $('#listContainer');
			var selectedLiItemOffsetTop = $('#olAnimationList .ui-selected').offset().top;
			var listContainerOffsetTop = $s.offset().top;
			if (isSelectedInView()){
			//$s.scrollTop($s.scrollTop() + (selectedLiItemOffsetTop - listContainerOffsetTop));
			$s.animate({scrollTop: ($s.scrollTop() + (selectedLiItemOffsetTop - listContainerOffsetTop*1.2))},100);
		}
		}
	});
	
	
	$(".onOffButton").on("tap", function () {
    });
	
	$(".settingsButton").on("tap", function () {
		$("#settPage").popup("open");
    });
	


	



	$("#okButtonSettingsPage").click(function () {
		var configString = "";
		if ($("#numberOfLEDSinput").val() > 1000 || $("#numberOfLEDSinput").val() < 1 || (/[^0-9]/.test($("#numberOfLEDSinput").val()))) {
			$.hyc.ui.alert({
				content: 'تعداد LED باید بیشتر از یک و کمتر از 1000 عدد باشد.',
				buttons: [{
					name: 'قبول',
					id: 'confirmBtn',
					color: '#fff',
					bgColor: '#3c3',
					callback: function () {
						this.close();
					},
					closable: true
				}, ],
				closable: true
			});
		} else {
			localStorage.numberOfLEDS = $("#numberOfLEDSinput").val();
			configString += "@NLED" + $("#numberOfLEDSinput").val() + "@NLED";
		}

		var usernameValidate = (/[^a-zA-Z0-9 &,.:*-]/.test($("#usernameWifi").val()) || (($("#usernameWifi").val()).length < 1) || (($("#usernameWifi").val()).length > 32));
		var passwordOldValidate = ((/[^a-zA-Z0-9 &,.:*-]/.test($("#passwordWifiOld").val())) || (($("#passwordWifiOld").val()).length < 8) || (($("#passwordWifiOld").val()).length > 32)); //check if password length is at least 8 chars and it only contains letters, numbers and these chars: "space-&:.,". if everything is ok it will return false.
		var passwordNewValidate = ((/[^a-zA-Z0-9 &,.:*-]/.test($("#passwordWifiNew").val())) || (($("#passwordWifiNew").val()).length < 8) || (($("#passwordWifiNew").val()).length > 32));
		if ($("#passwordWifiOld").val().length > 0 || $("#passwordWifiNew").val().length > 0 || $("#usernameWifi").val().length > 0) {
			if (usernameValidate || passwordOldValidate || passwordNewValidate) {
				$.hyc.ui.alert({
					content: '<p style="text-align:right;">در تغییر دادن نام و رمز وایفای به موارد زیر توجه کنید:<br/>- رمز وایفای باید حداقل 8 و حداکثر 32 کارکتر باشد.<br/>- نام وایفای باید حداقل 1 و حداکثر 32 کارکتر باشد.<br/>- رمز و نام وایفای تنها می تواند شامل حروف انگلیسی بزرگ و کوچک، اعداد، و علائم : , . & * - و فاصله خالی باشد.</p>',
					buttons: [{
						name: 'قبول',
						id: 'confirmBtn',
						color: '#fff',
						bgColor: '#080',
						callback: function () {
							this.close();
						},
						closable: true
					}, ],
					color: "#aaa",
					closable: true
				});

			} else {
				configString += '@UN' + $("#usernameWifi").val() + '@UN@PN' + $("#passwordWifiNew").val() + '@PN@PO' + $("#passwordWifiOld").val() + '@PO';
			}

		}
		//window.history.back();
		sendConfig(configString);

	})

	//back button list creation page
	$('#cancelButton').on("tap", function () {
		if (localStorage.animationListSave != $("#olAnimationList").html()) {
			$.hyc.ui.alert({
				content: 'تغییرات ذخیره نخواهد شد. آیا مطمئن هستید؟',
				buttons: [{
					name: 'بله',
					id: 'confirmBtn',
					color: '#fff',
					bgColor: '#f31',
					callback: function () {
						$("#olAnimationList").empty();
						$("#olAnimationList").append(localStorage.animationListSave);
						window.history.back();
						this.close();
					},
					closable: false
				}, {
					name: 'خیر',
					id: 'cancelBtn',
					color: '#000',
					bgColor: '#fff',
					callback: function () {
						this.close();
					},
					closable: false
				}],
				closable: false
			});
		} else {
			window.history.back();
		}

	});

	$('#cancelButtonSettingsPage').on("tap", function () {

		if ($("#numberOfLEDSinput").val() != localStorage.numberOfLEDS || $("#usernameWifi").val() != "" || $("#passwordWifiOld").val() != "" || $("#passwordWifiNew").val() != "") {
			$.hyc.ui.alert({
				content: 'تغییرات ذخیره نخواهد شد. آیا مطمئن هستید؟',
				buttons: [{
					name: 'بله',
					id: 'confirmBtn',
					color: '#fff',
					bgColor: '#f31',
					callback: function () {
						$("#numberOfLEDSinput").val(localStorage.numberOfLEDS);
						$("#ColorSequenceInput").val(localStorage.ledChipColorSequence);
						$("#usernameWifi").val("");
						$("#passwordWifiOld").val("");
						$("#passwordWifiNew").val("");
						window.history.back();
						this.close();
					},
					closable: false
				}, {
					name: 'خیر',
					id: 'cancelBtn',
					color: '#000',
					bgColor: '#fff',
					callback: function () {
						this.close();
					},
					closable: false
				}],
				closable: false
			});
		} else {
			window.history.back();
		}
	});


	$('#runButton').on("tap", function () {
		sendPattern();
	});


});



//the following function forces NumberOfLeds input to only accept number character
$(function () {
	$("input[id*='numberOfLEDSinput']").keydown(function (event) {
		if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode != 8) {
			event.preventDefault();
		}
	});
})

function isSelectedInView(){
			var $lstCon = $('#listContainer');
			var selectedLiItemOffsetTop = $('#olAnimationList .ui-selected').offset().top;
			var listContainerOffsetTop = $lstCon.offset().top;
			var lstConHeight=$lstCon.height();
			//returns 0 if in view, -1 if below view, 1 if above view
			if(selectedLiItemOffsetTop-listContainerOffsetTop<10) return 1
			else if(selectedLiItemOffsetTop-listContainerOffsetTop<lstConHeight )return 0; 
			else return -1;		
	}





