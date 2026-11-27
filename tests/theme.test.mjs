import test from 'node:test';
import assert from 'node:assert/strict';
import {isTheme, resolvedTheme} from '../src/lib/theme.ts';
test('theme preferences validate persisted values and resolve system changes',()=>{
 assert.equal(isTheme('dark'),true);
 assert.equal(isTheme('invalid'),false);
 assert.equal(isTheme(null),false);
 assert.equal(resolvedTheme('system',true),'dark');
 assert.equal(resolvedTheme('system',false),'light');
 assert.equal(resolvedTheme('light',true),'light');
 assert.equal(resolvedTheme('dark',false),'dark');
});
