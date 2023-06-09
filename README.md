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

The package's behavior can be configured through a call to the `pwixOptions.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `errOnUnmanaged`

    Whether an unmanaged option, which do not have any implementation method, should trigger an error.

    Defaults to `false`.

- `verbosity`

    Define the expected verbosity level.

    The accepted value can be:

    - `OPTS_VERBOSE_NONE`

        Do not display any trace log to the console

    or any or-ed combination of following:

    - `OPTS_VERBOSE_CONFIGURE`

        Trace `pwixOptions.configure()` calls and their result

Please note that `pwixOptions.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `pwixOptions.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## What does it provide ?

### `pwixOptions`

The globally exported object.

### Classes

- `pwixOptions.Options`

    The class to be derived by the consumer.

    - `Options( [options] )`

        The constructor.

        It accepts an optional list of options as an argument.

        If the caller expects the option values to change over the time, then it should also call the below `set()` method from inside an `autorun()` section.

    - `set( options )`

        Set the new option values.

    - `getset_Bool_Fn( name, value [, opts ] )`

        Manage a boolean argument.

        Accepts also as a value a function which returns a boolean argument.

        `opts` is an optional option object with keys:

        - `check`

            An optional check function, called with the provided value, must return `true` or `false`

        - `default`

            An optional default value, or a function which returns the default value

        Note that if the returned/computed value is not valid according to the `check()` function, then we return the default value, which may itself be undefined. If the caller has not provided any valid default value, he must so prepare to handle that.

    - `getset_Bool_Fn( name, value [, opts ] )`

        Manage a boolean argument.

        Accepts also as a value a function which returns a boolean argument.

    - `getset_Fn( name, value [, opts ] )`

        Manage a function argument.

    - `getset_Integer_Fn( name, value [, opts ] )`

        Manage an integer argument.

        Accepts also as a value a function which returns an integer argument.

    - `getset_String_Array_Fn( name, value [, opts ] )`

        Manage a string or an array of strings.

        Accepts also as a value a function which returns a string or an array of strings.

    - `getset_String_Fn( name, value [, opts ] )`

        Manage a string argument.

        Accepts also as a value a function which returns a string argument.

        Besides `check` and `default` keys, `opts` also accepts a `ref` argument which is expected to address an array of accepted values.

    - `getset_String_Fn_Object( name, value [, opts ] )`

        Manage a string or an object.

        Accepts also as a value a function which returns a string or an object.

        This is actually a method to handle internationalization where strings are provided not by their localized text value, but by an object `{ namespace, i18n }`.

### Methods

- `pwixOptions.configure()`

    The configuration method.

## NPM peer dependencies

In accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we do not hardcode NPM dependencies in `package.js`. Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.3.0:

```
    'merge': '^2.1.1'
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-options/pulls).

---
P. Wieser
- Last updated on 2023, June 7th
