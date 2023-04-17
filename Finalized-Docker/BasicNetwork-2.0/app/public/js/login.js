function hideLoadingDiv() {
    // setTimeout(function () {
    //     document.getElementById('success-alerting').classList.add('hidden');
    // }, 2000);
    //setTimeout(function () {
    //    document.getElementById('updateddb').classList.add('hidden');
    //}, 2000);
    const boxes = document.getElementsByClassName('a1');
    console.log(boxes.length);
    for (const box of boxes)
    {
        setTimeout(function () {
            box.classList.add('hidden');
        }, 2000);
    }
}
$(document).ready(function () {
    console.log("document is loaded");
    hideLoadingDiv();

});

