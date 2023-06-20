// Hide all popups.
$("popups > popup").hide();
$("popups").hide();

// Function for showing/hiding a popup.
function popups(action, id) {
    if (action === 0) {
        $("popups > popup").hide();
        $("popups > popup#"+id).show();
        $("popups").show();
    } else {
        $("popups > popup").hide();
        $("popups").hide();
    }
}

// Hide popup on cancel click.
$("popups popup button#hidePopup").click(() => {
    popups();
});

// Check for save then show save popup.
function addPasswordPopup() {
    saveCheck().then(promise => {
        if (promise) {
            popups(0, "confirmSave");
        } else {
            popups(0, "addPassword");
        }
    })
}




// ----- Custom popup JS -----

// Create new password wrapper on input.
$("popups popup#addPassword button#submit").click(() => {
    var domain = $("popups popup#addPassword input#domain").val(); $("popups popup#addPassword input#domain").val("");
    var username = $("popups popup#addPassword input#username").val(); $("popups popup#addPassword input#username").val("");
    var password = $("popups popup#addPassword input#password").val(); $("popups popup#addPassword input#password").val("");
    
    passwordAdd(domain, username, password);
    clickEventPassword();
    saveCheck();

    popups();
});

// Create new password wrapper on input.
$("popups popup#addPassword button#submit2").click(() => {
    var domain = $("popups popup#addPassword input#domain").val(); $("popups popup#addPassword input#domain").val("");
    var username = $("popups popup#addPassword input#username").val(); $("popups popup#addPassword input#username").val("");
    var password = $("popups popup#addPassword input#password").val(); $("popups popup#addPassword input#password").val("");
    
    passwordAdd(domain, username, password);
    clickEventPassword();
    saveCheck();
});

// Open import passwords popup.
$("popups > popup#settings button#import").click(function () {
    popups(0, 'import-passwords');
});

// Copy passwords to clipboard.
$("popups > popup#settings button#export").click(function () {
    navigator.clipboard.writeText(localStorage.getItem('passwords'));
    toasts('no-img', 'Copied passwords to clipboard.');
});

// Import passwords functionality.
$("popups > popup#import-passwords button#submit").click(function () {
    try {
        var passwords = JSON.parse($("popups > popup#import-passwords input").val());
        $("popups > popup#import-passwords input").val('');
        if ($(this).attr('data-type') === 'replace') {
            passwordRemove();
        };
        $.each(passwords, function (key, value) {
            passwordAdd(value.domain, value.username, value.password);
        });
        popups();
        saveCheck();
    } catch (error) {
        toasts('no-img', 'An error occured.');
    }
});

$("popups > popup#settings .section#theme input").click(function() {
    theme = this.id; if (theme === "dark") {
        $("body").addClass("dark");
    } else {
        $("body").removeClass("dark");
    }

    json = {"theme": theme};
    localStorage.setItem('user_settings', JSON.stringify(json));
});