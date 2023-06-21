/*
 * pwix:options/src/common/js/configure.js
 */

import _ from 'lodash';

pwixOptions._defaults = {
    errOnUnmanaged: false,
    verbosity: OPTS_VERBOSE_NONE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both from client and from server
 * @param {Object} o configuration options
 * @returns {Object} the package configuration
 */
pwixOptions.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( pwixOptions._conf, pwixOptions._defaults, o );
        // be verbose if asked for
        if( pwixOptions._conf.verbosity & OPTS_VERBOSE_CONFIGURE ){
            console.debug( 'pwix:admin-first configure() with', o, 'building', pwixOptions._conf );
        }
    }
    // also acts as a getter
    return pwixOptions._conf;
}

_.merge( pwixOptions._conf, pwixOptions._defaults );
