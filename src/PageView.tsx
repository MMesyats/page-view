import React,{useRef,useState,useEffect} from 'react'
import { IPageView } from '..';

const TRANSITION = 600;

const PageView:React.FC<IPageView> = ({propPage,children=[]}):JSX.Element => {
    const pageViewElement = useRef<any>();
    const [currentPage,setCurrentPage] = useState<number>(0);
    const [height, setHeight] = useState<number>(window.innerHeight);
    const [changing, setChanging] = useState<boolean>(false);

    const changePage:(page:number)=>void = (page) => 
    {
        setCurrentPage(page)
    }
   
    const handleScroll:React.EventHandler<any> = ({deltaY}) => 
    {
        if(!changing)
        {
            setChanging(true)
            if(deltaY > 40 && currentPage <= children.length - 2) 
              changePage(currentPage+1)
            else if(deltaY < -40 && currentPage > 0)
              changePage(currentPage-1)
            setTimeout(()=>{setChanging(false)},TRANSITION)
        }
    }
    const handleResize = () => {
        setHeight(window.innerHeight);

    }

    const handleDrag = () => 
    {
        let startY =0;
        pageViewElement.current.addEventListener('dragstart',({screenY}:any)=>{
            startY = screenY
            pageViewElement.current.style.transition=`none`;
            return false;
        },{passive:true})
        pageViewElement.current.addEventListener('drag',({screenY}:any)=>{
            if(height*currentPage+startY-screenY>0 && height*currentPage+startY-screenY<height*2)
                pageViewElement.current.style.transform=`translateY(-${height*currentPage+startY-screenY}px)`;
            return false;
        },{passive:true});
        pageViewElement.current.addEventListener('dragend',({screenY}:any)=>{
            const delta = startY-screenY;
            pageViewElement.current.style.transition=`ease-out transform ${TRANSITION}ms`;
            if(!changing)
            {
                setChanging(true)
                if(delta > 100 && currentPage <= 1) 
                  changePage(currentPage+1)
                else if(delta < -100 && currentPage > 0)
                  changePage(currentPage-1)
                setTimeout(()=>{setChanging(false)},TRANSITION)
            }
            return false;
        },{passive:true})
    }

    const handleTouchEvents:() => VoidFunction   = () => 
    {
        let startY =0;
        const handleTouchStart = ({touches}:any) => {
            const {screenY,pageY} = touches[0]
            startY = screenY;
            pageViewElement.current.style.transition=`none`;
        }
        const handleTouch = ({touches}:any) => 
        {
                const {screenY} = touches[0];
                if(height*currentPage+startY-screenY>0 && height*currentPage+startY-screenY<height*2)
                    pageViewElement.current.style.transform=`translateY(-${height*currentPage+startY-screenY}px)`;
        }
        const handleTouchEnd = ({changedTouches})=>{
            const {screenY} = changedTouches[0]
            const delta = startY-screenY;
            pageViewElement.current.style.transition=`ease-out transform ${TRANSITION}ms`;
            if(!changing)
            {
                setChanging(true)
                if(delta > 40 && currentPage <= 1) 
                  changePage(currentPage+1)
                else if(delta < -40 && currentPage > 0)
                  changePage(currentPage-1)
                setTimeout(()=>{setChanging(false)},TRANSITION)
            }
        }
        pageViewElement.current.addEventListener('touchstart',handleTouchStart,{passive:true})
        pageViewElement.current.addEventListener('touchmove',handleTouch,{passive:true})
        pageViewElement.current.addEventListener('touchend',handleTouchEnd,{passive:true})
        return () =>
            {
                pageViewElement.current.removeEventListener('touchstart',handleTouchStart)
                pageViewElement.current.removeEventListener('touchmove',handleTouch)
                pageViewElement.current.removeEventListener('touchend',handleTouchEnd)
            }
    }
  
    useEffect(() => {
        
        window.addEventListener('resize',handleResize)
        pageViewElement.current.addEventListener('wheel',handleScroll,{passive:true})
        const cleanupTouchEvents = handleTouchEvents()
        handleDrag()
        return () => {
            window.removeEventListener('resize',handleResize);
            pageViewElement.current.removeEventListener('wheel',handleScroll)
            cleanupTouchEvents();
        }
    }, [currentPage,changing,pageViewElement])
    return (
        <div 
        ref = {pageViewElement}
        style={
            {
                width:'100vw',
                height:`${height}px`,
                transform: `translateY(-${height*currentPage}px)`,
                transition: `ease-out transform ${TRANSITION}ms`,
                userSelect: 'all'
            }
        }
        
        >
            {children}
        </div>
    )
}

export default PageView;
