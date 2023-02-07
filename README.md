# pwix:options - README

## What is it ?

A class to manage configuration options.

### Rationale

Most of the usual configuration options are either boolean or strings, or a derivative of these as array of booleans or array of strings.

We want that our configuration options also accept functions which returns expected result.

More we want these configuration options be reactive.

The exported `Options` class provides the methods required to:

- check the provided option
- check the result of a provided function
- associates each configuration option with a reactive var
- making sure the returned value is compatible with the desired type and is reactive.

## Usage

Add the package to your application.

```
    meteor add pwix:options
```

Then derive the provided `pwixOptions.Options` class once per configuration set, and provide a getter/setter method for each configuration option you want to manage.

## Configuration

None at the time.

## What does it provide ?

### An exported object

`pwixOptions`

This object mainly embed the `Options` class to be derived by the consumer.

## NPM peer dependencies

In accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we do not hardcode NPM dependencies in `package.js`. Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:
```
```
Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-options/pulls).

---
P. Wieser
- Last updated on 2023, Feb. 2nd
