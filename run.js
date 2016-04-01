#!/usr/bin/env node
"use strict"

var env2prop= require( "./env2prop")

/**
  Create a function that can create an env2prop-ed object of `envs`.
  @option {Object} [envs=process.env] a an object of environment variables.
  @option {bool} [updateOnly=false] instead of creating an object, expect an existing object and only update existing fields on it. Useful for normalizing output, via a provided default object.
  @option {Array<String>} [prefixes] the start of each environmental variable will be compared to prefixes, and if matched, a subobject of the prefix name will be created, and the de-prefixed key, and the environmental variables value will be created underneath the sub-object.
*/
function run( opts){
	if( opts&& opts.autoPrefix){
		return autoPrefix( opts)
	}
	var
	  envs= opts&& opts.envs|| process.env,
	  updateOnly= opts&& opts.updateOnly,
	  e2p= env2prop({ prefixes: opts&& opts.prefixes})
	return function mapTo( o){
		o= o|| {}
		for(var i in envs){
			var
			  p= e2p( i, opts),
			  key= p,
			  val= envs[ i],
			  prefix= key[ 1],
			  target= o,
			  doRun= !updateOnly
			if(prefix){
				target= o[ prefix]|| (o[ prefix]= {})
				key= key[ 0]
				doRun= true
			}else if( updateOnly&& target[ key]!== undefined){
				doRun= true
			}
			if( doRun){
				target[ key]= val
			}
		}
		return o
	}
}

function mainBasic(){
	var
	  prefixes= process.argv.splice( 2),
	  r= module.exports.run({ prefixes})(),
	  json= JSON.stringify( r)
	console.log( json)
}

/**
  Add all directories under `cwd` as prefixes, then {@link run}.
  @option [dir=process.cwd()] the directory to look for subdirectories to make prefixes out of.
  @option [run=run] the env2prop object constructor, defaulting to run.
*/
function autoPrefix( opts){
	var
	  dir= opts&& opts.dir|| process.cwd(),
	  pre= opts&& opts.prefixes,
	  r= opts&& opts.run|| run
	return require( "./util/findDirs")( dir).then( dirs=> {
		var prefixes= pre? dirs.concat( pre): dirs
		opts.prefixes= prefixes
		var val= r( opts)
		opts.prefixes= pre
		return val
	})
}

/**
  Run env2prop on process.env. Uses autoPrefix, and adds any arguments as prefixes.
*/
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
module.exports.autoPrefix= autoPrefix
module.exports.main= main

if( require.main=== module){
	process.on("unhandledRejection", console.error)
	module.exports.main()
}

