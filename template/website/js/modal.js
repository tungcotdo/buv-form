        // Modal
        function showModal(modal, iconShow, iconClose){

            if( iconShow ){
                iconShow.onclick = () => {
                    document.querySelectorAll('.modal, .modal__icon-close').forEach((e) => {
                        e.style.display = "none";
                    });

                    document.querySelectorAll('.modal__icon-show').forEach((e) => {
                        e.style.display = "block";
                    });
        
                    modal.style.display = "block";
                    iconShow.style.display = "none";
                    iconClose.style.display = "block";
                }
            }

            if( iconClose ){
                iconClose.onclick = () => {
                    modal.style.display = "none";
                    iconShow.style.display = "block";
                    iconClose.style.display = "none";
                }
            }

        }

        const modalSearch = document.getElementById('modal__search');

        // pc search modal
        const pcIconShowSearchModal = document.getElementById('pc-header-modal__icon-search');
        const pcIconCloseSearchModal = document.getElementById('pc-header-modal__icon-close--search');
        showModal( modalSearch, pcIconShowSearchModal, pcIconCloseSearchModal );

        // mb search modal
        const mbIconShowSearchModal = document.getElementById('mb-header-modal__icon-search');
        const mbIconCloseSearchModal = document.getElementById('mb-header-modal__icon-close--search');
        showModal( modalSearch, mbIconShowSearchModal, mbIconCloseSearchModal );

        // mb hamberger navigation
        const modalNavigation = document.getElementById('modal__navigation');
        const mbIconShowNavigationModal = document.getElementById('mb-header-modal__icon-hamberger');
        const mbIconCloseNavigationModal = document.getElementById('mb-header-modal__icon-close--hamberger');
        showModal( modalNavigation, mbIconShowNavigationModal, mbIconCloseNavigationModal );