/*
 * pwix:options/src/common/js/configure.js
 */

import _ from 'lodash';

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
        _.merge( Options._conf, Options._defaults, o );
        // be verbose if asked for
        if( Options._conf.verbosity & Options.C.Verbose.CONFIGURE ){
            console.debug( 'pwix:admin-first configure() with', o, 'building', Options._conf );
        }
    }
    // also acts as a getter
    return Options._conf;
}

_.merge( Options._conf, Options._defaults );
