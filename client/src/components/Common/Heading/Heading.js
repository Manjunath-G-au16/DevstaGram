import React from 'react';
import "./Heading.scss";

const Heading = (props) => {
    return (
        <>
            <div className="heading">
                <h1>{props.heading}</h1>
            </div>
            <div className="br"></div>
        </>
    )
}

export default Heading
