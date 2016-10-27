# devoc

> A **free** and **open-source lexicon** for programming-related terms!

The data is stored in [JSON files](src/data/) and can be accessed from [the web interface](https://tleb.github.io/devoc/).

## Adding a new term or a translation

Every term must first be defined in english before they can be translated.
Every JSON file contains an object where keys are the unique IDs of the terms.
Each term is an object with the following properties:

* `name`: a string containing, well, you guessed, the name ;
* `abbrs`: an array of strings of the abbreviations the term can have ;
* `desc`: a description of the term, the definition ;
* `ressources`: an object containing links related to the term and strings describing those links as keys ;
* `related`: **only if in [en-US.json](src/data/en-US.json)**, used to link a term to other ones, using an array of IDs (as strings).
