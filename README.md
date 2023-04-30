# pwix:options

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

## Example

Say you have a package or an application which accepts a configuration object as:
```
    conf = {
        level: {
            key1: value1,
            key2: value2
        }
        key3: value3
    }
```
So you have to write a class which extends `pwixOptions.Options`  with one method for each configuration parameter:
```
    export class myOptions extends pwixOptions.Options {

        static Constants = [
            KEY_CONSTANT_A,
            KEY_CONSTANT_A
        ];

        /**
        * Constructor
        * @param {Object} options the options to be managed
        *
        * The Options base class takes care of managing the known options, either as a value, or as a function which return a value.
        * In some case where the expected value is a string, the base class also can accept an object with 'namespace' and 'i18n' keys.
        * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
        *
        * @returns {myOptions}
        */
        constructor( options ){
            super( options );
            return this;
        }

        /**
        * Getter/Setter
        * @param {String|Function} value the prefix of the collection's name
        * @returns {String}
        */
        'level.key1'( value ){
            return this.getset_String_Array_Fn( 'level.key1', value, { default: defaults.level.key1 });
        }

        /**
        * Getter/Setter
        * @param {String|Function} value the default access mode of a new forum
        * @returns {String}
        */
        'level.key2'( value ){
            return this.getset_String_Fn( 'level.key2', value, { default: defaults.level.key1, ref: myOptions.Constants });
        }

        /**
        * Getter/Setter
        * @param {String|Function} value the default access mode of a new forum
        * @returns {String}
        */
        key3( value ){
            return this.getset_Integer_Fn( 'key3', value, { default: defaults.common.key3 });
        }
    }
```

## Configuration

None at the time.

## What does it provide ?

### An exported object

`pwixOptions`

This object mainly embed the `Options` class to be derived by the consumer.

## NPM peer dependencies

In accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we do not hardcode NPM dependencies in `package.js`. Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0: _none_

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-options/pulls).

---
P. Wieser
- Last updated on 2023, Apr. 30th
