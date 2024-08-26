import { useEffect, useState } from "react";
import IOBrowser from "@interopio/browser";

export const useIOConnectInit = () => {
    const [io, setIO] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            const io = await IOBrowser();

            setIO(io);
        };

        initialize();
    }, []);

    return io;
};
