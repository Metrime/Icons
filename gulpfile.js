var gulp = require("gulp");
var g = require("gulp-load-plugins")({camelize:true});
var map = require("map-stream");

gulp.task('clean-build',function(){
	var stream = gulp.src(['build/src','build/css'])
	.pipe(g.clean());
	return stream;
})

gulp.task('appendCodepoints',['clean-build'],function(){
	var stream = gulp.src('src/*.svg')
	.pipe(gulp.dest('temp'))
	.pipe(g.svgicons2svgfont({fontName:'icon',appendCodepoints:true}));
	return stream;
});

gulp.task('generateCSS',['appendCodepoints'],function(){
	var stream = gulp.src('temp/*.svg')
	.pipe(g.svgmin())
	.pipe(gulp.dest('build/svg'))
	.pipe(generateCSS())
	.pipe(gulp.dest('build/css'));
	return stream;
});

gulp.task('default',['generateCSS'],function(){
	gulp.src('temp')
	.pipe(g.clean());
});




function generateCSS(){
	return map(function(file,cb){
		file.path = file.path.replace(/svg$/,'css');
		var name = file.path.split(/uE[0-9|A-Z|a-z]+-/).pop().split('.')[0];
		var code = file.path.match(/uE[0-9|A-Z|a-z]+/)[0];
		var css = t('icon.{{name}}:before{ content:"\\{{code}}"; }',{name:name,code:code});
		file.contents = new Buffer(css);
		return cb(null,file)
	})
}

function t(s,d){
 for(var p in d)
   s=s.replace(new RegExp('{{'+p+'}}','g'), d[p]);
 return s;
}
