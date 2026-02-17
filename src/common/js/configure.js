/*
 * pwix:options/src/common/js/configure.js
 */

import _ from 'lodash';

let _conf = {};
Options._conf = new ReactiveVar( _conf );

Options._defaults = {
    errOnUnmanaged: false,
    verbosity: Options.C.Verbose.NONE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both from client and from server
 * @param {Object} o configuration options
 * @returns {Object} the package configuration
 */
Options.configure = function( o ){
    if( o && _.isObject( o )){
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( Options._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                console.warn( 'pwix:options configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( Options._defaults, _conf, built_conf );
            Options._conf.set( _conf );
            // be verbose if asked for
            if( _conf.verbosity & Options.C.Verbose.CONFIGURE ){
                console.debug( 'pwix:options configure() with', built_conf );
            }
        }
    }
    // also acts as a getter
    return Options._conf.get();
}

_conf = _.merge( {}, Options._defaults );
Options._conf.set( _conf );
