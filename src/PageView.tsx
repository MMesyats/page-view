import React,{useRef,useState,useEffect} from 'react'
import { IPageView } from '..';

const TRANSITION = 600;

const PageView:React.FC<IPageView> = ({propPage,changePropPage,children=[]}):JSX.Element => {
    const pageViewElement = useRef<any>();
    const [currentPage,setCurrentPage] = useState<number>(0);
    const [height, setHeight] = useState<number>();
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
        pageViewElement.current.style.height= `${height}px`
        setHeight(window.innerHeight);
    }

    const handleTouchEvents:() => VoidFunction   = () => 
    {
        let startY =0;
        const handleTouchStart = ({touches}:any) => {
            const {screenY,pageY} = touches[0]
            startY = screenY;
            if(!changing)
                pageViewElement.current.style.transition=`none`;
        }
        const handleTouch = ({touches}:any) => 
        {
                const {screenY} = touches[0];
                const movementDifference =  height*currentPage+startY-screenY
                if(!changing && movementDifference>0 && movementDifference<(height*(children.length-1)))
                    pageViewElement.current.style.transform=`translateY(-${movementDifference}px)`;
        }
        const handleTouchEnd = ({changedTouches})=>{
            const {screenY} = changedTouches[0]
            const delta = startY-screenY;
            pageViewElement.current.style.transition=`ease-out transform ${TRANSITION}ms`;
            if(!changing)
            {
                setChanging(true)
                if(delta > 40 && currentPage <= children.length - 2) 
                  changePage(currentPage+1)
                else if(delta < -40 && currentPage > 0)
                  changePage(currentPage-1)
                else 
                {
                  pageViewElement.current.style.transform=`translateY(-${height*currentPage}px)`;
                }
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
        if(typeof window!=='undefined')
        {
            handleResize()
            window.addEventListener('resize',handleResize)
        }
        pageViewElement.current.addEventListener('wheel',handleScroll,{passive:true})
        const cleanupTouchEvents = handleTouchEvents()
        return () => {
            if(typeof window!=='undefined')
                window.removeEventListener('resize',handleResize);
            pageViewElement.current.removeEventListener('wheel',handleScroll)
            cleanupTouchEvents();
        }
    }, [currentPage,changing,children])
    useEffect(()=>
    {
        setCurrentPage(propPage)
        pageViewElement.current.style.transfrom= `translateY(-${height*propPage}px)`
    },[propPage])
    useEffect(()=>
    {
        changePropPage(currentPage)
    },[currentPage])
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
