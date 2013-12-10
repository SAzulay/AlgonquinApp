dbNamespace = {};

dbNamespace.db = window.openDatabase('algonquinApp database', '1.0', 'Offline algonquinApp Information', 5*1024*1024);

var selectedItem;

window.addEventListener('load',function() {
    document.addEventListener('webworksready', function(e) {
        bb.init();
        // do something special
        //dropTable();
        createDB();
       }, false);
}, false);

function dropTable(){
    var db = dbNamespace.db;
    db.transaction(function(trans) {
        trans.executeSql("DROP TABLE contacts",[],
        function(trans,result) {
            alert("Table Dropped");
        },
        function(trans, error){
            alert("Table Drop Error: " + error);
        }
    )});
}

function createDB(){
    var db = dbNamespace.db;
    db.transaction(function(trans) {
        trans.executeSql("CREATE TABLE IF NOT EXISTS contacts(bbID INTEGER PRIMARY KEY, desc TEXT, profilePic)", 
        [], 
        function(trans, result) {
           // handle  the success
            console.log("Database created!");
            getContacts();
        }, 
        function(trans, error) {
            // handle the error
            alert("Database creation error: " + error);
        }
    )});
}

function createBBContact() {
    var fName = document.getElementById("fName").value;
    var lName = document.getElementById("lName").value;
    var hPhone = document.getElementById("homePhone").value;
    var mPhone = document.getElementById("mobilePhone").value;
    var hEmail = document.getElementById("homeEmail").value;
    var wEmail = document.getElementById("workEmail").value;
    var met_desc = document.getElementById("description").value;

    if(fName == "" && lName == ""){
        alert("Please enter both a First and Last Name.");
    } else if(hPhone == "" && mPhone == ""){
        alert("Please enter at least one phone number.");
    } else if(hEmail == "" && wEmail == ""){
        alert("Please enter at least one email address.");
    } else if(met_desc == ""){
        alert("Please enter where you met.");
    } else{

        var contacts = blackberry.pim.contacts,
        ContactField = contacts.ContactField,
        name = {},
        
        homePhone = { type: ContactField.HOME, value: hPhone },
        mobilePhone = { type: ContactField.WORK, value: mPhone },
        workEmail = { type: ContactField.WORK, value: wEmail },
        homeEmail = { type: ContactField.HOME, value: hEmail },
        contact;
        
        name.familyName = lName;
        name.givenName = fName;
        contact = contacts.create({
        "displayName": fName,
        "name": name,
        "phoneNumbers": [mobilePhone, homePhone],
        "emails": [workEmail, homeEmail]
        });
        contact.save(onSaveSuccess, onSaveError);

    }   
}

function onSaveSuccess(contact) {
    console.log("Contact with id=" + contact.id + " is saved!");
    AddContact(contact);
}

function onSaveError(error) {
    alert("Error saving contact: " + error.code);
    console.log("Error saving contact: " + error.code);
}

function AddContact(contact) {
    var contactID = contact.id;
    var db = dbNamespace.db;
    db.transaction(function(trans) {
        var met_desc = document.getElementById("description").value;

        trans.executeSql("INSERT INTO contacts(bbID, desc) VALUES (?,?)",
            [contactID, met_desc],
            function(trans, result) {
                // handle the success
                showDB();
            }, 
            function(trans, error) {
                 // handle the error
                 console.log(error)
            }
     )});
}

function getContacts() {

    var db = dbNamespace.db;
    db.transaction(function(trans) {
        trans.executeSql("SELECT * FROM contacts",
        [],
        function(trans, result) {

            if(result.rows.length == 0){
                //NO-OP
            } else {
                $( "#myImageList" ).empty();
                var BBID = "";
                var bbFName = "";
                var bbLName = "";
                var rowDesc = "";
                var newListItem = [];

                for(var i=0; i < result.rows.length; i++) {
                    
                    BBID = result.rows.item(i).bbID.toString(); 
                    
                    var contact = blackberry.pim.contacts.getContact(BBID);       

                    if (contact != null) {
                        
                        bbFName = contact.name.givenName;
                        bbLName = contact.name.familyName;
                        rowDesc = result.rows.item(i).desc;  

                    } else {
                        alert("There is no contact with id: " + BBID);
                    }

                    div= document.createElement("div"); 
                    div.setAttribute('id',BBID);
                    div.setAttribute('data-bb-type','item');
                    div.setAttribute('data-bb-title',bbFName + ' ' + bbLName);
                    div.setAttribute('data-bb-img','images/avatar.png');
                    div.setAttribute("onclick", "showInfo()" );
                    div.setAttribute("class", rowDesc );
                    div.innerHTML =  rowDesc;
                    newListItem.push(div);
                }
                document.getElementById('myImageList').refresh(newListItem);
            }
        }, 
        function(trans, error) {
           // handle the error
           alert("Error getting Data" + " " + error );
        }
    )});
}

function showDB(){
    getContacts();
    
    document.getElementById("contactInfo").style.display = "none";
    document.getElementById("tabTwo").style.display = "none";
    document.getElementById("tabOne").style.display = "inline";
}

function addDB(){
    document.getElementById("contactInfo").style.display = "none";
    document.getElementById("tabOne").style.display = "none";
    document.getElementById("tabTwo").style.display = "inline";
}

function showInfo(){

    bb.refresh();

    selectedItem = document.getElementById('myImageList').selected.id.toString();

    document.getElementById("tabOne").style.display = "none";
    document.getElementById("tabOne").style.display = "none";
    document.getElementById("contactInfo").style.display = "inline";

    var contact = blackberry.pim.contacts.getContact(selectedItem);

    if (contact != null){
        bbFName = contact.name.givenName;
        bbLName = contact.name.familyName;
        bbMPhone = contact.phoneNumbers[0].value;
        bbHPhone = contact.phoneNumbers[1].value;
        bbWemail = contact.emails[0].value;
        bbHemail = contact.emails[1].value;
        //bbPic = contact.photos.primaryPhoto;
        
        //document.getElementById("accountPic").data-bb-img = bbPic;
        document.getElementById("contact_fName").innerHTML = bbFName.toString();
        document.getElementById("contact_lName").innerHTML = bbLName.toString();
        document.getElementById("contact_pNum1").innerHTML = bbMPhone.toString();
        document.getElementById("contact_pNum2").innerHTML = bbHPhone.toString();
        document.getElementById("contact_email1").innerHTML = bbWemail.toString();
        document.getElementById("contact_email2").innerHTML = bbHemail.toString();
    } else {
        
    }

    var db = dbNamespace.db;
    db.transaction(function(trans) {
        trans.executeSql("SELECT * FROM contacts WHERE bbID =" + selectedItem +" ",
        [],
        function(trans, result) {
            if(result.rows.length == 0){
                alert("no contact with that id in our database");
                document.getElementById("contactPic").src = "images/avatar.png";
            } else {
                for(var i=0; i < result.rows.length; i++) {
                    var placeMet = result.rows.item(i).desc.toString();
                    document.getElementById("contact_met").innerHTML = placeMet;

                    var path = result.rows.item(i).profilePic.toString();
                    document.getElementById("contactPic").src = path;
                }
            }
        }, 
        function(trans, error) {
           // handle the error
           alert("Error getting Data" + " " + error );
        }
    )});
}

function invokeCameraCard() {
    var mode = blackberry.invoke.card.CAMERA_MODE_PHOTO;
    blackberry.invoke.card.invokeCamera(mode, function (path) {
            var filePath = 'file://' + path;
            var db = dbNamespace.db;
            db.transaction(function(trans) {
                trans.executeSql("UPDATE contacts SET profilePic='"+ filePath +"' WHERE bbID='"+ selectedItem +"';", 
                [], 
                function(trans, result) {
                    // handle  the success
                    showInfo();;
                }, 
                function(trans, error) {
                    // handle the error
                    alert("Error saving contact Picture: " + error.code);
                }
            )});
    },
    function (reason) {
        //alert("cancelled " + reason);
    },
    function (error) {
         if (error) {
             alert("invoke error "+ error);
          } else {
             console.log("invoke success " );
          }
    });
}