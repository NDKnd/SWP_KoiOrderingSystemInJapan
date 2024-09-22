

function Manager() {

    const token = localStorage.getItem("token");

    return (
        <div>
            <h1>{token}</h1>
        </div>
    )
}

export default Manager;