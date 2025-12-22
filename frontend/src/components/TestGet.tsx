import {useEffect} from "react";
import {getData} from "./index.ts";

const TestGet = () => {

    useEffect(() => {
        getData(1);
    }, []);

    return (
        <div>Test</div>
    )
}
export default TestGet
