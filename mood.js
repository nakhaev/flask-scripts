// Find CRF name, subject name on the page
function isCrf(crf) {
        try {
              crf_found = inString(crf, $('.first_level_header').text());
            } catch(e) {
              crf_found = false;
        }
return crf_found
}
function getDbname() {

var p = window.location.pathname.substr(1,40);
var l= p.indexOf('/');
return p.substr(0,l);

}
function getSubjectId() {
// Get Subject Id on the page and store
txt  = $('.first_level_header').text();
var i  = txt.indexOf('Subject ID:');
var sid = txt.substr(i+12,20).trim();
return sid;
}
function inString(str1,str2) {
    // Test if str1 is in str2 and return true or false
        var i = str2.indexOf(str1);
        if( i == -1) {
                found = false;
            } else {
                found = true;
        }
        return found;
}

function randomizeUser() {
    let r = Math.floor(Math.random() * 1000);
    $('#input1003').val(r); //  Randomize number field
    $('#input1003').attr('readonly', true);
    $('#input1004').val('RL'+r); // Patient kit number
    $('#input1004').attr('readonly', true);
}


function clearRandoFields() {
    $('#input1003').val(''); //  enrollment number field
    $('#input1004').val(''); //  enrollment number field
    $('#input1005').val(''); //  enrollment number field
}


$(document).ready (function ($) {
// Randomize/enroll eligible subjects from the EDC   #ENROLLMENT_ELIGIBLE
  $("input:radio[name=input1001]").click(function() {
  // Make a click function for save, save and next user click events
        var cf = $(this).val();
        if (cf == '1') {
            randomizeUser();
        } else {
            clearRandoFields();
        }
  });

});
