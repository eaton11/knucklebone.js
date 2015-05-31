<br>  
<br>  
<br>  
<p align="center">
<img src="logo.png"> 	
</p>
<br>  
<br>  
<br>  
<br>  


# knucklebone.js
Lightweight, Streamable, and Modular, AJAX library for the client

[![GitHub version](https://badge.fury.io/gh/eaton11%2Fknucklebone.svg)](http://badge.fury.io/gh/eaton11%2Fknucklebone) <img src="https://img.shields.io/badge/license-MIT-blue.svg"> <img src="https://img.shields.io/badge/bower-knucklebone-yellow.svg"> 


<br>


## Overview of Knucklebone

####Initiate an AJAX call or series:
```javascript
knucklebone()
```

####To specify the request type, there are 2 methods
- `get()`
- `post()`

```javascript
knucklebone().get('path/to/file')
```
```javascript
knucklebone().post('path/to/file', dataToSend)
```

####There are 3 methods that can handle the response(s):
- `success` - receives any *succesful* responses
- `error` - receives any *errored* responses and timeout responses
- `response` - receives *any/all* responses (general purpose)

These methods are all implemented using a promise style. They are not called unless prerequisites are met. They are all optional.
```javascript
knucklebone().get("path/to/file")
.success( function(res){} )
.error( function(res){} )
.response( function(res){} )
```
To encourage consistency, they will always be called in this order: (1)`success`, (2)`error`, (3)`response`.  
The order that they are attached to the `knucklebone()` object doesn't matter, they will still be called in that order after the response(s) is/are returned.  

<br>  

##Power Features

Knucklebone's power features include:
- **Multi-call Packaging**
- **Single-call and Mutli-call Streaming**
- **Pausing (delaying) and Playing (resuming) Calls (especially with form collaboration)**
- **Modularity of Methods**

- - -

####Mutli-call Packages
Multi-call packaging allows you to make multiple requests in one call and get an array of all of the responses when they are all completed. It works for both get and post requests.
#####Simple Example
```javascript
knucklebone()
.get(["cats.json", "dogs.json", "rabbits.json"])
.success(function(res){
	console.log(res); // array of responses
})
```
#####The `each` Method
The `each()` method allows for easy manipulation of the response data. It takes a function that will be applied to each response. (*only arrays of multiple responses have the `each` method*)
```javascript
knucklebone()
.get(["cats.json", "dogs.json", "rabbits.json"])
.success(function(res){

	res.each(function(res){
		console.log(res); // a single response
	})
  
})
```
#####Targeting One of the Responses Individually
How do you loop through the responses and only react to a single specific response? Easy. Thats where the reponses sweetening that knucklebone adds really shines. One of the properties that knucklebone adds to the responses is a string that contains the original query, called `query`. Here is how you traget only the `cats.json` file:
```javascript
knucklebone()
.get(["cats.json", "dogs.json", "rabbits.json"])
.success(function(res){

	res.each(function(res){
		if(res.query == "cats.json"){
			console.log(res); // the cats.json response
		}
	})
  
})
```

- - -

####Single- and Multi-call Streaming
This is very powerful feature of knucklebone. It allows you to open up an I/O pipe that can take in any number of request urls and will deliver each response asynchronously as they are completed.   

All that is needed to start a stream is to specify the stream option when initiating the knucklebone instance `knucklebone({stream:true})`.  (*each response is returned individually, therfore the `each()` method is not needed/available*)  
#####Simple Example
```javascript
knucklebone({stream:true})
	.get(["cats.json", "dogs.json", "rabbits.json"])
  
	.success(function(res){
		console.log(res);
	})
```

#####Event Reaction
This AJAX pipe allows for an available pipe that you can pass a file path to whenever. This example shows how you could easily fire an AJAX call whenever a certain event occurs (it also shows off the modularity of knucklebone methods):
```javascript
var myKb = knucklebone({stream:true})
	.success(function(res){
		console.log(res);
	});
  
function myEventHandler(newURL) {
	myKb.get(newURL); 
}
```
In the example, each time the `myEventHandler` function fires, knucklebone is ready to send another *get* request for whatever the `newURL` happens to be. When the response is returned, it will be handled by the `success` promise (if it was a successful response, of course). 


#####Continuous Call-Response Cycle
With Request Streaming, knucklebone is ready to stream another request on command. This proves very useful in the `success`, `error`, and/or `response` methods.
In this next example, we will create 2 knucklebone instances, one for getting info, and one for posting errors to a document.
```javascript
var kbPostErrors = knucklebone({stream:true})
	.success(function(res){
		console.log("successful write to error log");
	});


var kbGetDocs = knucklebone({stream:true})
	.get(["path/file1.json","path/file2.json","etc.json"])
	.success(function(res){
		console.log("successfully got: ", res.response);
	})
	error(function(res){
		kbPostErrors.post("location/to/errorLog", res); // log to other knucklebone 
	});
```
You can have the response methods react with an immidiate, new AJAX call. Throw somelogic in there and you'll have a very robust system with very little code.


#####Delay and Resume Calls
By calling the `pause()` method before you call the `get()` or `post()` methods, you can get your call all set up and ready to fire. This allows you to prepare a request and then wait for the right circumstance to finally launch the call. Use the `play()` method to resume the call.

You can pass a function to the `pause` method, which will be run before the request methods, allowing for a convenient spot for logic.
**Simple Example**
```javascript
var getFile = knucklebone()
.pause()
.get("myFile.json")

function playKnucklebone(){
	getFile.play()
}
```
In this example, the `getFile` AJAX call will be paused indefinitely until we call the `playKnucklebone` function. 

######Prevent ajax call if form is not proper  
If you are doing a post request with a form, `pause` will only fire when the form is submitted, and will automatically stop the form from being submitted for you so that you can do some logic. Now that's service! 

Again, you just need to call the `play` method to go on with the request. 

Make sure you pass the form to the `post` method as the second paramter. Knucklebone will automatically parse the form and all of its fields for you and submit it as a post request.

The `pause` method passes you a reference to the current AJAX call so that you can easy manipulate it. In the exmaple we named it `kb`
```html
<form id="superForm">
	<input id="fName" name="fName">
	<input id="age" name="age">
	<input type="submit">
</form>
```
```javascript
var superform = document.getElementById("superForm");
var fName = document.getElementById("fName");
...
knucklebone()
.pause(function(kb){
	// only submit form if fName field is not empty
	if(fName.value.length > 0) kb.play();
})
.post("path/to/send/form", superForm);
```



- - -
<br>

You can pause/delay a request using the `pause` method before you use the `get` or `post` methods:
```javascript
knucklebone.pause().get('path/to/file')
```

This will pause the request indefinitely. There are at least 2 ways to resume the call.

<br>  


- - -   
##### NOTE: BIG 1.0 were just implemented (May 30, 2015) and this README is currently being updated.  
##### All documentation below is pre-1.0 update 
- - -


## How to use knucklebones

<br>

###Getting Data With Ajax

##### GET data:
```javascript
knucklebone().get(path/to/file)
.success(function(res){
  console.log(res);
});
```

##### Passing parameter with a Get request
Get parameters are just passed through the URL, like they always are:
```javascript
knucklebone().get(URL+"?fName=Sam&age=24", callback);
```

__HINT:__ If you are expecting a JSON file back, its already parsed:
```javascript
knucklebone().get(URL, myCallback);

function myCallback(res){
// res.json is the parsed json file
	console.log(res.json); 
};  
```

##### You can have a function run while waiting for the response:
```javascript
knucklebone(pleaseHold).get(URL, myCallback);

function pleaseHold(){
	// do something while you wait
};
```

##### Of course, you could always use anonymous functions:
```javascript
knucklebone(function(){
	// do something while you wait
}).get(URL, function(res){
	console.log(res);
});
```

##### More than one AJAX call at a time? Pshh, we're professionals:
Every time you call the `knucklebone()` function you will create a new object that extends the knucklebone prototype.
So you should just be able to this (asynchronously): 
```javascript
knucklebone().get(URL1, callback1); // one set of data
knucklebone().get(URL2, callback2); // second set of data
// each knucklebone() produces an independent, non-conflicting ajax call
```

###Posting Form Data With Ajax

##### Simple Form Submit:
Pass the whole form to knucklebone, it'll do the rest:
```javascript
// e.g. var formObject = document.getElemenyById("myform");
knucklebone().post(URL, formObject, myCallback);
```

#####Run a function when the form submits (before ajax completes):
```javascript
// 2nd param "true" means call function only if user submits form.
// Otherwise it will run the function immediately when loaded
knucklebone(coolFunc, true).post(URL, formObject, myCallback);

function coolFunc(){
	// do something cool when form submitted
};
```

#####Prevent ajax call if form is not proper:
HTML
```html
<form id="superForm">
	<input id="superField" name="superField">
	<input type="submit">
</form>
```
JavaScript
```javascript
// store initialized knucklebone into variable
var myAJAX = knucklebone(coolFunc, true);
// add post method
myAJAX.post(URL, superForm, myCallback);

// define function to call when form is submitted
function coolFunc(){
	// Setting your ajax object's form.errors property to true prevents ajax call
	// This prevents ajax if if superField is blank
	if(superField.value.length < 1) myAJAX.form.errors = true; 
	// dont forget to set it back to false if no errors
	else myAJAX.form.errors = false; 
};
```

#####Form Submit Listener
There is no need to add a form submit listener before using knucklebone. In fact, knucklebone will automatically add a form submit listener. Therefore, if you use knucklebone inside a form submit handler, it will not run until you submit the form the second time. See the above examples for how to properly use knucklebone with a form.

###Working with the Response Object

####Tapping into the responpse, whether a success or error:
The response is always passed to the callback
```javascript
knucklebone().get(URL, myCallback);

function myCallback(res){ // Name it anything. We named it "res"
	console.log(res); 
}; 
```
or
```javascript
knucklebone().get(URL, function(res){
	console.log(res); 
});
```

####Determining if call was successfull
```javascript
knucklebone().get(URL, function(res){
	if(res.success){
		// yay!
	} else {
		// boo-hoo!
	}
});
```
####All of the properties of the response object:
- **json**  (if expecting json, this holds the parsed object)
- **responseType**  (can be "json", "document", "text", etc.)
- **response**  (can ba an ArrayBuffer, Blob, Document, JavaScript object, or a string)
- **responseText**  (a string or null if ajax failed)
- **responseURL**  (the origin of the response)
- **status**  (the http [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes))
- **statusText**  (the text equivalent to the status code)
- **success**  (BOOL true if status code is successful, else false)

- - -

####Feature Roadmap
- Detect if Request has been sent, but Response not yet returned (a.k.a. Response Pending)
- Be able to *abort* and *resend* an Ajax call

- - -

####Why the name "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. Get it? 
