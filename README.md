NGCONCAT
=========

NGCONCAT is lightweight tool to concat your Angular.js application in one file.

Plugins
--
<a href="https://github.com/galkinrost/grunt-ngconcat">Grunt</a>
<br>
<a href="https://github.com/galkinrost/gulp-ngconcat">Gulp</a>

Install
--
```sh
npm install ngconcat
```

API
--

```javascript
var concat=require('concat');

concat('/**/*.js',function(err,contents){
    require('fs').writeFile('app.build.js',contents);
});
```

License
----

MIT

