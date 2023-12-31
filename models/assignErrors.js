module.exports.assignErrors = async (linksDict, page, quantity) => {

    const { fetchAnchorElementsWithoutIDs } = require("./fetchAnchorElementsWithoutIDs");
    const startingIndex = page * quantity - quantity;
    const endingIndex = page * quantity - 1;
    const keys = Object.keys(linksDict);

    for (i = startingIndex; i <= endingIndex; i++) {
        const key = keys[i];
        if (linksDict.hasOwnProperty(key)) {
            if (linksDict[key] != []) {
                linksDict[key] = await fetchAnchorElementsWithoutIDs(key);
            }
        }
    }

    return linksDict;
};
