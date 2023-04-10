import React from 'react';

const ScrollToTop = () => {

    const [state, setState] = React.useState({
        is_visible: false
    });

    React.useEffect(()=>{
        document.addEventListener('scroll', onScroll);
        return ()=>document.removeEventListener('scroll', onScroll);
    })
    
    const onScroll =  (e: Event) => {
        toggleVisibility();
    }

    const toggleVisibility = () => {
        if (window.pageYOffset > 600) {
            setState({
                is_visible: true
            });
        } else {
            setState({
                is_visible: false
            });
        }
    }

    const scrollToTop = ()=> {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div id="scroll-to-top" className="init">
            {state.is_visible && (
                <div onClick={() => scrollToTop()}>
                    <i className=""></i>
                </div>
            )}
        </div>
    );
}


export default ScrollToTop