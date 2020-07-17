export interface IPageView {
    propPage?: number
    changePropPage?: (arg0:number)=>void
    children: Element[]
}
export interface IPage {
    className?: string
    children: Element[] | Element
}