# Custom implementation of the bpmn-js library

This project is a custom bundle of [bpmn-js](https://github.com/bpmn-io/bpmn-js) library.

## Install

1. Clone the repo
    ``` bash
    $> git clone https://github.com/davcs86/bpmn-js-custom-implementation.git
    ```
1. Install the _NPM_ packages
    ```bash
    $> cd bpmn-js-custom-implementation && npm install
    ```
1. Install the _bower_ packages in the `dist` folder
    ```bash
    $> cd dist && bower install
    ```
1. Build the bundle with _grunt_
    ```bash
    $> cd .. && grunt build
    ```
**Additional**
1. Run with BrowserSync with _grunt_
    ```bash
    $> grunt auto-build
    ```

## Known issues:

- The [custom provider](lib/provider/pemwork/PemworkPropertiesProvider.js) is a **super lite & customized** implementation
of the BPMN 2.0. If you want to use a more complete implementation (like BPMN2 or Camunda), change the files:

    - [lib/Viewer.js](lib/Viewer.js#L6) and [lib/Modeler.js](lib/Modeler.js#L5):

        ```js
        // Replace
        require('./provider/pemwork');
        // with
        require('bpmn-js-properties-panel/lib/bpmn');
        // or (for camunda)
        require('bpmn-js-properties-panel/lib/camunda');

        // and remove
        pemwork: require('./descriptor/pemwork.json'),
        ```
