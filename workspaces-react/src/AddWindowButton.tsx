import { AddWindowButtonProps } from "@interopio/workspaces-ui-react";
import React, { useEffect, useRef } from "react";

// TODO forward the ref in the new version of workspaces-ui-react
const AddWindowButton: React.FC<AddWindowButtonProps> = ({ children, visible, showPopup, ...props }) => {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const onClick = (e: MouseEvent) => {
            e.stopPropagation();

            const rawBounds = ref.current!.getBoundingClientRect();

            showPopup({
                left: rawBounds.left,
                top: rawBounds.bottom,
                width: rawBounds.width,
                height: rawBounds.height,
            });
        }

        ref.current.addEventListener("click", onClick);
    }, [ref, showPopup]);
    return <li className={"lm_add_button"} ref={ref} {...props}>
        {children}
    </li>;
};

export default AddWindowButton;
