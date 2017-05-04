var pkg = require('./package.json');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');

//获取参数
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    ver: 'all' 
  }
})

//注释
,note = [
  '/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.license %> License By <%= pkg.homepage %> */\n <%= js %>'
  ,{pkg: pkg, js: ';'}
]

//模块
,mods = 'jquery,directive,box,form'

//任务
,task = {
  
  //压缩js模块
  minjs: function(ver) {
    ver = ver === 'open';
     
    //可指定模块压缩，eg：gulp minjs --mod 
    var mod = argv.mod ? function(){
      return '(' + argv.mod.replace(/,/g, '|') + ')';
    }() : ''
    ,src = [
      './src/**/*'+ mod +'.js'
      ,'!./src/**/mobile/*.js'
    ]
    ,dir = ver ? 'release' : 'build';    
    

    return gulp.src(src)
    .pipe(uglify())
     .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir));
    
  }
  
  //打包PC合并版JS，即包含lwj.js和所有模块的合并
  ,alljs: function(ver){
    ver = ver === 'open';
    
    var src = [
      './src/**/{lwj,all,'+ mods +'}.js'
      ,'!./src/**/mobile/*.js'
    ]
    ,dir = ver ? 'release' : 'build';
    
    return gulp.src(src)
    // .pipe(uglify())
      .pipe(concat('lwj.all.js', {newLine: ''}))
      .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir +'/app/dest/'));
  }
  
  //打包mobile模块集合
  ,mobile: function(ver){
    
  }
  
  //压缩css文件
  ,mincss: function(ver){
    ver = ver === 'open';
    
    var src = ['./src/css/**/*.css']
    ,dir = ver ? 'release' : 'build'
    ,noteNew = JSON.parse(JSON.stringify(note));
    noteNew[1].js = '';
    return gulp.src(src).pipe(minify({
      compatibility: 'ie7'
    })).pipe(header.apply(null, noteNew))
    .pipe(gulp.dest('./'+ dir +'/css'));
  }
  
  //复制iconfont文件
  ,font: function(ver){
    ver = ver === 'open';
    
    var dir = ver ? 'release' : 'build';
    
    return gulp.src('./src/font/*')
    .pipe(rename({}))
    .pipe(gulp.dest('./'+ dir +'/font'));
  }
  
  //复制组件可能所需的非css和js资源
  ,mv: function(ver){
    ver = ver === 'open';
    
    var src = ['./src/**/*.{png,jpg,gif,html,mp3,json}']
    ,dir = ver ? 'release' : 'build';
    
        
    gulp.src(src).pipe(rename({}))
    .pipe(gulp.dest('./'+ dir));
  }
};

//清理
gulp.task('clear', function(cb) {
  return del(['./build/*'], cb);
});
gulp.task('clearRelease', function(cb) {
  return del(['./release/*'], cb);
});

gulp.task('minjs', task.minjs);
gulp.task('alljs', task.alljs);
gulp.task('mobile', task.mobile);
gulp.task('mincss', task.mincss);
gulp.task('font', task.font);
gulp.task('mv', task.mv);

//开源版
gulp.task('default', ['clearRelease'], function(){ //命令：gulp
  for(var key in task){
    console.log(task[key]);
    task[key]('open');
  }
});

//完整任务
gulp.task('all', ['clear'], function(){ //命令：gulp all，过滤lwj：gulp all --open
  for(var key in task){
    task[key]();
  }
});