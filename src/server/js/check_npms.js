/*
 * pwix:options/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

// whitelisting
if( false ){
}

checkNpmVersions({
    'merge': '^2.1.1'
},
    'pwix:options'
);
