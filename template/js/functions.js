var functions = {

    rbShowHide:function(rbClass, eID, status){
        // Element show or hide by default
        var e = document.getElementById(eID);
        e.style.display = ( status ) ? 'block' : 'none';
    
        // Check
        var rbs = document.querySelectorAll('.' + rbClass);
        rbs.forEach(rb => {
            rb.addEventListener("click", function(){ 
                if( rb.value == 1 ){
                    e.style.display = 'block';
                }else{
                    e.style.display = 'none';
                }
            });
        });

        e.scrollIntoView();
    },
    
    cbShowHide:function(cbClass, eID, status){
        var e = document.getElementById(eID);
        // Element show or hide by default
        e.style.display = ( status ) ? 'block' : 'none';
    
        function isAnyChecked( cbs ){
            var checkedFlag = false;
            cbs.forEach(cb => {
                if (cb.checked) {
                    checkedFlag = true;
                }
            });
            return checkedFlag;
        }
    
        var cbs = document.querySelectorAll('.' + cbClass);
    
        cbs.forEach(cb => {
            cb.addEventListener("click", function(){ 
                if(isAnyChecked(cbs)){
                    e.style.display = 'block';
                }else{
                    e.style.display = 'none';
                }
            });
        });

        e.scrollIntoView();
        
    }
    
}