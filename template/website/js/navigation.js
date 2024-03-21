// mb navigation
// dropdown click
document.querySelectorAll('.mb-header-nav__item--right').forEach((e) => {
    e.onclick = (event) =>{
        event.preventDefault()
        document.querySelectorAll('.mb-header-nav__item').forEach( menuItem => {
            menuItem.style.display = 'none';
        });
        e.closest('.mb-header__nav-group').querySelector('.mb-header__sub-nav').style.display = "block";
    }
});

document.querySelectorAll('.mb-header-sub-nav__item--right').forEach((e) => {
    e.onclick = (event) =>{
        event.preventDefault()
        document.querySelectorAll('.mb-header-sub-nav__item').forEach( menuItem => {
            menuItem.style.display = 'none';
        });
        e.closest('.mb-header__sub-nav-group').querySelector('.mb-header__sub-nav-right').style.display = "block";
    }
});