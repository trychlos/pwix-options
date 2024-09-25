/*
 * pwix:options/src/common/classes/base.class.js
 *
 * This class manages the configuration options.
 * It is expected to be derived by each consumer.
 * 
 * Rationale: we want most of the options be providable either by their value, or by a function which will return
 *  the value at run time. And, more, we want these options be reactive.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

export class Base {

    // static data
    //

    // private data
    //

    // configuration options as an object which contains one ReactiveVar for each key
    #conf = {};

    // private functions
    //

    // returns the configured default value, or undefined
    _default_value( name ){
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].options && this.#conf[name].options.default ){
            let _default = this.#conf[name].options.default;
            if( typeof _default === 'function' ){
                _default = _default();
            }
            result = _default;
        }
        return result
    }

    // merge provided options with those already registered
    _merge_options( name, opts ){
        if( opts ){
            this.#conf[name] = this.#conf[name] || {};
            this.#conf[name].options = _.merge( {}, this.#conf[name].options || {}, opts );
        }
    }

    // scan the object from higher levels to deeper ones to find the known options
    // - object: the object to be scanned
    // - previous: a string which contains the previous - still unresolved - names
    _scan( object, previous='' ){
        const prefix = previous ? previous+'.' : '';
        const self = this;
        if( object ){
            Object.keys( object ).forEach(( name ) => {
                if( typeof self[prefix+name] === 'function' ){
                    if( !Object.keys( self.#conf ).includes( prefix+name )){
                        self.#conf[prefix+name] = {
                            value: new ReactiveVar(),
                            options: null
                        };
                    }
                    self[prefix+name]( object[name] );
    
                } else if( typeof object[name] === 'object' ){
                    this._scan( object[name], prefix+name );
    
                } else if( Options._conf.errOnUnmanaged ){
                    console.error( self.constructor.name+': unmanaged configuration option \''+prefix+name+'\'' );
                }
            });
        }
    }

    // make sure a ReactiveVar is present, even if the option has not been initialized the first time
    _set_rv( name ){
        if( !this.#conf[name].value ){
            this.#conf[name].value = new ReactiveVar();
            //console.debug( 'definining RV for', name );
        }
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     *
     * @param {Object} options the options to be managed (optional)
     *  The options can be passed to the class either at construction time, and/or through the base_set() method.
     *  Rationale: option values may change over the time, and we do not want this class be a break to their reactivity.
     *  The caller may pass options to this constructor, but should too call the base_set() method from an autorun() section.
     *
     * @returns {Base}
     */
    constructor( options ){
        if( arguments.length >= 1 ){
            this.base_set( options );
        }
        return this;
    }

    /**
     * @summary Get or set a configuration option as a boolean or a function
     * @param {String} name 
     * @param {Boolean|Function} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     * @returns {Boolean}
     *  if the returned/computed value is not valid according to the check function, then we return the default value
     *  which may happen to be undefined :(
     */
    base_gsBoolFn( name, value, opts={} ){
        // if have options, merge them
        this._merge_options( name, opts );
        this._set_rv( name );
        // as a setter, set the provided value
        if( value !== undefined ){
            if( value === true || value === false || typeof value === 'function' ){
                //console.log( name, 'set value to', value );
                this.#conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
        }
        // as a getter
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].value ){
            result = this.#conf[name].value.get();
        }
        if( typeof result === 'function' ){
            result = result();
        }
        if( result === undefined ){
            result = this._default_value( name );
        }
        if( result !== true && result !== false
            && ( this.#conf[name].options.check && typeof this.#conf[name].options.check === 'function' && !this.#conf[name].options.check( result ))
            && ( this.#conf[name].options.default !== undefined )){
                result = this._default_value( name );
            }
        return result;
    }

    /**
     * @summary Get or set a configuration option as a function
     * @param {String} name
     * @param {Function} value
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, either a function or null
     * @returns {Function}
     *  if the returned/computed value is not valid according to the check function, then we return the default value
     *  which may happen to be undefined :(
     */
    base_gsFn( name, value, opts={} ){
        // if have options, merge them
        this._merge_options( name, opts );
        this._set_rv( name );
        // as a setter, set the provided value
        if( value !== undefined ){
            if( value === null || typeof value === 'function' ){
                this.#conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
        }
        // as a getter
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].value ){
            result = this.#conf[name].value.get();
        }
        if( result === undefined ){
            result = this._default_value( name );
        }
        if( result !== undefined ){
            if( this.#conf[name].options.check && typeof this.#conf[name].options.check === 'function' && !this.#conf[name].options.check( result )){
                result = this._default_value( name );
            }
        }
        return result;
    }

    /**
     * @summary Get or set a configuration option as an integer or a function
     * @param {String} name 
     * @param {Integer|Function} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     * @returns {Integer}
     *  if the returned/computed value is not valid according to the check function, then we return the default value
     *  which may happen to be undefined :(
     */
    base_gsIntegerFn( name, value, opts={} ){
        // if have options, merge them
        this._merge_options( name, opts );
        this._set_rv( name );
        // as a setter, set the provided value
        if( value !== undefined ){
            if( typeof value === 'function' ){
                this.#conf[name].value.set( value );
            } else {
                this.#conf[name].value.set( parseInt( value ));
            }
        }
        // as a getter
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].value ){
            result = this.#conf[name].value.get();
        }
        if( typeof result === 'function' ){
            result = result();
        }
        if( result === undefined ){
            result = this._default_value( name );
        }
        if( result !== undefined ){
            if( this.#conf[name].options.check && typeof this.#conf[name].options.check === 'function' && !this.#conf[name].options.check( result )){
                result = this._default_value( name );
            }
        }
        return result;
    }

    /**
     * @summary Get or set a configuration option as a string, an array or a function
     * @param {String} name 
     * @param {String|Array|Function} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     * @returns {Array} an array of strings
     */
    base_gsStringArrayFn( name, value, opts={} ){
        // if have options, merge them
        this._merge_options( name, opts );
        this._set_rv( name );
        // as a setter, set the provided value
        if( value !== undefined ){
            if( typeof value === 'string' || Array.isArray( value ) || typeof value === 'function' ){
                this.#conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
        }
        // as a getter
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].value ){
            result = this.#conf[name].value.get();
        }
        if( typeof result === 'function' ){
            result = result();
        }
        if( result === undefined ){
            result = this._default_value( name );
        }
        if( result !== undefined ){
            if( this.#conf[name].options.check && typeof this.#conf[name].options.check === 'function' && !this.#conf[name].options.check( result )){
                result = this._default_value( name );
            }
        }
        result = result || '';
        if( !Array.isArray( result )){
            result = [result];
        }
        return result;
    }

    /**
     * @summary Get or set a configuration option as a string or a function
     * @param {String} name
     * @param {String|Function} value
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     *  ref: an optional array which contains accepted values
     * @returns {String}
     *  if the returned/computed value is not valid according to the check function or the reference array,
     *  then we return the default value - or at least an empty string
     */
    base_gsStringFn( name, value, opts={} ){
        // if have options, merge them
        this._merge_options( name, opts );
        this._set_rv( name );
        // as a setter, set the provided value
        if( value !== undefined ){
            if( typeof value === 'string' || typeof value === 'function' ){
                this.#conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
        }
        // as a getter
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].value ){
            result = this.#conf[name].value.get();
        }
        if( typeof result === 'function' ){
            result = result();
        }
        if( result === undefined ){
            result = this._default_value( name );
        }
        if( result !== undefined ){
            if(( this.#conf[name].options.check && typeof this.#conf[name].options.check === 'function' && !this.#conf[name].options.check( result ))
                || ( this.#conf[name].options.ref && Array.isArray( this.#conf[name].options.ref ) && !this.#conf[name].options.ref.includes( result ))){
                    result = this._default_value( name );
            }
        }
        return result || '';
    }

    /**
     * @summary Get or set a configuration option as a string or a function
     *  Also accepts an object with 'namespace' and 'i8n' keys
     * @param {String} name 
     * @param {String|Function|Object} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     *  ref: an optional array which contains accepted values
     * @returns {String}
     *  if the returned/computed value is not valid according to the check function or the reference array,
     *  then we return the default value - or at least an empty string
     */
    base_gsStringObjectFn( name, value, opts={} ){
        // if have options, merge them
        this._merge_options( name, opts );
        this._set_rv( name );
        // as a setter, set the provided value
        if( value !== undefined ){
            if( typeof value === 'string' || typeof value === 'function' ){
                this.#conf[name].value.set( value );
            } else if( typeof value === 'object' && Object.keys( value ).includes( 'i18n' ) && Object.keys( value ).includes( 'namespace' )){
                this.#conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
        }
        // as a getter
        let result = undefined;
        if( this.#conf[name] && this.#conf[name].value ){
            result = this.#conf[name].value.get();
        }
        if( typeof result === 'function' ){
            result = result();
        } else if( typeof result === 'object' && Object.keys( result ).includes( 'i18n' ) && Object.keys( result ).includes( 'namespace' )){
            result = pwixI18n.label( result.namespace, result.i18n );
        }
        if( result === undefined ){
            result = this._default_value( name );
        }
        if( result !== undefined ){
            if(( this.#conf[name].options.check && typeof this.#conf[name].options.check === 'function' && !this.#conf[name].options.check( result ))
                || ( this.#conf[name].options.ref && Array.isArray( this.#conf[name].options.ref ) && !this.#conf[name].options.ref.includes( result ))){
                        result = this._default_value( name );
            }
        }
        return result || '';
    }

    /**
     * @returns {Array} the list of defined option names
     */
    base_options(){
        return Object.keys( this.#conf );
    }

    /**
     * @summary Take options or a new version of the options
     * @param {Object} options the options to be managed (may be empty, but must be defined)
     */
    base_set( options ){
        // allocate a new reactive var for each passed option and set it
        this._scan( options );
    }
}
