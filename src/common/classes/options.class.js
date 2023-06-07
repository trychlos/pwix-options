/*
 * pwix:options/src/common/classes/options.class.js
 *
 * This class manages the configuration options.
 * It is expected to be derived by each consumer.
 * 
 * Rationale: we want most of the options be providable either by their value, or by a function which will return
 *  the value at run time. And, more, we want these options be reactive.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { pwixI18n } from 'meteor/pwix:i18n';

export class Options {

    // static data
    //

    // private data
    //

    // configuration options as an object which contains one ReactiveVar for each key
    _conf = {};

    // private functions
    //

    // scan the object from higher levels to deeper ones to find the known options
    // - object: the object to be scanned
    // - previous: a string which contains the previous - still unresolved - names
    _scan( object, previous='' ){
        const prefix = previous ? previous+'.' : '';
        const self = this;

        Object.keys( object ).every(( name ) => {
            if( typeof self[prefix+name] === 'function' ){
                if( !Object.keys( self._conf ).includes( prefix+name )){
                    self._conf[prefix+name] = {
                        value: new ReactiveVar(),
                        options: null
                    };
                }
                self[prefix+name]( object[name] );

            } else if( typeof object[name] === 'object' ){
                this._scan( object[name], prefix+name );

            } else if( pwixOptions._conf.errOnUnmanaged ){
                console.error( self.constructor.name+': unmanaged configuration option \''+prefix+name+'\'' );
            }

            return true;
        });
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     *
     * @param {Object} options the options to be managed (optional)
     *  The options can be passed to the class either at construction time, and/or through the set() method.
     *  Rationale: option values may change over the time, and we do not want this class be a break to their reactivity.
     *  The caller may pass options to this constructor, but should too call the set() method from an autorun() section.
     *
     * @returns {acOptions}
     */
    constructor( options ){
        if( arguments.length >= 1 ){
            this.set( options );
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
    getset_Bool_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( value === true || value === false || typeof value === 'function' ){
                //console.log( name, 'set value to', value );
                this._conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        //console.log( name, 'set result to', result );
        if( typeof result === 'function' ){
            result = result();
        }
        if( result !== true && result !== false
            && ( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result ))
            && ( this._conf[name].options.default !== undefined )){

                let _default = this._conf[name].options.default;
                if( typeof _default === 'function' ){
                    _default = _default();
                }
                result = _default;
        }
        //console.log( name, 'return result', result );
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
    getset_Integer_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else {
                this._conf[name].value.set( parseInt( value ));
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        }
        if( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result )){
            let _default = this._conf[name].options.default;
            if( typeof _default === 'function' ){
                _default = _default();
            }
            result = _default;
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
    getset_String_Array_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'string' || Array.isArray( value ) || typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
            //console.log( this );
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        }
        if( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result )){
            let _default = this._conf[name].options.default;
            if( typeof _default === 'function' ){
                _default = _default();
            }
            result = _default;
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
    getset_String_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'string' || typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        }
        if(( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result ))
            || ( this._conf[name].options.ref && Array.isArray( this._conf[name].options.ref ) && !this._conf[name].options.ref.includes( result ))){

                let _default = this._conf[name].options.default;
                if( typeof _default === 'function' ){
                    _default = _default();
                }
                result = _default;
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
    getset_String_Fn_Object( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'string' || typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else if( typeof value === 'object' && Object.keys( value ).includes( 'i18n' ) && Object.keys( value ).includes( 'namespace' )){
                this._conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        } else if( typeof result === 'object' && Object.keys( result ).includes( 'i18n' ) && Object.keys( result ).includes( 'namespace' )){
            result = pwixI18n.label( result.namespace, result.i18n );
        }
        if(( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result ))
            || ( this._conf[name].options.ref && Array.isArray( this._conf[name].options.ref ) && !this._conf[name].options.ref.includes( result ))){

                let _default = this._conf[name].options.default;
                if( typeof _default === 'function' ){
                    _default = _default();
                }
                result = _default;
        }
        return result || '';
    }

    /**
     * @summary Take options or a new version of the options
     * @param {Object} options the options to be managed (may be empty, but must be defined)
     */
    set( options ){
        // allocate a new reactive var for each known option and set it
        this._scan( options );
    }
}
