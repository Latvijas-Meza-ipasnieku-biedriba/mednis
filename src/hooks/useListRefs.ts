import * as React from "react";

export function useListRefs(listLength: number) {
    const listRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        listRefs.current = listRefs.current.slice(0, listLength);
    }, [listLength]);

    function createListRef(index: number) {
        return (ref: HTMLDivElement | null) => {
            listRefs.current[index] = ref;
        };
    }

    return {
        listRefs,
        createListRef,
    };
}
