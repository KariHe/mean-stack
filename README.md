MEAN stack
==========
MEAN stack is boilerplate that provides starting point for creating 
web service/application. It is based on a create work done by 
Linnova http://www.mean.io/


Getting started
===============

Installation
------------
Install node.js to your PC, if using Ubuntu 12.04 which have older node 
version use following command to add extra repository to apt:
> sudo add-apt-repository ppa:chris-lea/node.js
> sudo apt-get update
> sudo apt-get install nodejs


If you already have node installed then just issue command and all needed 
modules will be installed
> npm install

If you don't have Grunt installed on your computer then give following command:
> npm install -g grunt

Running
-------

Build assets and application components
> grunt build

And then start server
> node server.js

If developping then you should use Grunt task for it. It will build everything
 and starts the server, if something changes then server is restarted or 
components rebuilt. 
> grunt dev


Server configuration
--------------------
Configuration files are placed under config/ directory. There are JSON file
for each environment type; production, development and test. Configuration is
loaded on server start based on NODE_ENV environment variable, and if it is
not defined then it is set to 'development'. All config options can be override
from command line, example.
> node server.js --port 12345 --prefix meanstack 

Development
-----------
There is special thing to notice with configuration and development, this 
stack is designed so that multiple application can be executed in same domain.

Example, you have one application in mydomain.com/app1 and other running 
mydomain.com/app2. Both are separate node instance and you can use like nginx 
as proxy to pass traffic to correct node instance ('/app1' and '/app2'). 

In node configuration there is key 'prefix' that can be used to change node 
instance URL path for that. If it is not defined all routes are configured
under root ( http://localhost:3000/ ). If prefix is in configuration, then routes are defined under 
that, example prefix 'meanstack' causes node routes under 
http://localhost:3000/meanstack/. This allows you to change routes so that you
can place application under existing domain and site.

There are some special view helpers done to EJS that you can use; assetUrl()
and localUrl(). These two helpers adds prefix to urls if it is configured, 
look view examples / templates to see how to really use them.
 
Grunt configuration
-------------------
To configure builds and what to include into assets package in grunt build, you
can modify Grunt configuration files in tasks/ directory. There is separate 
configuration file for each task, like server, assets and angular application.
Each file defines own Grunt tasks and is then configured to Grunt, so that
they do not disturb each others. Example, watch configuration in server tasks
only causes server tasks to be built (only server unit tests are exeuted) and 
does not cause angular application to be rebuilt or unit tests to be executed 
and vice versa. 

You can add more task configuration files to the directory if you need more 
separate tasks for your application, like other independent angular application.

If you need other grunt task components and install them with npm, then you 
need to add then to build chain to right place in build order. This you can
find from Grunfile.js as buildOrder array.

License
-------
The MIT License (MIT)

Copyright (c) 2014 Kari Heikkinen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
