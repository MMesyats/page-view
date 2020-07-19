import React, { useRef, useState, useLayoutEffect } from 'react'
import { IPageView } from '../index.d.ts'

const TRANSITION = 600

const PageView: React.FC<IPageView> = ({ propPage, changePropPage, children = [] }): JSX.Element => {
  const pageViewElement = useRef<any>()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [changing, setChanging] = useState<boolean>(false)

  const handleScroll: React.EventHandler<any> = e => {
    const { deltaY } = e
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
    const handleTouchStart = ({ touches }) => {
      const { screenY } = touches[0]
      startY = screenY
      if (!changing) {
        pageViewElement.current.style.transition = `none`
      }
    }
    const handleTouch = e => {
      e.preventDefault()
      const { screenY } = e.touches[0]
      if (!changing) {
        const movementDifference = height * currentPage + startY - screenY
        if (movementDifference > 0 && height * (currentPage + 1) + startY - screenY < pageViewElement.current.scrollHeight)
          pageViewElement.current.style.transform = `translateY(-${movementDifference}px)`
      } else {
        startY = screenY
      }
    }
    const handleTouchEnd = ({ changedTouches }) => {
      const { screenY } = changedTouches[0]
      if (!changing) {
        const delta = startY - screenY
        setChanging(true)
        pageViewElement.current.style.transition = `ease-out transform ${TRANSITION}ms`
        if (delta > 100 && height * (currentPage + 1) < pageViewElement.current.scrollHeight) setCurrentPage(currentPage + 1)
        else if (delta < -100 && currentPage > 0) setCurrentPage(currentPage - 1)
        else {
          pageViewElement.current.style.transform = `translateY(-${height * currentPage}px)`
        }
        setTimeout(() => {
          setChanging(false)
        }, TRANSITION)
      } else {
        startY = screenY
      }
    }
    pageViewElement.current.addEventListener('touchstart', handleTouchStart, { passive: true })
    pageViewElement.current.addEventListener('touchmove', handleTouch, { passive: false })
    pageViewElement.current.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      pageViewElement.current.removeEventListener('touchstart', handleTouchStart)
      pageViewElement.current.removeEventListener('touchmove', handleTouch)
      pageViewElement.current.removeEventListener('touchend', handleTouchEnd)
    }
  }

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
      window.addEventListener('mousewheel', handleScroll, { passive: true })
    }
    const cleanupTouchEvents = handleTouchEvents()
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousewheel', handleScroll)
      }
      cleanupTouchEvents()
    }
  }, [currentPage, changing, children])
  useLayoutEffect(() => {
    setCurrentPage(propPage)
    pageViewElement.current.style.transfrom = `translateY(-${height * propPage}px)`
  }, [propPage])
  useLayoutEffect(() => {
    changePropPage(currentPage)
  }, [currentPage])
  return (
    <div
      ref={pageViewElement}
      style={{
        width: '100%',
        height: `${height}px`,
        maxHeight: '100%',
        position: 'absolute',
        overflow: 'visible',
        transform: `translateY(-${height * currentPage}px)`,
        transition: `ease-out transform ${TRANSITION}ms`
      }}
    >
      {children}
    </div>
  )
}

export default PageView
