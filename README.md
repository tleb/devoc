# devoc

> A free and open-source lexicon for programming-related terms!

The data is stored in a [JSON file](src/data.json) and can be accessed from [the web interface](tleb.github.io/devoc/).

## Contribute

The JSON file is an array of every term. Here is an example term:

```json
{
    "en": {
        "name": "english name",
        "abbrs": ["first english abbreviation", "second"],
        "desc": "english description",
        "ressources": {
            "first english ressource text": "first english ressource url",
            "second": "second"
        }
    },
    "fr": {
        "name": "french name",
        "abbrs": ["first french abbreviation", "second"],
        "desc": "french description",
        "ressources": {
            "first french ressource text": "first french ressource url",
            "second": "second"
        }
    }
}
```
