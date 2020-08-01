import { promises as fs } from "fs";

let statesJson = [];
let statesAbbr = [];
let citiesJson = [];
let numberOfCitiesByState = [];
let longestNamesArray = [];
let shortestNamesArray = [];

start();

async function start() {
  await loadStatesJson();
  await loadStatesAbbr();
  await loadCitiesJson();
  await createStatesAndCitiesJsonFiles();
  await loadNumberOfCitiesByState();
  await printFiveStatesWithMostCities();
  await printFiveStatesWithLessCities();
  await loadLongestNameCities();
  await printLongestNameCities();
  await loadShortestNameCities();
  await printShortestNameCities();
  await printLongestNameCity();
  await printShortestNameCity();
}

async function loadStatesJson() {
  const data = await fs.readFile(
    "./json_files/base_files/Estados.json",
    "utf-8"
  );
  statesJson = JSON.parse(data);
}

async function loadStatesAbbr() {
  for await (const state of statesJson) {
    statesAbbr.push(state.Sigla);
  }
}

async function loadCitiesJson() {
  const data = await fs.readFile(
    "./json_files/base_files/Cidades.json",
    "utf-8"
  );
  citiesJson = JSON.parse(data);
}

async function createStatesAndCitiesJsonFiles() {
  let stateCities = [];

  for await (const state of statesJson) {
    stateCities = citiesJson.filter((city) => {
      return city.Estado === state.ID;
    });
    await fs.writeFile(
      `./json_files/${state.Sigla}.json`,
      JSON.stringify(stateCities)
    );
  }
}

async function countCities(stateAbbr) {
  const stateCities = await fs.readFile(
    `./json_files/${stateAbbr}.json`,
    "utf-8"
  );
  return JSON.parse(stateCities).length;
}

async function loadNumberOfCitiesByState() {
  for await (const abbr of statesAbbr) {
    const number = await countCities(abbr);
    numberOfCitiesByState.push({ stateAbbr: abbr, cities: number });
  }
}

async function printFiveStatesWithMostCities() {
  numberOfCitiesByState.sort((a, b) => {
    return b.cities - a.cities;
  });

  const fiveStatesObject = numberOfCitiesByState.slice(0, 5);

  let fiveStatesArray = [];

  for await (const state of fiveStatesObject) {
    fiveStatesArray.push(`${state.stateAbbr} - ${state.cities}`);
  }

  console.log(fiveStatesArray);
}

async function printFiveStatesWithLessCities() {
  numberOfCitiesByState.sort((a, b) => {
    return b.cities - a.cities;
  });

  const fiveStatesObject = numberOfCitiesByState.slice(
    numberOfCitiesByState.length - 5,
    numberOfCitiesByState.length
  );

  let fiveStatesArray = [];

  for await (const state of fiveStatesObject) {
    fiveStatesArray.push(`${state.stateAbbr} - ${state.cities}`);
  }

  console.log(fiveStatesArray);
}

async function returnCitiesSortedByNameLength(stateAbbr) {
  const stateCities = JSON.parse(
    await fs.readFile(`./json_files/${stateAbbr}.json`, "utf-8")
  );
  stateCities.sort((a, b) => {
    // caso o tamanho seja igual, retorna em ordem alfabética
    if (a.Nome.length === b.Nome.length) {
      return a.Nome < b.Nome ? -1 : 1;
    }
    return a.Nome.length - b.Nome.length;
  });
  return stateCities;
}

async function loadLongestNameCities() {
  for await (const abbr of statesAbbr) {
    const cities = await returnCitiesSortedByNameLength(abbr);
    longestNamesArray.push(`${cities[cities.length - 1].Nome} - ${abbr}`);
  }
}

async function loadShortestNameCities() {
  for await (const abbr of statesAbbr) {
    const cities = await returnCitiesSortedByNameLength(abbr);
    shortestNamesArray.push(`${cities[0].Nome} - ${abbr}`);
  }
}

async function printLongestNameCities() {
  console.log(longestNamesArray);
}

async function printShortestNameCities() {
  console.log(shortestNamesArray);
}

async function printLongestNameCity() {
  longestNamesArray.sort((a, b) => {
    // caso os tamanhos sejam iguais, retorna em ordem alfabética
    if (a.length === b.length) {
      return a < b ? -1 : 1;
    }
    return a.length - b.length;
  });
  console.log(longestNamesArray[longestNamesArray.length - 1]);
}

async function printShortestNameCity() {
  shortestNamesArray.sort((a, b) => {
    // caso os tamanhos sejam iguais, retorna em ordem alfabética
    if (a.length === b.length) {
      return a < b ? -1 : 1;
    }
    return a.length - b.length;
  });
  console.log(shortestNamesArray[0]);
}
