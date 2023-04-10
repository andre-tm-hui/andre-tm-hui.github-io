let selectedDevice = "";
let email = "";
const apiUrl = "https://us-central1-sustenato-verification.cloudfunctions.net/app";

$("#loading").hide();
$("#manage").hide();
$("#register").hide();
$("#unregister").hide();

function validateEmail(input) {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        $("#login-form").focus();
        return false;
  }
}

// Highlight the selected item in the table
$("#device-table tr").on("click", function() {
    if ($("#device-table").find("tr:first")[0] == this || 
        $(this).find("td:first").html() === "") {
        return;
    }
    $(this).addClass('selected').siblings().removeClass('selected');
    selectedDevice=$(this).find('td:first').html();
});

// Request a list of devices associated with the given email, and show it in the table
function updateDevices(form, callback) {
    $("#loading").show();
    $.get(
        apiUrl + `/users/${$("input#email").val()}/devices`            
    ).done(function(data) {
        for (let i = 0; i < 3; i++) {
            $(`#device-${i}`).html(i < data.length ? data[i] : "");
        }
        email = $("input#email").val();
        if (callback !== undefined) callback();
        $("#loading").hide();
    }).fail(function(xhr) {
        $("#email-err").html(xhr.responseText);
        $("#loading").hide();
    });
}
$("#login-form").on("submit", function(event) {
    updateDevices(this, function() {
        $("#login").addClass("hidden");
        $("#login").hide();
        $("#manage").show();
        $("#manage").removeClass("hidden");
    });
    event.preventDefault();
});

//       call /users/:email/register-device?deviceId=___
//       make the corresponding modal and form that pops up when the '+' button is pressed
$("#add-button").on("click", function() {
    $("#register").show();
    $("#register").removeClass("hidden");
})

$("#submit-register").on("click", function(event) {
    $("#loading").show();
    $.post(
        apiUrl + `/users/${email}/register-device?deviceId=${$("input#deviceId").val()}`
    ).done(function(data){
        $("#register").addClass("hidden");
        $("#register").hide();
        updateDevices();
        $("#loading").hide();
    }).fail(function(xhr) {
        $("#register-error").html(xhr.responseText);
        $("#loading").hide();
    });
    event.preventDefault();
});


//       call /users/:email/unregister-device?deviceId=___&licenseKey=___
//       make the corresponding modal and form that pops up when the '-' button is pressed
$("#remove-button").on("click", function() {
    if (selectedDevice === "") return;
    $("#unregister").show();
    $("#unregister").removeClass("hidden");
});

$("#submit-unregister").on("click", function(event) {
    $("#loading").show();
    $.ajax({
        url: apiUrl + `/users/${email}/unregister-device?deviceId=${selectedDevice}&licenseKey=${$("input#licenseKey").val()}`,
        type: "DELETE"
    }).done(function(data) {
        $("#unregister").addClass("hidden");
        $("#unregister").hide();
        $("#loading").hide();
        updateDevices();
        $("#device-table tr:first").removeClass('selected').siblings().removeClass('selected');
        selectedDevice = "";
    }).fail(function(xhr) {
        $("#unregister-error").html(xhr.responseText);
        $("#loading").hide();
    });
    event.preventDefault();
});

// TODO: call /users/:email/request-forgotten-keys
//       make a prompt underneath the table that sends the event
$("#request-keys").on("click", function(event) {
    if ($("#request-keys").html() !== "Click here to request your keys.") return;
    $("#loading").show();
    $.get(
        apiUrl + `/users/${email}/request-forgotten-keys`,
    ).done(function(data) {
        console.log(data);
        $("#request-keys-message").html("Email sent!");
        $("#loading").hide();
    }).fail(function(xhr) {
        console.log(xhr);
        $("#request-keys-message").html(xhr.responseText);
        $("#request-keys-message").addClass("err-text");
        $("#loading").hide();
    });
});

$(".click-to-close").on("click", function(event) {
    $(this).addClass("hidden");
    $(this).hide();
});
$(".click-to-close *").on("click", function(event) {
    event.stopPropagation();
});