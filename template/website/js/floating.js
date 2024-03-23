window.addEventListener("scroll", function() {
    if (window.scrollY >= 300) {
        document.getElementById('floating__social').classList.add("show");
    }else{
        document.getElementById('floating__social').classList.remove("show");
    }
});