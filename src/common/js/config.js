/*
 * pwix:options/src/common/js/config.js
 */

import { Options } from '../classes/options.class.js';

pwixOptions = {
    // client-specific data and functions
    client: {},

    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:options configure() with', o );
        pwixOptions.conf = {
	    ...pwixOptions.conf,
	    ...o
        };
    },

    // server-specific data and functions
    server: {},

    // the exported class
    Options: Options
};
