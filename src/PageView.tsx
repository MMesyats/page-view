import React, { useRef, useState, useEffect } from 'react'
import { IPageView } from '..'

const TRANSITION = 600

const PageView: React.FC<IPageView> = ({ propPage, changePropPage, children = [] }): JSX.Element => {
  const pageViewElement = useRef<any>()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [height, setHeight] = useState<number>()
  const [changing, setChanging] = useState<boolean>(false)

  const handleScroll: React.EventHandler<any> = ({ deltaY }) => {
    if (!changing) {
      setChanging(true)
      if (deltaY > 40 && height * (currentPage + 1) < pageViewElement.current.scrollHeight) setCurrentPage(currentPage + 1)
      else if (deltaY < -40 && currentPage > 0) setCurrentPage(currentPage - 1)
      setTimeout(() => {
        setChanging(false)
      }, TRANSITION)
    }
  }
  const handleResize = () => {
    pageViewElement.current.style.height = `${height}px`
    setHeight(window.innerHeight)
  }

  const handleTouchEvents: () => VoidFunction = () => {
    let startY = 0
    const handleTouchStart = ({ touches }: any) => {
      const { screenY, pageY } = touches[0]
      if (!changing) startY = screenY
      pageViewElement.current.style.transition = `none`
    }
    const handleTouch = (e: any) => {
      const { screenY } = e.touches[0]
      if (!changing) {
        const movementDifference = height * currentPage + startY - screenY
        if (movementDifference > 0 && movementDifference < pageViewElement.current.scrollHeight)
          pageViewElement.current.style.transform = `translateY(-${movementDifference}px)`
      }
    }
    const handleTouchEnd = ({ changedTouches }) => {
      const { screenY } = changedTouches[0]
      if (!changing) {
        const delta = startY - screenY
        setChanging(true)
        pageViewElement.current.style.transition = `ease-out transform ${TRANSITION}ms`
        if (delta > 40 && height * (currentPage + 1) < pageViewElement.current.scrollHeight) setCurrentPage(currentPage + 1)
        else if (delta < -40 && currentPage > 0) setCurrentPage(currentPage - 1)
        else {
          pageViewElement.current.style.transform = `translateY(-${height * currentPage}px)`
        }
        setTimeout(() => {
          setChanging(false)
        }, TRANSITION)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchmove', handleTouch, { passive: true })
      window.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
      window.addEventListener('wheel', handleScroll, { passive: true })
    }
    const cleanupTouchEvents = handleTouchEvents()
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('wheel', handleScroll)
        cleanupTouchEvents()
      }
    }
  }, [currentPage, changing, children])
  useEffect(() => {
    setCurrentPage(propPage)
    pageViewElement.current.style.transfrom = `translateY(-${height * propPage}px)`
  }, [propPage])
  useEffect(() => {
    changePropPage(currentPage)
  }, [currentPage])
  return (
    <div
      ref={pageViewElement}
      style={{
        width: '100%',
        height: `${height}px`,
        maxHeight: '100%',
        overflow: 'auto',
        transform: `translateY(-${height * currentPage}px)`,
        transition: `ease-out transform ${TRANSITION}ms`
      }}
    >
      {children}
    </div>
  )
}

export default PageView
