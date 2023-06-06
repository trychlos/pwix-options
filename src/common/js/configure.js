/*
 * pwix:options/src/common/js/configure.js
 */

import merge from 'merge';

pwixOptions._defaults = {
    errOnUnmanaged: false,
    verbosity: OPTS_VERBOSE_NONE
};

pwixOptions.configure = function( o ){
    pwixOptions._conf = merge.recursive( true, pwixOptions._defaults, o );

    // be verbose if asked for
    if( pwixOptions._conf.verbosity & OPTS_VERBOSE_CONFIGURE ){
        console.debug( 'pwix:admin-first configure() with', o, 'building', pwixOptions._conf );
    }
}

pwixOptions._conf = merge.recursive( true, pwixOptions._defaults );
