console.log("common front enabled!")

/**
 * Выполнить регулярное выражение в строке и вернуть `Array`
 */
function regex_findall(regex, str) {
    let m;

    var result = []

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            // console.log(`Found match, group ${groupIndex}: ${match}`);
            result.push(match);
        });
    }
    return result;
}
