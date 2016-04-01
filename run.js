#!/usr/bin/env node
"use strict"

var env2prop= require("./env2prop")

function run(opts){
	var
	  envs= opts&& opts.envs|| process.env
	return function mapTo(o){
		o= o|| {}
		for(var i in envs){
			var
			  key= env2prop(i, opts),
			  val= envs[i],
			  prefix= key[1] && key[1].toLowerCase(),
			  target= prefix? (o[prefix]|| (o[prefix]= {})): o
			target[key]= val
		}
		return o
	}
}

function main(){
	var
	  prefixes= process.argv.splice(2),
	  r= module.exports.run({prefixes})(),
	  json= JSON.stringify(r)
	console.log(json)
}

module.exports= function run(opts){
	return module.exports.run(opts)
}
module.exports.run= run
module.exports.main= main

if(require.main=== module){
	module.exports.main()
}


