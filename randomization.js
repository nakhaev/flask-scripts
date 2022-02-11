let kit_id = null;
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
    let p = window.location.pathname.substr(1,40);
    let l= p.indexOf('/');
    return p.substr(0,l);

}

function getSubjectId() {
    // Get Subject Id on the page and store
    txt  = $('.first_level_header').text();
    let i  = txt.indexOf('Subject ID:');
    let sid = txt.substr(i+12,20).trim();
    return sid;
}

function inString(str1,str2) {
// Test if str1 is in str2 and return true or false
    let i = str2.indexOf(str1);
    if( i == -1) {
            found = false;
        } else {
            found = true;
    }
    return found;
}

function prepareDate(date) {
    var _date = new Date(date);
    var offset = _date.getTimezoneOffset();
    _date = new Date(_date.getTime() - (offset*60*1000));
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var year = _date.getFullYear();
    var month = _date.getMonth();
    var day = _date.getDate();
    return {
        date: [day < 10 ? '0'+day : day, months[month], year].join('-'),
        time: _date.toISOString().split('T')[1].slice(0, 5)
    }
}

function setData(data) {
    let res = null;
    try {
        res = JSON.parse(data);
        kit_id = res && res.kit_id ? res.kit_id : null;
        $('#input1225').val(res && res.kitno ? res.kitno : ''); //  Randomize number field
        $('#input1225').attr('readonly', true);
        $('#input1224').val(kit_id); // Patient kit number
        $('#input1224').attr('readonly', true); // randomization_date
        $('#input1005').val(prepareDate(res.randomization_date).date); // randomization_date
        $('#input1005').attr('readonly', true);
    } catch(error) {
        console.log(data);
    }
}


function useRandomizationWithStratas(data) {
    let promise = new Promise((resolve, reject) => {
        fetch("http://local-api.flaskdata.io/features/flask/subjectfeatures/randomize-kits-with-stratification", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => { 
            //do something awesome that makes the world a better place
            resolve(response.text());
        })
        .catch(error => {
            reject(error.text());
        });
    });
    return promise;
}

function readRandomizationKit() {

    let data = {
        db_name: getDbname(),
        edc_subject_label: getSubjectId(),
        strata1: $('#input1222').parent().attr('id'),
        strata1_value: $('#input1222').val(),
        strata2: $('#input1223').parent().attr('id'),
        strata2_value: $('#input1223').val(),
        operation: "read"
    }

    useRandomizationWithStratas(data)
        .then(response => {
            setData(response);
        })
        .catch(error => {
            console.log('error', error);
        })
}


function clearRandoFields() {
    $('#input1225').val(''); //  enrollment number field
    $('#input1224').val(''); //  enrollment number field
    $('#input1005').val(''); //  enrollment number field
}

function randomizeUser() {
    if(kit_id) {
        let data = {
            db_name: getDbname(),
            edc_subject_label: getSubjectId(),
            operation: "randomize",
            kit_id: kit_id
        }
    
        useRandomizationWithStratas(data)
            .then(response => {
                let res = null;
                try {
                    res = JSON.parse(response);
                } catch(error) {
                    console.log(response);
                }
            })
            .catch(error => {
                console.log('error', error);
            })
    }
}

function changeKit() {
    if(kit_id) {
        let data = {
            db_name: getDbname(),
            edc_subject_label: getSubjectId(),
            strata1: $('#input1222').parent().attr('id'),
            strata1_value: $('#input1222').val(),
            strata2: $('#input1223').parent().attr('id'),
            strata2_value: $('#input1223').val(),
            operation: "change",
            kit_id: kit_id
        }
    
        useRandomizationWithStratas(data)
            .then(response => {
                setData(response);
            })
            .catch(error => {
                console.log('error', error);
            })
    }
}

$(document).ready (function ($) {
    // Randomize/enroll eligible subjects from the EDC   #ENROLLMENT_ELIGIBLE
    $("input:radio[name=input1001]").click(function() {
    // Make a click function for save, save and next user click events
        let cf = $(this).val();
        if (cf == '1') {
            readRandomizationKit();
        } else {
            clearRandoFields();
        }
    });
    $("input:button[name=submittedResume]").click(function() {
        if(kit_id) randomizeUser();
    });
    $("input:button[name=saveAndNext]").click(function() {
        if(kit_id) randomizeUser();
    });
    $("input:button[name=submittedExit]").click(function() {
        if(kit_id) clearRandoFields();
    });
    $("#input1222").change(function() {
        if(kit_id) {
            changeKit();
        } else {
            readRandomizationKit();
        }
    });
    $("#input1223").change(function() {
        if(kit_id) {
            changeKit();
        } else {
            readRandomizationKit();
        }
    });
});
