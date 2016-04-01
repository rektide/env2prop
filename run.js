#!/usr/bin/env node
"use strict"

var env2prop= require( "./env2prop")

function run( opts){
	var
	  envs= opts&& opts.envs|| process.env,
	  e2p= env2prop({ prefixes: opts&& opts.prefixes})
	return function mapTo( o){
		o= o|| {}
		for(var i in envs){
			var
			  p= e2p( i, opts),
			  key= p,
			  val= envs[ i],
			  prefix= key[ 1],
			  target= o
			if(prefix){
				target= o[ prefix]|| (o[ prefix]= {})
				key= key[ 0]
			}
			target[ key]= val
		}
		return o
	}
}

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

function autoPrefix( opts){
	var
	  dir= opts&& opts.dir|| process.cwd(),
	  pre= opts&& opts.prefixes
	return findDirs( dir).then( dirs=> {
		var
		  prefixes= pre? dirs.concat(pre): dirs,
		  opts= { prefixes},
		  r= run( opts)
		return r
	})
}

function mainBasic(){
	var
	  prefixes= process.argv.splice( 2),
	  r= module.exports.run({ prefixes})(),
	  json= JSON.stringify( r)
	console.log( json)
}

function main(){
	var
	  prefixes= process.argv.splice( 2),
	  r= module.exports.autoPrefix({ prefixes}).then(r=> r()),
	  json= r.then(JSON.stringify)
	json.then(console.log)
}

module.exports= function run( opts){
	return module.exports.run( opts)
}
module.exports.run= run
module.exports.mainBasic= mainBasic
module.exports.main= main
module.exports.autoPrefix= autoPrefix

if( require.main=== module){
	process.on("unhandledRejection", console.error)
	module.exports.main()
}

