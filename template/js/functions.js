var functions = {

    isCheckedbox: function(cbs){
        var checkedFlag = false;
        cbs.forEach(cb => {
            if (cb.checked) {
                checkedFlag = true;
            }
        });
        return checkedFlag;
    },

    rbShowHide:function({rbClass, eID, status}){
        // Element show or hide by default
        var e = document.getElementById(eID);
        e.style.display = ( status ) ? 'block' : 'none';
    
        // Check
        var rbs = document.querySelectorAll('.' + rbClass);
        rbs.forEach(rb => {
            rb.addEventListener("click", function(){ 
                e.style.display = ( rb.value == 1 ) ? 'block' : 'none';
            });
        });

        e.scrollIntoView();
    },
    
    cbShowHide:function({cbClass, eID, status}){
        var e = document.getElementById(eID);
        // Element show or hide by default
        e.style.display = ( status ) ? 'block' : 'none';
    
        var cbs = document.querySelectorAll('.' + cbClass);
    
        cbs.forEach(cb => {
            cb.addEventListener("click", function(){ 
                e.style.display = functions.isCheckedbox(cbs) ? 'block' : 'none';
            });
        });

        e.scrollIntoView();
        
    }
    
}