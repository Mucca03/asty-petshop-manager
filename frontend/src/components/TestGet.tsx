import {getClient} from "../services/index.ts";

const TestGet = () => {


    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        getClient(1);
    };

    return (
        <button onClick={(e) => handleSubmit(e)}>
            Get User
        </button>
        )
}

export default TestGet
