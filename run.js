#!/usr/bin/env node
"use strict"

var env2prop= require("./env2prop")

function run(opts){
	var
	  envs= opts&& opts.envs|| process.env,
	  e2p= env2prop({prefixes: opts&& opts.prefixes})
	return function mapTo(o){
		o= o|| {}
		for(var i in envs){
			var
			  p= e2p(i, opts),
			  key= p,
			  val= envs[i],
			  prefix= key[1],
			  target= o
			if(prefix){
				target= o[prefix]|| (o[prefix]= {})
				key= key[0]
			}
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


