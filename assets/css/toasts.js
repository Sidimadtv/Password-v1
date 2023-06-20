// Show toast.
function toasts(id, text) {
    $("toasts > toast#"+id+" p#input").text(text);
    $("toasts > toast#"+id).show();
    $("toasts").show();

    setTimeout(() => {
        $("toasts > toast#"+id).hide();
        $("toasts").hide();
    }, 5000);
}