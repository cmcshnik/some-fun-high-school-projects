onload = () => {
    let py = document.getElementById("py");
    let py_text = document.getElementById("py_text");

    py.addEventListener('mouseenter', e => {
        py_text.style.transitionDelay = "0.5s";
        py_text.style.transition = "all 1s";
    });
    py.addEventListener('mouseleave', e => {
        py_text.style.transitionDelay = "0.0s";
        py_text.style.transition = "all 0.1s";
    });


    let go = document.getElementById("go");
    let go_text = document.getElementById("go_text");

    go.addEventListener('mouseenter', e => {
        go_text.style.transitionDelay = "0.5s";
        go_text.style.transition = "all 1s";
    });
    go.addEventListener('mouseleave', e => {
        go_text.style.transitionDelay = "0.0s";
        go_text.style.transition = "all 0.1s";
    });


    let js = document.getElementById("js");
    let js_text = document.getElementById("js_text");

    js.addEventListener('mouseenter', e => {
        js_text.style.transitionDelay = "0.5s";
        js_text.style.transition = "all 1s";
    });
    js.addEventListener('mouseleave', e => {
        js_text.style.transitionDelay = "0.0s";
        js_text.style.transition = "all 0.1s";
    });
}