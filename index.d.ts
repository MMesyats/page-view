export interface IPageView {
    propPage?: number
    changePropPage?: (arg0:number)=>void
    children: React.ReactNode
}
export interface IPage {
    className?: string
    children: React.ReactNode
}