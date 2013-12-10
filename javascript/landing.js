window.addEventListener('load',function() {
    document.addEventListener('webworksready', function(e) {
        bb.init();
        // do something special
       
       }, false);
}, false);

function myContacts(){
	bb.pushScreen('contacts.html','tabOne');
}

function campus(){
	bb.pushScreen('campus.html', 'services');
}

function goingPlaces(){

	blackberry.invoke.invoke({
    target: "sys.browser",
    uri: "http://www.octranspo.com/mobi/"
	}, onSuccess, onError);

}

function timetable(){
	bb.pushScreen('timetable.html','myTimetable');
}

function onSuccess(response) {
	console.log("<p>Invocation query successful: " + response + "</p>");
}

function onError(error) {
	console.log("<p>Invocation query error: " + error + "</p>");
}

function favPlaces(){
	bb.pushScreen('favPlaces.html','favPlace');
}