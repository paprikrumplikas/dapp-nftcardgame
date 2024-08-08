import React from 'react';

// higher order component (can wrap another component)
import { PageHOC } from "../components";

const CreateBattle = () => {
    return (
        <div>
            {/* div can be completely empty, but we can also add additional elements */}
            <h1 className='text-white text-xl'>Hello from CreateBattle!</h1>
        </div>
    );
};

// PageOHC higher order component wrap Home component for reusability
// @note how thie HOC can be modified: by passing props, here:
// 1. a component (that can have custom contect/styling)
// 2. an empty react fragment with text as title
export default PageHOC(
    CreateBattle,
    <>Create <br /> a new battle.</>,
    <>Create your own battle and wait for other players to join you.</>
);
