// All click events in a password wrapper.
function clickEventPassword() {
    // Disable all click events on side buttons in a password wrapper.
    $("body > main > .password-wrapper .input-wrapper .side").off('click');

    // Function to show/hide the password.
    document.querySelectorAll("body > main > .password-wrapper div#passshow").forEach(elem => {elem.addEventListener("click", e => {
        if (e.target.tagName === "IMG") {
            target = e.target.parentNode.parentNode;
        } else {target = e.target};

        if (target.classList.contains("enabled")) {
            target.querySelector("#open").style.display = "block";
            target.querySelector("#closed").style.display = "none";
            target.parentNode.querySelector("input").setAttribute("type", "password");
            target.classList.remove("enabled");
        } else {
            target.querySelector("#closed").style.display = "block";
            target.querySelector("#open").style.display = "none";
            target.parentNode.querySelector("input").setAttribute("type", "text");
            target.classList.add("enabled");
        }
    })});

    // Function for removing a password wrapper.
    $("body > main > .password-wrapper #delete").click(function() {
        $(this).parent().remove();
        saveCheck();
    });

    // Function to copy value from adjacent input.
    $("body > main > .password-wrapper .input-wrapper .side#copy").click(function() {
        var copy = this.parentNode.querySelector("input").value;
        navigator.clipboard.writeText(copy);
        toasts('no-img', 'Copied to clipboard.');
    });
};

// Search on input in searchbar.
function search() {
    var password_wrappers = document.querySelectorAll("body > main > .password-wrapper");
    $("body > main > .password-wrapper").css("display", "none");
    var search_input = $("body > main > .search input").val().toLowerCase();
    password_wrappers.forEach(wrapper => {
        domain = wrapper.querySelector("input#domain").value.toLowerCase();
        username = wrapper.querySelector("input#username").value.toLowerCase();

        if (domain.includes(search_input) || username.includes(search_input)) {
            wrapper.style.display = "flex";
        }
    });
};

// Check if something changed and display a save button.
async function saveCheck() {
    var password_wrappers = document.querySelectorAll("body > main > .password-wrapper");
    var changed = false;
    var passwords = JSON.parse(localStorage.getItem("passwords"));

    if (passwords.length !== password_wrappers.length) {
        changed = true;
    } else {
        for (let i = 0; i < passwords.length; i++) {
            if (passwords[i].domain !== password_wrappers[i].querySelector("input#domain").value || passwords[i].username !== password_wrappers[i].querySelector("input#username").value || passwords[i].password !== password_wrappers[i].querySelector("input#password").value) {
                changed = true;
            }
        }
    }
    
    if (changed === false) {
        $("body > main > .search button").css("display", "none");
        return false;
    } else {
        $("body > main > .search button").css("display", "block");
        return true;
    }
};

// Save the passwords in local storage.
function saveJson() {
    var jsonObj = [];
    var password_wrappers = document.querySelectorAll("body > main > .password-wrapper");
    password_wrappers.forEach(wrapper => {
        jsonObj.push({
            domain: wrapper.querySelector("input#domain").value,
            username: wrapper.querySelector("input#username").value,
            password: wrapper.querySelector("input#password").value
        })
    });

    localStorage.setItem('passwords', JSON.stringify(jsonObj));
    saveCheck();


 const filename = "My_Passwords_Backup-" ;
    const blob = new Blob({ type: "text/plain" });

    // Create a temporary <a> element to trigger the download
    const anchor = document.createElement("a");
    anchor.download = passwords;
    anchor.href = URL.createObjectURL(blob);

    anchor.target = "_blank"; // Optional: Open the download link in a new tab or window
    anchor.click();

    // Clean up
    URL.revokeObjectURL(anchor.href);



}

// Password function for adding/removing passwords.
function passwordRemove() {
    $("body > main > *:not(.search)").remove();
    saveCheck();
};
function passwordAdd(domain, username, password) {
    $("body > main").append('<div class="password-wrapper"><div class="wrapper"><div class="input-wrapper"><p>Domain:</p><input type="text" id="domain" onchange="saveCheck()" onkeypress="saveCheck()" oninput="saveCheck()" value="'+domain+'"></div><div class="input-wrapper"><p>Username:</p><input type="text" id="username" onchange="saveCheck()" onkeypress="saveCheck()" oninput="saveCheck()" value="'+username+'"><div class="side" id="copy"><img src="./assets/img/copy_full.svg" alt="copy password" class="light"><img src="./assets/img/copy_full-white.svg" alt="copy" class="dark"></div></div><div class="input-wrapper"><p>Password:</p><input type="password" id="password" onchange="saveCheck()" onkeypress="saveCheck()" oninput="saveCheck()" value="'+password+'"><div class="side" id="passshow"><div id="open"><img src="./assets/img/visibility_full.svg" alt="show" class="light"><img src="./assets/img/visibility_full-white.svg" alt="show" class="dark"></div><div id="closed" style="display: none;"><img src="./assets/img/visibility_off_full.svg" alt="show" class="light"><img src="./assets/img/visibility_off_full-white.svg" alt="show" class="dark"></div></div><div class="side" id="copy"><img src="./assets/img/copy_full.svg" alt="copy password" class="light"><img src="./assets/img/copy_full-white.svg" alt="copy" class="dark"></div></div></div><div id="delete"><img src="./assets/img/delete_full.svg" alt="delete"></div></div>');
}

// Getting all passwords and displaying them.
if (localStorage.getItem("passwords") !== null) {
    var passwords = JSON.parse(localStorage.getItem("passwords"));
    $.each(passwords, function (key, value) {
        passwordAdd(value.domain, value.username, value.password);
    });
    clickEventPassword();
} else {
    localStorage.setItem('passwords', '[]');
};

// Show/hide background for searchbar.
document.onscroll = e => {
    if (document.documentElement.scrollTop > 50) {
        $("body > .searchBack").css("top", "0");
    } else {
        $("body > .searchBack").css("top", "-51px");
    }
}

// Checking for user settings.
if (localStorage.getItem("user_settings") !== null) {
    var user_settings = JSON.parse(localStorage.getItem("user_settings"));

    if (user_settings.theme === "dark") {
        $("body").addClass("dark");
        $("popups > popup#settings .section#theme #dark").attr("checked", "");
    } else {
        $("popups > popup#settings .section#theme #light").attr("checked", "");
    }
} else {
    localStorage.setItem("user_settings", "{}");
}

// Update check
var version = "1.2";
$.ajaxSetup({ cache: false });
$.getJSON('http://wbrk.ddns.net/res/library/json/passwordmanager.json', function (data) {
    if (parseInt(version) + 1 <= data.version) {
        popups(0, 'update-required');
    } else if (version !== data.version) {
        popups(0, 'update');
        $("header a#update-button").show();
    }
});
$.ajaxSetup({ cache: true });