export function getOptions(
  search: string,
  initialOptions: { [k: string]: string[] },
) {
  //console.log("----");
  const lowerCaseSearch = search.toLowerCase();
  //console.log("lowerCaseSearch:", lowerCaseSearch);
  let options = Object.keys(initialOptions).reduce((acc, option) => {
    const subOptions = initialOptions[option];
    const endString = option.includes(":") ? "" : ":";
    acc = acc.concat(
      subOptions.length === 0
        ? [option]
        : subOptions.map((subOption) => `${option}${subOption}${endString}`),
    );
    return acc;
  }, [] as string[]);
  const searches = lowerCaseSearch.split(" ").filter(Boolean);
  //console.log("searches:", searches);
  for (let [index, search] of searches.entries()) {
    //console.log("index:", index);
    //console.log("search:", search);
    const isTheLastOne = index === searches.length - 1;
    if (!isTheLastOne && search.includes(":")) {
      options = options.filter(
        (option) => !option.startsWith(`${search.split(":")[0]}`),
      );
    } else {
      options = options.filter((option) => option.startsWith(search));
    }
  }
  //console.log("options:", options);
  return options;
}
