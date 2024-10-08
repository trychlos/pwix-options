# pwix:options

## ChangeLog

### 2.1.2

    Release date: 2024-10- 4

    - Protect the options scan from reaching a null content
    - Fix the case where a default is defined as a not-defined option
    - Fix the case where a value is set outside of standard scan
    - Make the private variable really private

### 2.1.1

    Release date: 2024- 5-24

    - Meteor 3.0 ready
    - Bump pwix:i18n version requirement

### 2.1.0

    Release date: 2023- 9-11

    - Rename BaseOpt class to Base (bumping candidate version number)

### 2.0.0

    Release date: 2023- 7- 9

    - configure() now also acts as a getter
    - Rename Options class to Base
    - Renamed globally exported pwixOptions to Options
    - Reorganize constants to not pollute global space
    - Define new baseions() method
    - Rename whole API (bumping candidate version number)

### 1.4.1

    Release date: 2023- 6-20

    - Replace merge dependency with lodash

### 1.4.0

    Release date: 2023- 6- 9

    - Define base_gsFn() method
    - Bump pwix:i18n requirement to v 1.3.2

### 1.3.0

    Release date: 2023- 6- 7

    - Define set() method which let us provide reactivity to the option values (at last)

### 1.2.1

    Release date: 2023- 6- 6

    - Add merge dependency (omitted from v 1.2.0)

### 1.2.0

    Release date: 2023- 6- 6

    - Introduce 'pwixOptions.configure()' method
    - Introduce 'errOnUnmanaged' configuration option

### 1.1.0

    Release date: 2023- 2-18

    - Options class has a new getset_String_Fn() method, which doesn't accept a { namespace, key } i18n object
    - Options class now manages configuration objects with more than one level

### 1.0..0

    Release date: 2023- 2-15

    - Initial release

---
P. Wieser
- Last updated on 2024, Oct. 4th
