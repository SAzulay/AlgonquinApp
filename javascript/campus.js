var data = {"maintitle":"Campus Services", "services":[{"stitle":"Food and Beverage","sitems":["Marketplace Food Court (D Building)", "35th Street Market Café (Residence)","Bits N’ Bytes (T Building)","Thunder Alley (A Building)","The Portable Feast (B Building)","First Cup Deli (C Building)","The Observatory (A Building)","The Fix Eatery (ACCE Building)"]},{"stitle":"Health Services ","sitems":["Ottawa Campus (Building C)", "Pembroke Campus (Room 127)"]},{"stitle":"Gym","sitems":["Algonquin Fitness Zone (Building A)"]},{"stitle":"Mail Services","sitems":["Mail Services A Building"]},{"stitle":"Technology Store","sitems":["Technology Store D Building"]},{"stitle":"Peer Tutoring","sitems":["Peer Tutoring E Building"]},{"stitle":"Spriritual Centre","sitems":["Spriritual Centre E Building"]},{"stitle":"Student Commons","sitems":["Student Commons E Building"]},{"stitle":"Day Care Centre","sitems":["Day Care Centre K Building"]},{"stitle":"Sports Therapy","sitems":["Sports Therapy Clinic Z Building"]}]};
var selectedService;

function getJson(){
    	var servicesLength = data.services.length;

    	$( "#servicesList" ).empty();
        var newListItem = [];

    	for(var i=0; i < servicesLength; i++){		
    		div= document.createElement("div"); 
            div.setAttribute('id', i);
            div.setAttribute('data-bb-type','item');
            div.setAttribute('data-bb-title',data.services[i].stitle);
            div.setAttribute("onclick", "getServices()" );
            newListItem.push(div);
    	}
    	document.getElementById('servicesList').refresh(newListItem);
}

function getServices(){
	selectedService = document.getElementById('servicesList').selected.id.toString();

	document.getElementById("selService").style.display = "inline";
    document.getElementById("services").style.display = "none";

    var selectedLength = data.services[selectedService].sitems.length;

    $( "#itemList" ).empty();
    var serviceList = [];
    
    for (var j = 0; j < selectedLength; j++){
    	var item = document.createElement("div");
    	item.setAttribute('id', j);
    	item.setAttribute('data-bb-type','item');
    	item.innerHTML = data.services[selectedService].sitems[j];
    	serviceList.push(item);
    }
    document.getElementById('itemList').refresh(serviceList);

}

function showServices(){
    getServices();
    
    document.getElementById("selService").style.display = "none";
    document.getElementById("services").style.display = "inline";
}
