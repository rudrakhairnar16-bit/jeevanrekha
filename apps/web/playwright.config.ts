import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:'http://127.0.0.1:3000'},reporter:'list',projects:[{name:'readable-story',testIgnore:/(cinema|rescue)\.spec\.ts/},{name:'cinema-chromium',testMatch:/(cinema|rescue)\.spec\.ts/,use:{browserName:'chromium',launchOptions:{args:['--enable-unsafe-swiftshader']}}}]});
