## Linter

This project uses [StandardJS] as a linter. StandardJS is choosen because of its opinionated nature of linting. There are no decisions to make and developers can spend their time designing features.

From the StandardJS website,
```
This module saves you (and others!) time in three ways:

- No configuration. The easiest way to enforce code quality in your project. No decisions to make. No .eslintrc files to manage. It just works.
- Automatically format code. Just run standard --fix and say goodbye to messy or inconsistent code.
- Catch style issues & programmer errors early. Save precious code review time by eliminating back-and-forth between reviewer & contributor.
```

### Installing

StandardJS has been added as a dev dependency to packages.json.

```
$ npm install
```

### Running locally

For just knowing the errors,
```
$ ./node_modules/.bin/standard
```

For fixing the errors as well,
```
$ ./node_modules/.bin/standard --fix
```

### VS Code Integration

Install the extension [vscode-standard] and ensure that no other JS linting extensions are installed. Otherwise they clash with each other.

[StandardJS]: https://standardjs.com/
[vscode-standard]: https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard
