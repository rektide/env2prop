"use strict"

function findDirs( cwd){
	cwd= cwd|| process.cwd()
	var fs= require("fs")
	return new Promise(function( resolve, reject){
		fs.readdir( cwd, function( err, files){
			var all= files.map(function( file){
				return new Promise(function( _resolve, _reject){
					fs.stat( file, function( err, stat){
						if( err){
							_reject(err)
						}
						else {
							_resolve({ file, stat})
						}
					})
				})
			})
			Promise.all( all).then( filter).then(resolve, reject)
		})
	})
}

function filter(fileStat){
	return fileStat.filter(s=> s.stat.isDirectory()).map(s=> s.file)
}

module.exports= findDirs
