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
			  key= env2prop(i),
			  val= envs[i]
			o[key]= val
		}
		return o
	}
}

function main(){
	var
	  r= module.exports.run()(),
	  json= JSON.stringify(r)
	console.log(json)
}
module.exports= function run(){
	return module.exports.run()
}
module.exports.run= run
module.exports.main= main

if(require.main=== module){
	module.exports.main()
}


