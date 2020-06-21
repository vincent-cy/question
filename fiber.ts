function mountChildFibers (
    workInProgress,
    current,
    nextChildren,
    renderExpirationTime
){

}

export function reconcileChildren(
    current: Fiber | null,
    workInProgress: Fiber,
    nextChildren: any,
    renderExpirationTime: ExpirationTime
){
    if(current === null){
        workInProgress.child = mountChildFibers(
            workInProgress,
            null,
            nextChildren,
            renderExpirationTime
        );
    }else{
        // 进行diff 入口
        workInProgress.child = reconciLeChildFibers(
            workInProgress,
            current.child,
            nextChildren,
            renderExpirationTime
        )
    }
}

function reconciLeChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    nextChild: any,
    expirationTime: ExpirationTime
) : Fiber | null {
    // 主要diff逻辑
}