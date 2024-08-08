//The index.js file is not strictly necessary, but it's a helpful convention that improves code organization, reduces the likelihood of import path errors, and makes your codebase easier to maintain and refactor. In larger projects, these benefits become even more pronounced.

//By using an index.js file, you can group related exports together, allowing for cleaner and more manageable imports elsewhere in your code. Instead of importing each module individually, you can import everything from the directory at once.


import PageHOC from "./PageHOC";

export {
    PageHOC
}