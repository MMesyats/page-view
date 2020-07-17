export interface IPageView {
    propPage?: number
    changePropPage?: (arg0:number)=>void
    children: IPage[]
}
export interface IPage {
    className?: string
    children: JSX.Element[] | JSX.Element
}