// to shorten the address. We take only the first 5 and last 5 chars
// @custom

export const shortenAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return "N/A"; // Return a fallback value if the address is invalid
    }

    if (address.length <= 10) {
        return address; // Return the address as is if it's too short to shorten
    }

    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
}
